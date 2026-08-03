import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, getPaginationParams, sendPaginated } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, authorize('admin'));

// GET /admin/stats - Dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalProblems,
      totalSubmissions,
      todaySubmissions,
      activeStudents,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.submission.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.user.count({
        where: {
          role: 'student',
          isActive: true,
          lastLogin: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    sendSuccess({
      res,
      data: {
        totalStudents,
        totalCourses,
        totalProblems,
        totalSubmissions,
        submissionsToday: todaySubmissions,
        activeStudents,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};
    if (req.query.role) where.role = String(req.query.role);
    if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      where.OR = [
        { firstName: { contains: String(req.query.search) } },
        { email: { contains: String(req.query.search) } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, isActive: true, isEmailVerified: true, createdAt: true, avatar: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    sendPaginated({ res, data: users.map(u => ({ ...u, _id: u.id })), total, page, limit });
  } catch (err) { next(err); }
});

// PUT /admin/users/:id/status
router.put('/users/:id/status', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: req.body.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true, role: true },
    });
    sendSuccess({ res, data: { ...user, _id: user.id }, message: `User ${req.body.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) { next(err); }
});

// GET /admin/courses/pending
router.get('/courses/pending', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isApproved: false, isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess({ res, data: courses });
  } catch (err) { next(err); }
});

// PUT /admin/courses/:id/approve
router.put('/courses/:id/approve', async (req, res, next) => {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { isApproved: true, approvedBy: req.user!.userId },
    });
    sendSuccess({ res, data: course, message: 'Course approved' });
  } catch (err) { next(err); }
});

// GET /admin/analytics/overview
router.get('/analytics/overview', async (_req, res, next) => {
  try {
    const [
      totalUsers,
      activeStudents,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      revenueAgg,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student', isActive: true } }),
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true, isApproved: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { isCompleted: true } }),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    ]);

    sendSuccess({
      res,
      data: {
        totalUsers, activeStudents, totalCourses, publishedCourses,
        totalEnrollments, completedEnrollments,
        completionRate: totalEnrollments > 0
          ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1) : 0,
        totalRevenue: revenueAgg._sum.amount ?? 0,
      },
    });
  } catch (err) { next(err); }
});

// GET /admin/analytics/revenue
router.get('/analytics/revenue', async (req, res, next) => {
  try {
    const days = parseInt(String(req.query.days ?? '30'), 10);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Group daily revenue via raw SQL for MySQL
    const revenueData = await prisma.$queryRaw<{ date: string; revenue: number; count: number }[]>`
      SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') as date,
             SUM(amount) as revenue,
             COUNT(*) as count
      FROM Payment
      WHERE status = 'completed' AND createdAt >= ${since}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
      ORDER BY date ASC
    `;

    sendSuccess({ res, data: revenueData });
  } catch (err) { next(err); }
});

// POST /admin/enrollments — Enroll a student manually
router.post('/enrollments', async (req, res, next) => {
  try {
    const { studentEmail, courseId } = req.body;
    const student = await prisma.user.findFirst({
      where: { email: studentEmail.toLowerCase(), role: 'student' },
    });
    if (!student) throw new AppError('Student with this email not found', 404);

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: student.id, courseId } },
    });
    if (existing) throw new AppError('Student is already enrolled in this course', 409);

    const enrollment = await prisma.enrollment.create({
      data: { userId: student.id, courseId },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    sendSuccess({ res, statusCode: 201, data: enrollment, message: 'Student enrolled successfully' });
  } catch (err) { next(err); }
});

export default router;

// ─── Extended Analytics Endpoints ──────────────────────────────────────────

// GET /admin/analytics/summary
router.get('/analytics/summary', async (_req, res, next) => {
  try {
    const now = new Date();
    const thirtyAgo = new Date(now.getTime() - 30 * 86400000);
    const sevenAgo  = new Date(now.getTime() -  7 * 86400000);

    const [
      totalStudents, activeStudents, newStudents,
      totalProblems, totalQuestions,
      totalSubs, acceptedSubs, subsThisWeek,
      totalAptitude, totalContests,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'student', isActive: true, lastLogin: { gte: sevenAgo } } }),
      prisma.user.count({ where: { role: 'student', createdAt: { gte: thirtyAgo } } }),
      prisma.problem.count(),
      prisma.question.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: 'accepted' } }),
      prisma.submission.count({ where: { createdAt: { gte: sevenAgo } } }),
      prisma.aptitudeQuestion.count(),
      prisma.contest.count(),
    ]);

    sendSuccess({
      res,
      data: {
        students: { total: totalStudents, active: activeStudents, newThisMonth: newStudents },
        problems: { total: totalProblems + totalQuestions, codingArena: totalProblems, challenges: totalQuestions },
        submissions: {
          total: totalSubs, accepted: acceptedSubs, thisWeek: subsThisWeek,
          acceptanceRate: totalSubs > 0 ? +((acceptedSubs / totalSubs) * 100).toFixed(1) : 0,
        },
        aptitude: { total: totalAptitude },
        contests: { total: totalContests },
      },
    });
  } catch (err) { next(err); }
});

// GET /admin/analytics/submission-trends?days=30
router.get('/analytics/submission-trends', async (req, res, next) => {
  try {
    const days = Math.min(90, Math.max(7, parseInt(String(req.query.days ?? '30'), 10)));
    const since = new Date(Date.now() - days * 86400000);

    const subs = await prisma.submission.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    });

    const buckets: Record<string, { date: string; total: number; accepted: number; failed: number }> = {};
    for (let i = 0; i < days; i++) {
      const key = new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().slice(0, 10);
      buckets[key] = { date: key, total: 0, accepted: 0, failed: 0 };
    }
    for (const s of subs) {
      const key = s.createdAt.toISOString().slice(0, 10);
      if (buckets[key]) {
        buckets[key].total++;
        s.status === 'accepted' ? buckets[key].accepted++ : buckets[key].failed++;
      }
    }
    sendSuccess({ res, data: Object.values(buckets) });
  } catch (err) { next(err); }
});

// GET /admin/analytics/topic-breakdown
router.get('/analytics/topic-breakdown', async (_req, res, next) => {
  try {
    const problems = await prisma.problem.findMany({ select: { id: true, topics: true, difficulty: true } });
    const map: Record<string, { topic: string; total: number; easy: number; medium: number; hard: number; solved: number }> = {};

    for (const p of problems) {
      const topics = String(p.topics || '').split(',').map(t => t.trim()).filter(Boolean);
      for (const t of topics) {
        const k = t.toLowerCase();
        if (!map[k]) map[k] = { topic: t, total: 0, easy: 0, medium: 0, hard: 0, solved: 0 };
        map[k].total++;
        const d = (p.difficulty || '').toLowerCase();
        if (d === 'easy') map[k].easy++;
        else if (d === 'medium') map[k].medium++;
        else if (d === 'hard') map[k].hard++;
      }
    }

    const accepted = await prisma.submission.findMany({
      where: { status: 'accepted', problemId: { not: null } },
      select: { problemId: true }, distinct: ['problemId'],
    });
    const solvedIds = new Set(accepted.map(s => s.problemId));
    for (const p of problems) {
      if (!solvedIds.has(p.id)) continue;
      String(p.topics || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        if (map[t.toLowerCase()]) map[t.toLowerCase()].solved++;
      });
    }

    sendSuccess({
      res,
      data: Object.values(map).filter(t => t.total > 0).sort((a, b) => b.total - a.total).slice(0, 20),
    });
  } catch (err) { next(err); }
});

// GET /admin/analytics/students?page&limit&search
router.get('/analytics/students', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search = '' } = req.query;
    const pageNum  = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { role: 'student' };
    if (search) {
      where.OR = [
        { firstName: { contains: String(search) } },
        { lastName:  { contains: String(search) } },
        { email:     { contains: String(search) } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, firstName: true, lastName: true, email: true,
          avatar: true, isActive: true, lastLogin: true, createdAt: true,
          studentProfile: { select: { xp: true, level: true, streak: true } },
          _count: { select: { submissions: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const enriched = await Promise.all(users.map(async u => {
      const accepted = await prisma.submission.count({ where: { userId: u.id, status: 'accepted' } });
      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email, avatar: u.avatar,
        isActive: u.isActive, lastLogin: u.lastLogin, joinedAt: u.createdAt,
        xp: u.studentProfile?.xp ?? 0,
        level: u.studentProfile?.level ?? 1,
        streak: u.studentProfile?.streak ?? 0,
        totalSubmissions: u._count.submissions,
        acceptedSubmissions: accepted,
        accuracy: u._count.submissions > 0 ? Math.round((accepted / u._count.submissions) * 100) : 0,
      };
    }));

    sendSuccess({
      res, data: enriched,
      // @ts-ignore
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
});

// GET /admin/analytics/students/:id
router.get('/analytics/students/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, firstName: true, lastName: true, email: true, avatar: true,
        isActive: true, lastLogin: true, createdAt: true, studentProfile: true,
      },
    });
    if (!user) throw new AppError('Student not found', 404);

    const since30 = new Date(Date.now() - 30 * 86400000);
    const [allSubs, acceptedSubs, recent] = await Promise.all([
      prisma.submission.count({ where: { userId: user.id } }),
      prisma.submission.count({ where: { userId: user.id, status: 'accepted' } }),
      prisma.submission.findMany({
        where: { userId: user.id, createdAt: { gte: since30 } },
        select: { createdAt: true, status: true, language: true, problemId: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // 30-day activity heatmap
    const actMap: Record<string, { date: string; count: number; accepted: number }> = {};
    for (let i = 0; i < 30; i++) {
      const k = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
      actMap[k] = { date: k, count: 0, accepted: 0 };
    }
    for (const s of recent) {
      const k = s.createdAt.toISOString().slice(0, 10);
      if (actMap[k]) { actMap[k].count++; if (s.status === 'accepted') actMap[k].accepted++; }
    }

    // Language distribution
    const langMap: Record<string, number> = {};
    for (const s of recent) langMap[s.language] = (langMap[s.language] ?? 0) + 1;
    const languageDistribution = Object.entries(langMap)
      .map(([lang, count]) => ({ lang, count })).sort((a, b) => b.count - a.count);

    // Topic stats
    const solvedProblems = await prisma.submission.findMany({
      where: { userId: user.id, status: 'accepted', problemId: { not: null } },
      select: { problemId: true }, distinct: ['problemId'],
    });
    const solvedIds = solvedProblems.map(s => s.problemId).filter(Boolean) as string[];
    let topicStats: { topic: string; solved: number }[] = [];
    if (solvedIds.length > 0) {
      const probs = await prisma.problem.findMany({ where: { id: { in: solvedIds } }, select: { topics: true } });
      const tm: Record<string, number> = {};
      for (const p of probs) {
        String(p.topics || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => { tm[t] = (tm[t] ?? 0) + 1; });
      }
      topicStats = Object.entries(tm).map(([topic, solved]) => ({ topic, solved }))
        .sort((a, b) => b.solved - a.solved).slice(0, 8);
    }

    sendSuccess({
      res,
      data: {
        id: user.id, name: `${user.firstName} ${user.lastName}`,
        email: user.email, avatar: user.avatar,
        isActive: user.isActive, lastLogin: user.lastLogin, joinedAt: user.createdAt,
        profile: user.studentProfile,
        stats: {
          totalSubmissions: allSubs, acceptedSubmissions: acceptedSubs,
          accuracy: allSubs > 0 ? Math.round((acceptedSubs / allSubs) * 100) : 0,
          problemsSolved: solvedIds.length,
        },
        activityTimeline: Object.values(actMap),
        languageDistribution,
        topicStats,
      },
    });
  } catch (err) { next(err); }
});

// GET /admin/analytics/leaderboard?limit=10
router.get('/analytics/leaderboard', async (req, res, next) => {
  try {
    const limit = Math.min(50, parseInt(String(req.query.limit ?? '10'), 10));
    const profiles = await prisma.studentProfile.findMany({
      orderBy: { xp: 'desc' }, take: limit,
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true, lastLogin: true } } },
    });

    const data = await Promise.all(profiles.map(async (p, i) => {
      const [total, accepted] = await Promise.all([
        prisma.submission.count({ where: { userId: p.userId } }),
        prisma.submission.count({ where: { userId: p.userId, status: 'accepted' } }),
      ]);
      return {
        rank: i + 1,
        id: p.userId,
        name: `${p.user.firstName} ${p.user.lastName}`,
        email: p.user.email, avatar: p.user.avatar,
        xp: p.xp, level: p.level, streak: p.streak,
        lastLogin: p.user.lastLogin,
        totalSubmissions: total, acceptedSubmissions: accepted,
        accuracy: total > 0 ? Math.round((accepted / total) * 100) : 0,
      };
    }));

    sendSuccess({ res, data });
  } catch (err) { next(err); }
});

// GET /admin/analytics/difficulty-distribution
router.get('/analytics/difficulty-distribution', async (_req, res, next) => {
  try {
    const problems = await prisma.problem.findMany({ select: { difficulty: true } });
    const questions = await prisma.question.findMany({ select: { difficulty: true } });

    const count = (arr: { difficulty: string }[]) => {
      const m: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
      arr.forEach(x => { const k = (x.difficulty || '').toLowerCase(); if (m[k] !== undefined) m[k]++; });
      return Object.entries(m).map(([difficulty, count]) => ({ difficulty, count }));
    };

    sendSuccess({ res, data: { codingArena: count(problems), challenges: count(questions) } });
  } catch (err) { next(err); }
});
