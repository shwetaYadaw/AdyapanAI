import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// ============================================================================
// TOPIC MANAGEMENT
// ============================================================================

// GET /admin/aptitude/topics
router.get('/topics', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const { section } = req.query;
    const where: any = { isActive: true };
    if (section) where.section = section;

    const [topics, total] = await Promise.all([
      prisma.aptitudeTopic.findMany({
        where,
        include: {
          chapters: {
            where: { isActive: true },
            include: { questions: { where: { isActive: true }, select: { id: true } } },
          },
        },
        orderBy: [{ section: 'asc' }, { order: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.aptitudeTopic.count({ where }),
    ]);

    // Attach questionCount to each topic
    const enriched = topics.map((t) => ({
      ...t,
      questionCount: t.chapters.reduce((sum, ch) => sum + ch.questions.length, 0),
    }));

    sendPaginated({ res, data: enriched, total, page, limit });
  } catch (err) { next(err); }
});

// GET /admin/aptitude/topics/:topicId
router.get('/topics/:topicId', async (req, res, next) => {
  try {
    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: req.params.topicId },
      include: {
        chapters: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            questions: {
              where: { isActive: true },
              select: { id: true, statement: true, difficulty: true, createdAt: true },
            },
          },
        },
      },
    });
    if (!topic) throw new AppError('Topic not found', 404);
    sendSuccess({ res, data: topic });
  } catch (err) { next(err); }
});

// POST /admin/aptitude/topics
router.post('/topics', async (req, res, next) => {
  try {
    const { name, section, description, icon, order } = req.body;
    if (!name) throw new AppError('Topic name is required', 400);
    if (!section) throw new AppError('Section is required', 400);

    const existing = await prisma.aptitudeTopic.findUnique({ where: { name } });
    if (existing) throw new AppError('Topic with this name already exists', 409);

    const topic = await prisma.aptitudeTopic.create({
      data: {
        name,
        section,
        description: description || null,
        icon: icon || null,
        order: order || 0,
        createdBy: req.user?.userId,
      },
    });
    sendSuccess({ res, statusCode: 201, data: topic, message: 'Topic created successfully' });
  } catch (err) { next(err); }
});

// PUT /admin/aptitude/topics/:topicId
router.put('/topics/:topicId', async (req, res, next) => {
  try {
    const { name, section, description, icon, order, isActive } = req.body;
    const topic = await prisma.aptitudeTopic.findUnique({ where: { id: req.params.topicId } });
    if (!topic) throw new AppError('Topic not found', 404);

    if (name && name !== topic.name) {
      const existing = await prisma.aptitudeTopic.findUnique({ where: { name } });
      if (existing) throw new AppError('Topic with this name already exists', 409);
    }

    const updated = await prisma.aptitudeTopic.update({
      where: { id: req.params.topicId },
      data: {
        name: name || topic.name,
        section: section || topic.section,
        description: description !== undefined ? description : topic.description,
        icon: icon !== undefined ? icon : topic.icon,
        order: order !== undefined ? order : topic.order,
        isActive: isActive !== undefined ? isActive : topic.isActive,
      },
    });
    sendSuccess({ res, data: updated, message: 'Topic updated successfully' });
  } catch (err) { next(err); }
});

// DELETE /admin/aptitude/topics/:topicId
router.delete('/topics/:topicId', async (req, res, next) => {
  try {
    const topic = await prisma.aptitudeTopic.findUnique({ where: { id: req.params.topicId } });
    if (!topic) throw new AppError('Topic not found', 404);
    await prisma.aptitudeTopic.delete({ where: { id: req.params.topicId } });
    res.setHeader('X-Cache-Invalidate', 'aptitude-topics');
    sendSuccess({ res, statusCode: 200, message: 'Topic deleted successfully' });
  } catch (err) { next(err); }
});

// ============================================================================
// CHAPTER MANAGEMENT
// ============================================================================

