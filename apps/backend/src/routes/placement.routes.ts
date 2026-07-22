import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AIService } from '../services/ai.service';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';

const aiService = new AIService();
const router = Router();

// GET /placement/aptitude/tests
router.get('/aptitude/tests', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = { isActive: true };
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.company) where.company = String(req.query.company);

    const [tests, total] = await Promise.all([
      prisma.aptitudeTest.findMany({
        where,
        select: { id: true, title: true, category: true, difficulty: true, duration: true, totalMarks: true, company: true, isActive: true, createdAt: true },
        skip,
        take: limit,
      }),
      prisma.aptitudeTest.count({ where }),
    ]);
    sendPaginated({ res, data: tests, total, page, limit });
  } catch (err) { next(err); }
});

// GET /placement/aptitude/tests/:id
router.get('/aptitude/tests/:id', async (req, res, next) => {
  try {
    const test = await prisma.aptitudeTest.findUnique({ where: { id: req.params.id } });
    sendSuccess({ res, data: test });
  } catch (err) { next(err); }
});

// GET /placement/interview-experiences
router.get('/interview-experiences', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};
    if (req.query.company) where.company = { contains: String(req.query.company) };
    if (req.query.role) where.role = { contains: String(req.query.role) };

    const [experiences, total] = await Promise.all([
      prisma.interviewExperience.findMany({
        where,
        include: { author: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.interviewExperience.count({ where }),
    ]);
    sendPaginated({ res, data: experiences, total, page, limit });
  } catch (err) { next(err); }
});

// POST /placement/interview-experiences
router.post('/interview-experiences', authenticate, async (req, res, next) => {
  try {
    const exp = await prisma.interviewExperience.create({
      data: { ...req.body, authorId: req.user!.userId },
    });
    sendSuccess({ res, statusCode: 201, data: exp });
  } catch (err) { next(err); }
});

// POST /placement/mock-interview/start
router.post('/mock-interview/start', authenticate, async (req, res, next) => {
  try {
    const aiResult = await aiService.startMockInterview(req.body) as { questions: unknown[] };
    const session = await prisma.mockInterviewSession.create({
      data: {
        userId: req.user!.userId,
        ...req.body,
        questions: aiResult.questions as any,
      },
    });
    sendSuccess({ res, statusCode: 201, data: { sessionId: session.id, questions: aiResult.questions } });
  } catch (err) { next(err); }
});

// POST /placement/mock-interview/:sessionId/answer
router.post('/mock-interview/:sessionId/answer', authenticate, async (req, res, next) => {
  try {
    const feedback = await aiService.submitInterviewAnswer({
      sessionId: req.params.sessionId,
      questionId: req.body.questionId,
      answer: req.body.answer,
    });

    const existing = await prisma.mockInterviewSession.findUnique({ where: { id: req.params.sessionId } });
    const currentAnswers = Array.isArray(existing?.answers) ? existing!.answers as any[] : [];

    await prisma.mockInterviewSession.update({
      where: { id: req.params.sessionId },
      data: {
        answers: [...currentAnswers, { questionId: req.body.questionId, answer: req.body.answer, feedback }],
      },
    });

    sendSuccess({ res, data: feedback });
  } catch (err) { next(err); }
});

// GET /placement/companies
router.get('/companies', async (_req, res, next) => {
  try {
    const companies = [
      { name: 'Google', logo: '', tracks: ['SWE', 'ML Engineer', 'Data Engineer'], difficulty: 'Hard' },
      { name: 'Microsoft', logo: '', tracks: ['SWE', 'Cloud Engineer', 'PM'], difficulty: 'Hard' },
      { name: 'Amazon', logo: '', tracks: ['SWE', 'SDE-1', 'Data Scientist'], difficulty: 'Medium-Hard' },
      { name: 'Infosys', logo: '', tracks: ['System Engineer', 'Digital Specialist'], difficulty: 'Medium' },
      { name: 'TCS', logo: '', tracks: ['Software Engineer', 'Digital Cadre'], difficulty: 'Easy-Medium' },
      { name: 'Wipro', logo: '', tracks: ['Software Engineer', 'Project Engineer'], difficulty: 'Easy-Medium' },
      { name: 'Salesforce', logo: '', tracks: ['Sales', 'Customer Success', 'Marketing'], difficulty: 'Medium' },
      { name: 'HubSpot', logo: '', tracks: ['Sales', 'Marketing', 'Customer Success'], difficulty: 'Medium' },
    ];
    sendSuccess({ res, data: companies });
  } catch (err) { next(err); }
});

export default router;
