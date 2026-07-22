import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { CourseService } from '../services/course.service';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response.utils';

const router = Router();
const courseService = new CourseService();

// GET /courses — Public: list all published courses
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page, limit } = getPaginationParams(req.query as Record<string, unknown>);
    const result = await courseService.listCourses({
      category: req.query.category as string,
      level: req.query.level as string,
      search: req.query.search as string,
      isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
      sort: req.query.sort as string,
      page,
      limit,
    });
    sendPaginated({
      res,
      data: result.courses,
      total: result.total,
      page: result.page,
      limit: result.limit,
      message: 'Courses fetched successfully',
    });
  } catch (err) { next(err); }
});

// GET /courses/:slug — Public: course detail
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const result = await courseService.getCourseBySlug(req.params.slug, req.user?.userId);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

// POST /courses — Teacher/Admin: create course
router.post('/', authenticate, authorize('teacher', 'admin', 'superadmin'), async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body, req.user!.userId);
    sendSuccess({ res, statusCode: 201, data: course, message: 'Course created successfully' });
  } catch (err) { next(err); }
});

// PUT /courses/:id — Teacher/Admin: update course
router.put('/:id', authenticate, authorize('teacher', 'admin', 'superadmin'), async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body, req.user!.userId, req.user!.role);
    sendSuccess({ res, data: course, message: 'Course updated successfully' });
  } catch (err) { next(err); }
});

// DELETE /courses/:id — Admin only
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res, next) => {
  try {
    const result = await courseService.deleteCourse(req.params.id, req.user!.userId, req.user!.role);
    sendSuccess({ res, data: result });
  } catch (err) { next(err); }
});

// GET /courses/:id/analytics — Teacher/Admin
router.get('/:id/analytics', authenticate, authorize('teacher', 'admin', 'superadmin'), async (req, res, next) => {
  try {
    const analytics = await courseService.getCourseAnalytics(req.params.id, req.user!.userId);
    sendSuccess({ res, data: analytics });
  } catch (err) { next(err); }
});

export default router;