// GET /admin/aptitude/topics/:topicId/chapters
router.get('/topics/:topicId/chapters', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where = { topicId: req.params.topicId, isActive: true };
    const [chapters, total] = await Promise.all([
      prisma.aptitudeChapter.findMany({
        where,
        include: { questions: { where: { isActive: true }, select: { id: true } } },
        orderBy: { order: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeChapter.count({ where }),
    ]);
    sendPaginated({ res, data: chapters, total, page, limit });
  } catch (err) { next(err); }
});

// GET /admin/aptitude/topics/:topicId/chapters/:chapterId
router.get('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapter = await prisma.aptitudeChapter.findUnique({
      where: { id: req.params.chapterId },
      include: { questions: { where: { isActive: true }, include: { options: { orderBy: { order: 'asc' } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!chapter || chapter.topicId !== req.params.topicId) throw new AppError('Chapter not found', 404);
    sendSuccess({ res, data: chapter });
  } catch (err) { next(err); }
});

// POST /admin/aptitude/topics/:topicId/chapters
router.post('/topics/:topicId/chapters', async (req, res, next) => {
  try {
    const { name, description, order } = req.body;
    if (!name) throw new AppError('Chapter name is required', 400);
    const topic = await prisma.aptitudeTopic.findUnique({ where: { id: req.params.topicId } });
    if (!topic) throw new AppError('Topic not found', 404);
    const existing = await prisma.aptitudeChapter.findFirst({ where: { topicId: req.params.topicId, name } });
    if (existing) throw new AppError('Chapter with this name already exists in this topic', 409);
    const chapter = await prisma.aptitudeChapter.create({
      data: { topicId: req.params.topicId, name, description: description || null, order: order || 0, createdBy: req.user?.userId },
    });
    sendSuccess({ res, statusCode: 201, data: chapter, message: 'Chapter created successfully' });
  } catch (err) { next(err); }
});

// PUT /admin/aptitude/topics/:topicId/chapters/:chapterId
router.put('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const { name, description, order, isActive } = req.body;
    const chapter = await prisma.aptitudeChapter.findUnique({ where: { id: req.params.chapterId } });
    if (!chapter || chapter.topicId !== req.params.topicId) throw new AppError('Chapter not found', 404);
    const updated = await prisma.aptitudeChapter.update({
      where: { id: req.params.chapterId },
      data: { name: name || chapter.name, description: description !== undefined ? description : chapter.description, order: order !== undefined ? order : chapter.order, isActive: isActive !== undefined ? isActive : chapter.isActive },
    });
    sendSuccess({ res, data: updated, message: 'Chapter updated successfully' });
  } catch (err) { next(err); }
});

// DELETE /admin/aptitude/topics/:topicId/chapters/:chapterId
router.delete('/topics/:topicId/chapters/:chapterId', async (req, res, next) => {
  try {
    const chapter = await prisma.aptitudeChapter.findUnique({ where: { id: req.params.chapterId } });
    if (!chapter || chapter.topicId !== req.params.topicId) throw new AppError('Chapter not found', 404);
    await prisma.aptitudeChapter.delete({ where: { id: req.params.chapterId } });
    sendSuccess({ res, statusCode: 200, message: 'Chapter deleted successfully' });
  } catch (err) { next(err); }
});

// ============================================================================
// FLAT QUESTION ENDPOINTS (Topic-level — across all chapters in a topic)
// ============================================================================

