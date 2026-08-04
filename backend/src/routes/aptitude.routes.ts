// @ts-nocheck
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /aptitude — Get all aptitude questions with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { module, topic, difficulty } = req.query;

    const where: any = {};
    if (module) where.module = String(module);
    if (topic) where.topic = String(topic);
    if (difficulty) where.difficulty = String(difficulty);

    const questions = await prisma.aptitudeQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    sendSuccess({ res, data: questions });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/:id — Get single aptitude question
router.get('/:id', async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    sendSuccess({ res, data: question });
  } catch (err) {
    next(err);
  }
});

// POST /aptitude — Create new aptitude question (admin only)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      question,
      options,
      answer,
      explanation,
      module,
      topic,
      difficulty,
      questionImage,
      optionImages,
      isImageBased,
    } = req.body;

    if (!question || !options || !answer || !explanation || !module || !topic) {
      throw new AppError('Missing required fields', 400);
    }

    const newQuestion = await prisma.aptitudeQuestion.create({
      data: {
        question,
        options,
        answer,
        explanation,
        module,
        topic,
        difficulty: difficulty || 'medium',
        questionImage: questionImage || null,
        optionImages: optionImages || null,
        isImageBased: isImageBased || false,
      },
    });

    sendSuccess({ res, message: 'Question created successfully', data: newQuestion });
  } catch (err) {
    next(err);
  }
});

// PUT /aptitude/:id — Update aptitude question (admin only)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const {
      question,
      options,
      answer,
      explanation,
      module,
      topic,
      difficulty,
      questionImage,
      optionImages,
      isImageBased,
    } = req.body;

    const existingQuestion = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.id },
    });

    if (!existingQuestion) {
      throw new AppError('Question not found', 404);
    }

    const updatedQuestion = await prisma.aptitudeQuestion.update({
      where: { id: req.params.id },
      data: {
        question: question || existingQuestion.question,
        options: options || existingQuestion.options,
        answer: answer || existingQuestion.answer,
        explanation: explanation || existingQuestion.explanation,
        module: module || existingQuestion.module,
        topic: topic || existingQuestion.topic,
        difficulty: difficulty || existingQuestion.difficulty,
        questionImage: questionImage !== undefined ? questionImage : existingQuestion.questionImage,
        optionImages: optionImages !== undefined ? optionImages : existingQuestion.optionImages,
        isImageBased: isImageBased !== undefined ? isImageBased : existingQuestion.isImageBased,
      },
    });

    sendSuccess({ res, message: 'Question updated successfully', data: updatedQuestion });
  } catch (err) {
    next(err);
  }
});

// DELETE /aptitude/:id — Delete aptitude question (admin only)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const question = await prisma.aptitudeQuestion.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    await prisma.aptitudeQuestion.delete({
      where: { id: req.params.id },
    });

    sendSuccess({ res, message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/modules/list — Get list of all modules
router.get('/modules/list', async (req, res, next) => {
  try {
    const modules = await prisma.aptitudeQuestion.findMany({
      select: { module: true },
      distinct: ['module'],
    });

    const moduleList = modules.map((m) => m.module);
    sendSuccess({ res, data: moduleList });
  } catch (err) {
    next(err);
  }
});

// GET /aptitude/topics/list — Get list of all topics
router.get('/topics/list', async (req, res, next) => {
  try {
    const { module } = req.query;

    const where: any = {};
    if (module) where.module = String(module);

    const topics = await prisma.aptitudeQuestion.findMany({
      where,
      select: { topic: true },
      distinct: ['topic'],
    });

    const topicList = topics.map((t) => t.topic);
    sendSuccess({ res, data: topicList });
  } catch (err) {
    next(err);
  }
});

export default router;
