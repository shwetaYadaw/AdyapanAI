import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getMysqlPool } from '../config/mysql';
import { JudgeService } from '../services/judge.service';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
const judge = new JudgeService();

function getPool() {
  const pool = getMysqlPool();
  if (!pool) {
    throw new AppError('MySQL pool is not available. Roadmap routes require MySQL or migration to Prisma.', 503);
  }
  return pool;
}

// GET /api/v1/roadmap/phases
router.get('/phases', authenticate, async (req, res, next) => {
  try {
    const pool = getPool();
    const [phases]: any = await pool.query('SELECT * FROM roadmap_phases ORDER BY phase_number ASC');
    
    // Also attach completion/progress counters if possible
    const [progress]: any = await pool.query(
      `SELECT q.phase_id, COUNT(DISTINCT s.question_id) as solved_count, COUNT(DISTINCT q.id) as total_count
       FROM roadmap_questions q
       LEFT JOIN roadmap_submissions s ON q.id = s.question_id AND s.user_id = ? AND s.status = 'accepted'
       GROUP BY q.phase_id`,
      [req.user!.userId]
    );

    const progMap = new Map<number, { solved: number; total: number }>();
    for (const p of progress) {
      progMap.set(p.phase_id, { solved: p.solved_count, total: p.total_count });
    }

    const phasesWithProgress = phases.map((phase: any) => {
      const pData = progMap.get(phase.id) || { solved: 0, total: 0 };
      return {
        ...phase,
        solvedCount: pData.solved,
        totalCount: pData.total
      };
    });

    sendSuccess({ res, data: phasesWithProgress });
  } catch (err) { next(err); }
});

// GET /api/v1/roadmap/phases/:phaseNumber/questions
router.get('/phases/:phaseNumber/questions', authenticate, async (req, res, next) => {
  try {
    const pool = getPool();
    const phaseNum = parseInt(req.params.phaseNumber, 10);

    const [phaseRows]: any = await pool.query('SELECT id FROM roadmap_phases WHERE phase_number = ?', [phaseNum]);
    if (phaseRows.length === 0) throw new AppError('Phase not found', 404);
    const phaseId = phaseRows[0].id;

    // Fetch questions and check user's status on them (solved, attempted, etc.)
    const [questions]: any = await pool.query(
      `SELECT q.id, q.title, q.slug, q.difficulty, q.topics, q.companies, q.xp_reward,
              (SELECT status FROM roadmap_submissions s WHERE s.question_id = q.id AND s.user_id = ? ORDER BY s.created_at DESC LIMIT 1) as user_status
       FROM roadmap_questions q
       WHERE q.phase_id = ?`,
      [req.user!.userId, phaseId]
    );

    const formattedQuestions = questions.map((q: any) => ({
      ...q,
      topics: q.topics ? q.topics.split(',').map((t: string) => t.trim()) : [],
      companies: q.companies ? q.companies.split(',').map((c: string) => c.trim()) : [],
    }));

    sendSuccess({ res, data: formattedQuestions });
  } catch (err) { next(err); }
});

// GET /api/v1/roadmap/questions/:slug
router.get('/questions/:slug', authenticate, async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, title, slug, statement, difficulty, topics, companies, time_limit as timeLimit, memory_limit as memoryLimit, input_format as inputFormat, output_format as outputFormat, constraints, sample_input as sampleInput, sample_output as sampleOutput, templates, xp_reward as xpReward FROM roadmap_questions WHERE slug = ?',
      [req.params.slug]
    );

    if (rows.length === 0) throw new AppError('Question not found', 404);
    const q = rows[0];

    // parse json columns
    q.templates = typeof q.templates === 'string' ? JSON.parse(q.templates) : q.templates;
    q.topics = q.topics ? q.topics.split(',').map((t: string) => t.trim()) : [];
    q.companies = q.companies ? q.companies.split(',').map((c: string) => c.trim()) : [];

    sendSuccess({ res, data: q });
  } catch (err) { next(err); }
});

// POST /api/v1/roadmap/questions/:id/run
router.post('/questions/:id/run', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const pool = getPool();

    const [rows]: any = await pool.query(
      'SELECT sample_input, sample_output, time_limit FROM roadmap_questions WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) throw new AppError('Question not found', 404);
    const q = rows[0];

    const results = await judge.runTestCase(
      code,
      language,
      q.sample_input,
      q.sample_output,
      q.time_limit
    );

    sendSuccess({
      res,
      data: {
        passed: results.passed,
        actualOutput: results.actualOutput,
        expectedOutput: q.sample_output,
        input: q.sample_input,
        runtime: results.runtime,
        errorType: results.errorType,
        errorMessage: results.errorMessage,
      },
    });
  } catch (err) { next(err); }
});

// POST /api/v1/roadmap/questions/:id/submit
router.post('/questions/:id/submit', authenticate, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const pool = getPool();

    const [rows]: any = await pool.query(
      'SELECT test_cases, time_limit, xp_reward FROM roadmap_questions WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) throw new AppError('Question not found', 404);
    const q = rows[0];

    const testCases = typeof q.test_cases === 'string' ? JSON.parse(q.test_cases) : q.test_cases;
    let passedCount = 0;
    let finalStatus: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'compile_error' | 'runtime_error' = 'accepted';
    let errorMessage = '';
    let maxRuntime = 0;

    for (const tc of testCases) {
      const result = await judge.runTestCase(
        code,
        language,
        tc.input,
        tc.output,
        q.time_limit
      );

      if (result.passed) {
        passedCount++;
        maxRuntime = Math.max(maxRuntime, result.runtime);
      } else {
        finalStatus = result.errorType || 'wrong_answer';
        errorMessage = result.errorMessage || `Wrong Answer on testcase ${passedCount + 1}`;
        break;
      }
    }

    // Insert submission log into MySQL
    await pool.query(
      `INSERT INTO roadmap_submissions (user_id, question_id, code, language, status, error_message, runtime, passed_count, total_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user!.userId, req.params.id, code, language, finalStatus, errorMessage, maxRuntime, passedCount, testCases.length]
    );

    sendSuccess({
      res,
      statusCode: 201,
      data: {
        status: finalStatus,
        errorMessage,
        runtime: maxRuntime,
        passedCount,
        totalCount: testCases.length,
      },
      message: finalStatus === 'accepted' ? 'Accepted!' : 'Failed',
    });
  } catch (err) { next(err); }
});

export default router;
