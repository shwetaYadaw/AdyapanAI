import { Router, Request, Response } from 'express';
import { judgeService } from '../services/judge.service';
import { getSupportedLanguages } from '../runners';
import {
  runCodeValidation,
  submitCodeValidation,
  validate,
} from '../middleware/validation.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/execute/run
 * Execute code with custom input
 */
router.post('/run', runCodeValidation, validate, async (req: Request, res: Response) => {
  try {
    const { code, language, input, timeLimit, memoryLimit } = req.body;

    const result = await judgeService.runCode({
      code,
      language,
      input: input || '',
      timeLimit,
      memoryLimit,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Run code error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/execute/submit
 * Submit code against test cases
 */
router.post('/submit', submitCodeValidation, validate, async (req: Request, res: Response) => {
  try {
    const { code, language, testCases, timeLimit, memoryLimit } = req.body;

    const result = await judgeService.submitCode({
      code,
      language,
      testCases,
      timeLimit,
      memoryLimit,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Submit code error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/execute/languages
 * Get supported languages
 */
router.get('/languages', (req: Request, res: Response) => {
  const languages = getSupportedLanguages();
  res.json({
    success: true,
    data: {
      languages,
      count: languages.length,
    },
  });
});

export default router;
