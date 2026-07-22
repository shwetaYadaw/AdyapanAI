import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /jobs
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = { isActive: true };
    if (req.query.type) where.type = String(req.query.type);
    if (req.query.remote === 'true') where.isRemote = true;
    if (req.query.search) {
      where.OR = [
        { title: { contains: String(req.query.search) } },
        { description: { contains: String(req.query.search) } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.job.count({ where }),
    ]);
    sendPaginated({ res, data: jobs, total, page, limit });
  } catch (err) { next(err); }
});

// GET /jobs/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const job = await prisma.job.findFirst({ where: { slug: req.params.slug, isActive: true } });
    if (!job) throw new AppError('Job not found', 404);
    await prisma.job.update({ where: { id: job.id }, data: { views: { increment: 1 } } });
    sendSuccess({ res, data: job });
  } catch (err) { next(err); }
});

// POST /jobs — Recruiter
router.post('/', authenticate, authorize('recruiter', 'admin'), async (req, res, next) => {
  try {
    const { default: slugify } = await import('slugify');
    const slug = slugify(req.body.title, { lower: true, strict: true }) + '-' + Date.now();
    const job = await prisma.job.create({
      data: { ...req.body, slug, postedBy: req.user!.userId },
    });
    sendSuccess({ res, statusCode: 201, data: job });
  } catch (err) { next(err); }
});

// POST /jobs/:id/apply — Student
router.post('/:id/apply', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_studentId: { jobId: req.params.id, studentId: req.user!.userId } },
    });
    if (existing) throw new AppError('Already applied', 409);
    const application = await prisma.jobApplication.create({
      data: { jobId: req.params.id, studentId: req.user!.userId, ...req.body },
    });
    await prisma.job.update({ where: { id: req.params.id }, data: { applicationCount: { increment: 1 } } });
    sendSuccess({ res, statusCode: 201, data: application });
  } catch (err) { next(err); }
});

// GET /jobs/:id/applications — Recruiter
router.get('/:id/applications', authenticate, authorize('recruiter', 'admin'), async (req, res, next) => {
  try {
    const apps = await prisma.jobApplication.findMany({
      where: { jobId: req.params.id },
      include: { student: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } },
      orderBy: { appliedAt: 'desc' },
    });
    sendSuccess({ res, data: apps });
  } catch (err) { next(err); }
});

// PUT /jobs/:id/applications/:appId — Recruiter update status
router.put('/:id/applications/:appId', authenticate, authorize('recruiter', 'admin'), async (req, res, next) => {
  try {
    const existing = await prisma.jobApplication.findUnique({ where: { id: req.params.appId } });
    if (!existing) throw new AppError('Application not found', 404);

    const currentHistory = Array.isArray(existing.statusHistory) ? existing.statusHistory as any[] : [];
    const app = await prisma.jobApplication.update({
      where: { id: req.params.appId },
      data: {
        status: req.body.status,
        recruiterNotes: req.body.note,
        statusHistory: [...currentHistory, { status: req.body.status, changedAt: new Date(), note: req.body.note }],
      },
    });
    sendSuccess({ res, data: app });
  } catch (err) { next(err); }
});

export default router;
