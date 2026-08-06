// @ts-nocheck
import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';
import { COURSES, getCourseById, getCoursesByCategory } from '../config/courses';

const router = Router();

// GET /courses — Get all available courses (public)
router.get('/', (req: Request, res: Response) => {
  const grouped = req.query.grouped === 'true';
  if (grouped) {
    sendSuccess({ res, data: getCoursesByCategory() });
  } else {
    sendSuccess({ res, data: COURSES });
  }
});

// GET /courses/my-course — Get current student's course (MUST be before /:id)
router.get('/my-course', authenticate, async (req: Request, res: Response, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      select: { course: true },
    });

    const courseId = profile?.course;
    const course = courseId ? getCourseById(courseId) : null;

    sendSuccess({ res, data: { courseId, course } });
  } catch (err) { next(err); }
});

// PUT /courses/select — Student selects their course
router.put('/select', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) throw new AppError('courseId is required', 400);

    const course = getCourseById(courseId);
    if (!course) throw new AppError('Invalid course ID', 400);

    // Update student profile
    await prisma.studentProfile.upsert({
      where: { userId: req.user!.userId },
      update: { course: courseId },
      create: { userId: req.user!.userId, course: courseId },
    });

    sendSuccess({ res, data: { courseId, course }, message: 'Course selected successfully' });
  } catch (err) { next(err); }
});

// GET /courses/:id — Get single course details
router.get('/:id', (req: Request, res: Response) => {
  const course = getCourseById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  sendSuccess({ res, data: course });
});

// POST /courses — Add a new course (admin only)
router.post('/', authenticate, async (req: Request, res: Response, next) => {
  try {
    const { name, category, languages, technologies, description } = req.body;

    if (!name || !category) {
      throw new AppError('Name and category are required', 400);
    }

    // Generate ID from name
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if already exists
    if (getCourseById(id)) {
      throw new AppError('Course with this name already exists', 409);
    }

    const newCourse = {
      id,
      name,
      category,
      languages: languages || [],
      technologies: technologies || [],
      description: description || '',
    };

    // Add to in-memory array
    COURSES.push(newCourse);

    // Persist to JSON file
    const fs = require('fs');
    const path = require('path');
    const dataFile = path.resolve(__dirname, '../data/courses-custom.json');
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Read existing custom courses or start fresh
    let customCourses: any[] = [];
    if (fs.existsSync(dataFile)) {
      customCourses = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
    customCourses.push(newCourse);
    fs.writeFileSync(dataFile, JSON.stringify(customCourses, null, 2));

    sendSuccess({ res, statusCode: 201, data: newCourse, message: 'Course created successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /courses/:id — Delete a course (admin only)
router.delete('/:id', authenticate, async (req: Request, res: Response, next) => {
  try {
    const idx = COURSES.findIndex(c => c.id === req.params.id);
    if (idx === -1) throw new AppError('Course not found', 404);

    COURSES.splice(idx, 1);

    // Also remove from JSON file
    const fs = require('fs');
    const path = require('path');
    const dataFile = path.resolve(__dirname, '../data/courses-custom.json');
    if (fs.existsSync(dataFile)) {
      let customCourses = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      customCourses = customCourses.filter((c: any) => c.id !== req.params.id);
      fs.writeFileSync(dataFile, JSON.stringify(customCourses, null, 2));
    }

    sendSuccess({ res, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
