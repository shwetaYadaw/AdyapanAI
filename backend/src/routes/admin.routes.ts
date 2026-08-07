// @ts-nocheck
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, getPaginationParams, sendPaginated } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import bcrypt from 'bcryptjs';
import { EmailService } from '../services/email.service';

const emailService = new EmailService();

const router = Router();
router.use(authenticate, authorize('admin'));

// GET /admin/stats - Dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalProblems,
      totalSubmissions,
      todaySubmissions,
      activeStudents,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.problem.count(),
      prisma.problemSubmission.count(),
      prisma.problemSubmission.count({
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
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    sendSuccess({
      res,
      data: {
        totalStudents,
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
        { firstName: { contains: String(req.query.search), mode: 'insensitive' } },
        { lastName: { contains: String(req.query.search), mode: 'insensitive' } },
        { email: { contains: String(req.query.search), mode: 'insensitive' } },
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

// DELETE /admin/users/:id
router.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    sendSuccess({ res, message: 'User deleted successfully' });
  } catch (err) { next(err); }
});

// POST /admin/users - Manually create a user (student)
router.post('/users', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, courses, status } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      throw new AppError('First name, last name, email, and password are required', 400);
    }
    
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      throw new AppError('User with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user and their student profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'student',
          isActive: status === 'active',
          isEmailVerified: true, // Auto-verified since admin created
          preferences: courses && Array.isArray(courses) ? { enrolledCourses: courses } : undefined,
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: newUser.id,
          xp: 0,
          level: 1,
        },
      });

      // Save courses to preferences or handle dynamically
      // if needed, mapping to topics or another table

      return newUser;
    });

    // Send email with credentials
    await emailService.sendWelcomeEmailWithCredentials(
      user.email,
      user.firstName,
      user.email,
      password
    );

    sendSuccess({ res, statusCode: 201, data: { id: user.id, email: user.email }, message: 'Student created successfully' });
  } catch (err) {
    next(err);
  }
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
      Promise.resolve(0),
      Promise.resolve(0),
      Promise.resolve(0),
      Promise.resolve(0),
      Promise.resolve({ _sum: { amount: 0 } }),
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

router.get("/analytics/revenue", async (_req, res, next) => { try { sendSuccess({ res, data: [] }); } catch (err) { next(err); } });

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

