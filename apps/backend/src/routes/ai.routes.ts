import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { AIService } from '../services/ai.service';
import { sendSuccess } from '../utils/response.utils';

const router = Router();
const aiService = new AIService();

// All AI routes require auth and rate limiting
router.use(authenticate, aiRateLimiter);

router.post('/chat', async (req, res, next) => {
  try {
    const result = await aiService.chat(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/tutor', async (req, res, next) => {
  try {
    const result = await aiService.tutor(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/pdf-chat', async (req, res, next) => {
  try {
    const result = await aiService.pdfChat(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/generate-notes', async (req, res, next) => {
  try {
    const result = await aiService.generateNotes(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/generate-quiz', async (req, res, next) => {
  try {
    const result = await aiService.generateQuiz(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/generate-flashcards', async (req, res, next) => {
  try {
    const result = await aiService.generateFlashcards(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/generate-mindmap', async (req, res, next) => {
  try {
    const result = await aiService.generateMindMap(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/career-recommendation', async (req, res, next) => {
  try {
    const result = await aiService.careerRecommendation(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/skill-gap', async (req, res, next) => {
  try {
    const result = await aiService.skillGapAnalysis(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/study-plan', async (req, res, next) => {
  try {
    const result = await aiService.studyPlan(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/lecture-summarize', async (req, res, next) => {
  try {
    const result = await aiService.summarizeLecture(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/ocr', async (req, res, next) => {
  try {
    const result = await aiService.ocr(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/translate', async (req, res, next) => {
  try {
    const result = await aiService.translate(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/speech-to-text', async (req, res, next) => {
  try {
    const result = await aiService.speechToText(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/text-to-speech', async (req, res, next) => {
  try {
    const result = await aiService.textToSpeech(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

router.post('/evaluate-assignment', async (req, res, next) => {
  try {
    const result = await aiService.evaluateAssignment(req.body);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

export default router;