// GET /admin/aptitude/topics/:topicId/questions
// Returns all questions across all chapters in a topic, with search/filter/pagination
router.get('/topics/:topicId/questions', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const { search, difficulty, type } = req.query;

    // Collect chapter IDs for this topic
    const chapters = await prisma.aptitudeChapter.findMany({
      where: { topicId: req.params.topicId, isActive: true },
      select: { id: true },
    });
    const chapterIds = chapters.map((c) => c.id);

    const where: any = { chapterId: { in: chapterIds }, isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (type) where.questionType = type;
    if (search) where.statement = { contains: search as string, mode: 'insensitive' };

    const [questions, total] = await Promise.all([
      prisma.aptitudeQuestion.findMany({
        where,
        include: { options: { orderBy: { order: 'asc' } }, chapter: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aptitudeQuestion.count({ where }),
    ]);

    // Difficulty distribution for the topic
    const byDifficulty = await prisma.aptitudeQuestion.groupBy({
      by: ['difficulty'],
      _count: true,
      where: { chapterId: { in: chapterIds }, isActive: true },
    });

    sendPaginated({
      res,
      data: questions,
      total,
      page,
      limit,
      message: 'Questions fetched successfully',
    });
  } catch (err) { next(err); }
});

// POST /admin/aptitude/topics/:topicId/questions  (creates inside first/default chapter)
router.post('/topics/:topicId/questions', async (req, res, next) => {
  try {
    const { statement, difficulty, options, explanation, stepSolution, formula, hints,
      questionType, imageUrl, tags, xpReward, companies, timeLimit, chapterId } = req.body;

    if (!statement?.trim()) throw new AppError('Question statement is required', 400);
    if (!options || options.length < 2) throw new AppError('At least 2 options are required', 400);
    if (!options.every((o: any) => o.optionKey && o.text?.trim())) throw new AppError('Each option must have a key and text', 400);
    const correctOpt = options.find((o: any) => o.isCorrect === true);
    if (!correctOpt) throw new AppError('One option must be marked as correct', 400);
    if (!difficulty) throw new AppError('Difficulty is required', 400);

    // Resolve chapter: use provided chapterId or auto-create a default one
    let resolvedChapterId = chapterId;
    if (!resolvedChapterId) {
      const topic = await prisma.aptitudeTopic.findUnique({ where: { id: req.params.topicId } });
      if (!topic) throw new AppError('Topic not found', 404);
      let defaultChapter = await prisma.aptitudeChapter.findFirst({
        where: { topicId: req.params.topicId, name: 'General' },
      });
      if (!defaultChapter) {
        defaultChapter = await prisma.aptitudeChapter.create({
          data: { topicId: req.params.topicId, name: 'General', description: 'General questions', order: 0, createdBy: req.user?.userId },
        });
      }
      resolvedChapterId = defaultChapter.id;
    } else {
      const ch = await prisma.aptitudeChapter.findUnique({ where: { id: resolvedChapterId } });
      if (!ch || ch.topicId !== req.params.topicId) throw new AppError('Chapter not found in this topic', 404);
    }

    // Duplicate check
    const duplicate = await prisma.aptitudeQuestion.findFirst({
      where: { chapterId: resolvedChapterId, statement: { equals: statement.trim(), mode: 'insensitive' } },
    });
    if (duplicate) throw new AppError('A question with this statement already exists in this chapter', 409);

    const question = await prisma.aptitudeQuestion.create({
      data: {
        chapterId: resolvedChapterId,
        statement: statement.trim(),
        difficulty: difficulty || 'medium',
        correctOption: correctOpt.optionKey,
        explanation: explanation || null,
        stepSolution: stepSolution || null,
        formula: formula || null,
        hints: hints || null,
        questionType: questionType || 'MCQ',
        imageUrl: imageUrl || null,
        tags: tags || null,
        xpReward: xpReward || 10,
        companies: companies || null,
        timeLimit: timeLimit || 30,
        createdBy: req.user?.userId,
        options: {
          create: options.map((o: any, i: number) => ({
            optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect || false, order: i,
          })),
        },
      },
      include: { options: { orderBy: { order: 'asc' } }, chapter: { select: { id: true, name: true } } },
    });

    sendSuccess({ res, statusCode: 201, data: question, message: 'Question created successfully' });
  } catch (err) { next(err); }
});

// ============================================================================
// QUESTION CRUD (by question ID — chapter-nested for compatibility)
// ============================================================================

// GET /admin/aptitude/topics/:topicId/chapters/:chapterId/questions
router.get('/topics/:topicId/chapters/:chapterId/questions', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const { search, difficulty } = req.query;
    const where: any = { chapterId: req.params.chapterId, isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (search) where.statement = { contains: search as string, mode: 'insensitive' };

    const [questions, total] = await Promise.all([
      prisma.aptitudeQuestion.findMany({ where, include: { options: { orderBy: { order: 'asc' } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.aptitudeQuestion.count({ where }),
    ]);
    sendPaginated({ res, data: questions, total, page, limit });
  } catch (err) { next(err); }
});

// GET /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId
router.get('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId },
      include: { options: { orderBy: { order: 'asc' } }, chapter: { include: { topic: true } } },
    });
    if (!question || question.chapterId !== req.params.chapterId) throw new AppError('Question not found', 404);
    sendSuccess({ res, data: question });
  } catch (err) { next(err); }
});

// POST /admin/aptitude/topics/:topicId/chapters/:chapterId/questions
router.post('/topics/:topicId/chapters/:chapterId/questions', async (req, res, next) => {
  try {
    const { statement, difficulty, options, explanation, stepSolution, formula, hints,
      questionType, imageUrl, tags, xpReward, companies, timeLimit } = req.body;

    if (!statement?.trim()) throw new AppError('Statement is required', 400);
    if (!options || options.length < 2) throw new AppError('At least 2 options required', 400);
    if (!options.every((o: any) => o.optionKey && o.text?.trim())) throw new AppError('Each option needs key + text', 400);
    const correctOpt = options.find((o: any) => o.isCorrect);
    if (!correctOpt) throw new AppError('One option must be correct', 400);
    if (!difficulty) throw new AppError('Difficulty is required', 400);

    const chapter = await prisma.aptitudeChapter.findUnique({ where: { id: req.params.chapterId } });
    if (!chapter || chapter.topicId !== req.params.topicId) throw new AppError('Chapter not found', 404);

    const duplicate = await prisma.aptitudeQuestion.findFirst({
      where: { chapterId: req.params.chapterId, statement: { equals: statement.trim(), mode: 'insensitive' } },
    });
    if (duplicate) throw new AppError('Duplicate question detected in this chapter', 409);

    const question = await prisma.aptitudeQuestion.create({
      data: {
        chapterId: req.params.chapterId, statement: statement.trim(), difficulty: difficulty || 'medium',
        correctOption: correctOpt.optionKey, explanation: explanation || null, stepSolution: stepSolution || null,
        formula: formula || null, hints: hints || null, questionType: questionType || 'MCQ',
        imageUrl: imageUrl || null, tags: tags || null, xpReward: xpReward || 10,
        companies: companies || null, timeLimit: timeLimit || 30, createdBy: req.user?.userId,
        options: { create: options.map((o: any, i: number) => ({ optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect || false, order: i })) },
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });
    sendSuccess({ res, statusCode: 201, data: question, message: 'Question created successfully' });
  } catch (err) { next(err); }
});

// PUT /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId
router.put('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const { statement, difficulty, options, explanation, stepSolution, formula, hints,
      questionType, imageUrl, tags, xpReward, companies, timeLimit, isActive } = req.body;

    const question = await prisma.aptitudeQuestion.findUnique({ where: { id: req.params.questionId }, include: { options: true } });
    if (!question || question.chapterId !== req.params.chapterId) throw new AppError('Question not found', 404);

    let correctOption = question.correctOption;
    if (options?.length > 0) {
      if (!options.every((o: any) => o.optionKey && o.text?.trim())) throw new AppError('Each option needs key + text', 400);
      const correctOpt = options.find((o: any) => o.isCorrect);
      if (correctOpt) correctOption = correctOpt.optionKey;
      await prisma.aptitudeOption.deleteMany({ where: { questionId: req.params.questionId } });
    }

    const updated = await prisma.aptitudeQuestion.update({
      where: { id: req.params.questionId },
      data: {
        statement: statement?.trim() || question.statement,
        difficulty: difficulty || question.difficulty,
        correctOption,
        explanation: explanation !== undefined ? explanation : question.explanation,
        stepSolution: stepSolution !== undefined ? stepSolution : question.stepSolution,
        formula: formula !== undefined ? formula : question.formula,
        hints: hints !== undefined ? hints : question.hints,
        questionType: questionType || question.questionType,
        imageUrl: imageUrl !== undefined ? imageUrl : question.imageUrl,
        tags: tags !== undefined ? tags : question.tags,
        xpReward: xpReward || question.xpReward,
        companies: companies !== undefined ? companies : question.companies,
        timeLimit: timeLimit || question.timeLimit,
        isActive: isActive !== undefined ? isActive : question.isActive,
        updatedBy: req.user?.userId,
        ...(options?.length > 0 && {
          options: { create: options.map((o: any, i: number) => ({ optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect || false, order: i })) },
        }),
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });
    sendSuccess({ res, data: updated, message: 'Question updated successfully' });
  } catch (err) { next(err); }
});