// (export moved to end of file)

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
      prisma.tcsNqtQuestion.count(),
      prisma.problemSubmission.count(),
      prisma.problemSubmission.count({ where: { status: 'accepted' } }),
      prisma.problemSubmission.count({ where: { createdAt: { gte: sevenAgo } } }),
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

    const subs = await prisma.problemSubmission.findMany({
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

    const accepted = await prisma.problemSubmission.findMany({
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
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName:  { contains: String(search), mode: 'insensitive' } },
        { email:     { contains: String(search), mode: 'insensitive' } },
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
          _count: { select: { problemSubmissions: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const enriched = await Promise.all(users.map(async u => {
      const accepted = await prisma.problemSubmission.count({ where: { userId: u.id, status: 'accepted' } });
      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email, avatar: u.avatar,
        isActive: u.isActive, lastLogin: u.lastLogin, joinedAt: u.createdAt,
        xp: u.studentProfile?.xp ?? 0,
        level: u.studentProfile?.level ?? 1,
        streak: u.studentProfile?.streak ?? 0,
        totalSubmissions: u._count.problemSubmissions,
        acceptedSubmissions: accepted,
        accuracy: u._count.problemSubmissions > 0 ? Math.round((accepted / u._count.problemSubmissions) * 100) : 0,
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
      prisma.problemSubmission.count({ where: { userId: user.id } }),
      prisma.problemSubmission.count({ where: { userId: user.id, status: 'accepted' } }),
      prisma.problemSubmission.findMany({
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
    const solvedProblems = await prisma.problemSubmission.findMany({
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
        prisma.problemSubmission.count({ where: { userId: p.userId } }),
        prisma.problemSubmission.count({ where: { userId: p.userId, status: 'accepted' } }),
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
    const problems = await prisma.problem.findMany({ where: { isArchived: false }, select: { difficulty: true } });
    const questions = await prisma.tcsNqtQuestion.findMany({ select: { difficulty: true } });

    const count = (arr: { difficulty: string }[]) => {
      const m: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
      arr.forEach(x => { const k = (x.difficulty || '').toLowerCase(); if (m[k] !== undefined) m[k]++; });
      return Object.entries(m).map(([difficulty, count]) => ({ difficulty, count }));
    };

    sendSuccess({ res, data: { codingArena: count(problems), challenges: count(questions) } });
  } catch (err) { next(err); }
});

// GET /admin/analytics/students-list
router.get('/analytics/students-list', async (_req, res, next) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'student' },
      select: { id: true, firstName: true, lastName: true, email: true, isActive: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess({ res, data: students });
  } catch (err) { next(err); }
});

// GET /admin/analytics/active-students
router.get('/analytics/active-students', async (_req, res, next) => {
  try {
    const sevenAgo = new Date(Date.now() - 7 * 86400000);
    const students = await prisma.user.findMany({
      where: { role: 'student', isActive: true, lastLogin: { gte: sevenAgo } },
      select: { id: true, firstName: true, lastName: true, email: true, lastLogin: true },
      orderBy: { lastLogin: 'desc' },
    });
    sendSuccess({ res, data: students });
  } catch (err) { next(err); }
});

// GET /admin/analytics/problems-breakdown
router.get('/analytics/problems-breakdown', async (req, res, next) => {
  try {
    const courseId = req.query.courseId as string | undefined;
    const where: any = { isArchived: false };
    if (courseId === 'global') where.courseId = null;
    else if (courseId) where.courseId = courseId;

    const problems = await prisma.problem.findMany({ where, select: { topics: true, difficulty: true } });
    const topicMap: Record<string, { topic: string; total: number; easy: number; medium: number; hard: number }> = {};
    for (const p of problems) {
      const topic = p.topics?.trim() || 'Uncategorized';
      if (!topicMap[topic]) topicMap[topic] = { topic, total: 0, easy: 0, medium: 0, hard: 0 };
      topicMap[topic].total++;
      const diff = (p.difficulty || '').toLowerCase();
      if (diff === 'easy') topicMap[topic].easy++;
      else if (diff === 'medium') topicMap[topic].medium++;
      else if (diff === 'hard') topicMap[topic].hard++;
    }
    sendSuccess({ res, data: Object.values(topicMap).sort((a, b) => b.total - a.total) });
  } catch (err) { next(err); }
});

// GET /admin/analytics/courses-with-problems
router.get('/analytics/courses-with-problems', async (_req, res, next) => {
  try {
    const results = await prisma.problem.groupBy({ by: ['courseId'], where: { isArchived: false }, _count: true });
    const courses = results.map(r => ({
      courseId: r.courseId || 'global',
      label: r.courseId ? r.courseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'DSA (Global)',
      count: r._count,
    })).sort((a, b) => b.count - a.count);
    sendSuccess({ res, data: courses });
  } catch (err) { next(err); }
});

// GET /admin/analytics/aptitude-breakdown
router.get('/analytics/aptitude-breakdown', async (_req, res, next) => {
  try {
    const topics = await prisma.aptitudeTopic.findMany({
      where: { isActive: true },
      select: { id: true, name: true, chapters: { select: { id: true, name: true, _count: { select: { questions: true } } } } },
      orderBy: { order: 'asc' },
    });
    const breakdown = topics.map(t => ({
      topic: t.name,
      total: t.chapters.reduce((sum, ch) => sum + ch._count.questions, 0),
      chapters: t.chapters.map(ch => ({ name: ch.name, count: ch._count.questions })),
    })).sort((a, b) => b.total - a.total);
    sendSuccess({ res, data: breakdown });
  } catch (err) { next(err); }
});

// GET /admin/analytics/student-submissions?userId=xxx
router.get('/analytics/student-submissions', async (req, res, next) => {
  try {
    const userId = req.query.userId as string | undefined;
    if (!userId) throw new AppError('userId is required', 400);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, firstName: true, lastName: true, email: true } });
    if (!user) throw new AppError('User not found', 404);
    const sevenAgo = new Date(Date.now() - 7 * 86400000);
    const [total, accepted, thisWeek] = await Promise.all([
      prisma.problemSubmission.count({ where: { userId } }),
      prisma.problemSubmission.count({ where: { userId, status: 'accepted' } }),
      prisma.problemSubmission.count({ where: { userId, createdAt: { gte: sevenAgo } } }),
    ]);
    sendSuccess({ res, data: { student: user, total, accepted, rejected: total - accepted, thisWeek, acceptanceRate: total > 0 ? +((accepted / total) * 100).toFixed(1) : 0 } });
  } catch (err) { next(err); }
});

export default router;
