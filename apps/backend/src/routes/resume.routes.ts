import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AIService } from '../services/ai.service';
import { sendSuccess } from '../utils/response.utils';

const aiService = new AIService();
const router = Router();

router.use(authenticate);

// GET /resume/profile
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await prisma.resume.findUnique({ where: { userId: req.user!.userId } });
    sendSuccess({ res, data: profile ?? {} });
  } catch (err) { next(err); }
});

// PUT /resume/profile — save resume data
router.put('/profile', async (req, res, next) => {
  try {
    const existing = await prisma.resume.findUnique({ where: { userId: req.user!.userId } });
    const currentVersions = Array.isArray(existing?.versions) ? existing!.versions as any[] : [];
    const newVersion = { name: req.body.name ?? 'Resume v1', data: req.body.data, createdAt: new Date() };

    const profile = await prisma.resume.upsert({
      where: { userId: req.user!.userId },
      create: { userId: req.user!.userId, versions: [newVersion] },
      update: { versions: [...currentVersions, newVersion] },
    });
    sendSuccess({ res, data: profile, message: 'Resume saved' });
  } catch (err) { next(err); }
});

// POST /resume/analyze — AI ATS analysis
router.post('/analyze', async (req, res, next) => {
  try {
    const result = await aiService.analyzeResume({
      resumeText: req.body.resumeText,
      targetRole: req.body.targetRole,
    });
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

// POST /resume/cover-letter
router.post('/cover-letter', async (req, res, next) => {
  try {
    const result = await aiService.generateCoverLetter(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

// POST /resume/linkedin-suggestions
router.post('/linkedin-suggestions', async (req, res, next) => {
  try {
    const result = await aiService.linkedinSuggestions(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

export default router;