// DELETE /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId
router.delete('/topics/:topicId/chapters/:chapterId/questions/:questionId', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({ where: { id: req.params.questionId } });
    if (!question || question.chapterId !== req.params.chapterId) throw new AppError('Question not found', 404);
    await prisma.aptitudeQuestion.delete({ where: { id: req.params.questionId } });
    sendSuccess({ res, statusCode: 200, message: 'Question deleted successfully' });
  } catch (err) { next(err); }
});

// POST /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/:questionId/duplicate
router.post('/topics/:topicId/chapters/:chapterId/questions/:questionId/duplicate', async (req, res, next) => {
  try {
    const original = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.questionId },
      include: { options: true },
    });
    if (!original || original.chapterId !== req.params.chapterId) throw new AppError('Question not found', 404);

    const copy = await prisma.aptitudeQuestion.create({
      data: {
        chapterId: original.chapterId,
        statement: `[Copy] ${original.statement}`,
        difficulty: original.difficulty,
        correctOption: original.correctOption,
        explanation: original.explanation,
        stepSolution: original.stepSolution,
        formula: original.formula,
        hints: original.hints,
        questionType: original.questionType,
        imageUrl: original.imageUrl,
        tags: original.tags,
        xpReward: original.xpReward,
        companies: original.companies,
        timeLimit: original.timeLimit,
        createdBy: req.user?.userId,
        options: { create: original.options.map((o) => ({ optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect, order: o.order })) },
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });
    sendSuccess({ res, statusCode: 201, data: copy, message: 'Question duplicated successfully' });
  } catch (err) { next(err); }
});

