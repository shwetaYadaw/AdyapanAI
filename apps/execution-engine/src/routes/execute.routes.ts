import { Router } from 'express';
import { JudgeService } from '../services/judge.service';
import { QueueService } from '../services/queue.service';
import { getSupportedLanguages } from '../config/languages';
import { logger } from '../config/logger';

const router = Router();
const judgeService = new JudgeService();
const queueService = new QueueService();

/**
 * POST /execute/run
 * Execute code with custom input (synchronous)
 */
router.post('/run', async (req, res, next) => {
  try {
    const { code, language, input, timeLimit, memoryLimit } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required',
      });
    }

    logger.info(`Run request for language: ${language}`);

    const result = await judgeService.runCode(
      code,
      language,
      input || '',
      timeLimit,
      memoryLimit
    );

    res.json({
      success: true,
      data: {
        output: result.output,
        error: result.error,
        runtime: result.runtime,
        memory: result.memory,
        verdict: result.verdict,
        timeout: result.timeout,
      },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * POST /execute/submit
 * Submit code for judging against test cases (asynchronous)
 */
router.post('/submit', async (req, res, next) => {
  try {
    const { submissionId, code, language, testCases, timeLimit, memoryLimit, callbackUrl } = req.body;

    if (!submissionId || !code || !language || !testCases) {
      return res.status(400).json({
        success: false,
        message: 'submissionId, code, language, and testCases are required',
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'testCases must be a non-empty array',
      });
    }

    logger.info(`Submit request for submission: ${submissionId}, language: ${language}`);

    const jobId = await queueService.enqueueSubmission({
      submissionId,
      code,
      language,
      testCases,
      timeLimit,
      memoryLimit,
      callbackUrl,
    });

    res.json({
      success: true,
      message: 'Submission enqueued successfully',
      data: {
        submissionId,
        jobId,
        status: 'queued',
      },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * POST /execute/judge
 * Submit code and wait for result (synchronous)
 */
router.post('/judge', async (req, res, next) => {
  try {
    const { code, language, testCases, timeLimit, memoryLimit } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({
        success: false,
        message: 'code, language, and testCases are required',
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'testCases must be a non-empty array',
      });
    }

    logger.info(`Judge request for language: ${language}, testCases: ${testCases.length}`);

    const result = await judgeService.judgeSubmission(
      code,
      language,
      testCases,
      timeLimit,
      memoryLimit
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * GET /execute/status/:jobId
 * Get status of a queued submission
 */
router.get('/status/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const status = await queueService.getJobStatus(jobId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * GET /execute/languages
 * Get list of supported languages
 */
router.get('/languages', (req, res) => {
  const languages = getSupportedLanguages();
  
  res.json({
    success: true,
    data: {
      languages,
      count: languages.length,
    },
  });
});

/**
 * GET /execute/stats
 * Get queue statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await queueService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;