// ============================================================================
// BULK OPERATIONS
// ============================================================================

// POST /admin/aptitude/topics/:topicId/chapters/:chapterId/questions/bulk-delete
router.post('/topics/:topicId/chapters/:chapterId/questions/bulk-delete', async (req, res, next) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds) || questionIds.length === 0) throw new AppError('questionIds array required', 400);
    const result = await prisma.aptitudeQuestion.deleteMany({
      where: { id: { in: questionIds }, chapterId: req.params.chapterId },
    });
    sendSuccess({ res, data: { deleted: result.count }, message: `${result.count} questions deleted` });
  } catch (err) { next(err); }
});

// POST /admin/aptitude/topics/:topicId/bulk-delete-questions
router.post('/topics/:topicId/bulk-delete-questions', async (req, res, next) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds) || questionIds.length === 0) throw new AppError('questionIds array required', 400);

    const chapters = await prisma.aptitudeChapter.findMany({
      where: { topicId: req.params.topicId },
      select: { id: true },
    });
    const chapterIds = chapters.map((c) => c.id);
    const result = await prisma.aptitudeQuestion.deleteMany({
      where: { id: { in: questionIds }, chapterId: { in: chapterIds } },
    });
    sendSuccess({ res, data: { deleted: result.count }, message: `${result.count} questions deleted` });
  } catch (err) { next(err); }
});

// ============================================================================
// BULK IMPORT
// ============================================================================

// POST /admin/aptitude/topics/:topicId/import-questions  (JSON body)
router.post('/topics/:topicId/import-questions', async (req, res, next) => {
  try {
    const { questions, chapterId } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) throw new AppError('questions array required', 400);

    const topic = await prisma.aptitudeTopic.findUnique({ where: { id: req.params.topicId } });
    if (!topic) throw new AppError('Topic not found', 404);

    // Resolve chapter
    let resolvedChapterId = chapterId;
    if (!resolvedChapterId) {
      let defaultChapter = await prisma.aptitudeChapter.findFirst({ where: { topicId: req.params.topicId, name: 'General' } });
      if (!defaultChapter) {
        defaultChapter = await prisma.aptitudeChapter.create({
          data: { topicId: req.params.topicId, name: 'General', description: 'Imported questions', order: 0, createdBy: req.user?.userId },
        });
      }
      resolvedChapterId = defaultChapter.id;
    }

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    for (const q of questions) {
      try {
        if (!q.statement?.trim()) { results.errors.push('Missing statement'); results.skipped++; continue; }
        if (!q.options || q.options.length < 2) { results.errors.push(`"${q.statement.slice(0,40)}": need 2+ options`); results.skipped++; continue; }
        const correctOpt = q.options.find((o: any) => o.isCorrect);
        if (!correctOpt) { results.errors.push(`"${q.statement.slice(0,40)}": no correct answer`); results.skipped++; continue; }

        const exists = await prisma.aptitudeQuestion.findFirst({ where: { chapterId: resolvedChapterId, statement: { equals: q.statement.trim(), mode: 'insensitive' } } });
        if (exists) { results.skipped++; continue; }

        await prisma.aptitudeQuestion.create({
          data: {
            chapterId: resolvedChapterId, statement: q.statement.trim(), difficulty: q.difficulty || 'medium',
            correctOption: correctOpt.optionKey, explanation: q.explanation || null, stepSolution: q.stepSolution || null,
            formula: q.formula || null, hints: q.hints || null, questionType: q.questionType || 'MCQ',
            tags: q.tags || null, xpReward: q.xpReward || 10, companies: q.companies || null, timeLimit: q.timeLimit || 30,
            createdBy: req.user?.userId,
            options: { create: q.options.map((o: any, i: number) => ({ optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect || false, order: i })) },
          },
        });
        results.created++;
      } catch (e: any) {
        results.errors.push(e.message);
        results.skipped++;
      }
    }

    sendSuccess({ res, statusCode: 201, data: results, message: `Import complete: ${results.created} created, ${results.skipped} skipped` });
  } catch (err) { next(err); }
});

// ============================================================================
// EXPORT
// ============================================================================

// GET /admin/aptitude/topics/:topicId/export-questions
router.get('/topics/:topicId/export-questions', async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;
    const chapters = await prisma.aptitudeChapter.findMany({
      where: { topicId: req.params.topicId, isActive: true },
      select: { id: true, name: true },
    });
    const chapterIds = chapters.map((c) => c.id);
    const chapterMap = Object.fromEntries(chapters.map((c) => [c.id, c.name]));

    const questions = await prisma.aptitudeQuestion.findMany({
      where: { chapterId: { in: chapterIds }, isActive: true },
      include: { options: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    const exportData = questions.map((q) => ({
      chapter: chapterMap[q.chapterId],
      statement: q.statement,
      difficulty: q.difficulty,
      questionType: q.questionType,
      options: q.options.map((o) => ({ optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect })),
      correctOption: q.correctOption,
      explanation: q.explanation,
      stepSolution: q.stepSolution,
      formula: q.formula,
      hints: q.hints,
      tags: q.tags,
      xpReward: q.xpReward,
      timeLimit: q.timeLimit,
      companies: q.companies,
    }));

    if (format === 'csv') {
      const headers = ['chapter', 'statement', 'difficulty', 'questionType', 'optionA', 'optionB', 'optionC', 'optionD', 'correctOption', 'explanation', 'tags'];
      const rows = exportData.map((q) => [
        q.chapter, `"${q.statement.replace(/"/g, '""')}"`, q.difficulty, q.questionType,
        q.options[0]?.text || '', q.options[1]?.text || '', q.options[2]?.text || '', q.options[3]?.text || '',
        q.correctOption, `"${(q.explanation || '').replace(/"/g, '""')}"`, q.tags || '',
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="questions-${req.params.topicId}.csv"`);
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="questions-${req.params.topicId}.json"`);
    return res.json(exportData);
  } catch (err) { next(err); }
});

// ============================================================================
// TOPIC STATS
// ============================================================================

// GET /admin/aptitude/topics/:topicId/stats
router.get('/topics/:topicId/stats', async (req, res, next) => {
  try {
    const topic = await prisma.aptitudeTopic.findUnique({ where: { id: req.params.topicId } });
    if (!topic) throw new AppError('Topic not found', 404);

    const chapters = await prisma.aptitudeChapter.findMany({
      where: { topicId: req.params.topicId, isActive: true },
      select: { id: true, name: true },
    });
    const chapterIds = chapters.map((c) => c.id);

    const [totalQuestions, byDifficulty, lastUpdated] = await Promise.all([
      prisma.aptitudeQuestion.count({ where: { chapterId: { in: chapterIds }, isActive: true } }),
      prisma.aptitudeQuestion.groupBy({ by: ['difficulty'], _count: true, where: { chapterId: { in: chapterIds }, isActive: true } }),
      prisma.aptitudeQuestion.findFirst({ where: { chapterId: { in: chapterIds } }, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
    ]);

    sendSuccess({
      res,
      data: {
        topicId: topic.id,
        topicName: topic.name,
        section: topic.section,
        totalChapters: chapters.length,
        totalQuestions,
        byDifficulty: byDifficulty.reduce((acc: any, item: any) => { acc[item.difficulty] = item._count; return acc; }, {}),
        lastUpdated: lastUpdated?.updatedAt || null,
      },
    });
  } catch (err) { next(err); }
});

// ============================================================================
// GLOBAL STATS
// ============================================================================

// GET /admin/aptitude/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [totalTopics, totalChapters, totalQuestions, byDifficulty, bySection] = await Promise.all([
      prisma.aptitudeTopic.count({ where: { isActive: true } }),
      prisma.aptitudeChapter.count({ where: { isActive: true } }),
      prisma.aptitudeQuestion.count({ where: { isActive: true } }),
      prisma.aptitudeQuestion.groupBy({ by: ['difficulty'], _count: true, where: { isActive: true } }),
      prisma.aptitudeTopic.groupBy({ by: ['section'], _count: true, where: { isActive: true } }),
    ]);

    sendSuccess({
      res,
      data: {
        topics: totalTopics,
        chapters: totalChapters,
        questions: totalQuestions,
        byDifficulty: byDifficulty.reduce((acc: any, i: any) => { acc[i.difficulty] = i._count; return acc; }, {}),
        bySection: bySection.reduce((acc: any, i: any) => { acc[i.section] = i._count; return acc; }, {}),
      },
    });
  } catch (err) { next(err); }
});

export default router;
