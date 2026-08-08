// @ts-nocheck
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /datasets?courseId=xxx&topic=yyy
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { courseId, topic } = req.query;
    const where: any = {};
    if (courseId) where.courseId = String(courseId);
    if (topic) where.topic = String(topic);

    const datasets = await prisma.courseDataset.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    sendSuccess({ res, data: datasets });
  } catch (err) { next(err); }
});

// POST /datasets
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { courseId, topic, name, tableName, columns, sampleData, questionLimit, format } = req.body;
    if (!courseId || !name || !tableName || !columns) {
      throw new AppError('courseId, name, tableName, and columns are required', 400);
    }

    const dataset = await prisma.courseDataset.create({
      data: {
        courseId,
        topic: topic || '',
        name,
        tableName,
        columns,
        sampleData: sampleData || '',
        questionLimit: questionLimit || 20,
        format: format || 'sql',
      },
    });

    sendSuccess({ res, statusCode: 201, data: dataset });
  } catch (err) { next(err); }
});

// DELETE /datasets/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await prisma.courseDataset.delete({ where: { id: req.params.id } });
    sendSuccess({ res, message: 'Dataset deleted' });
  } catch (err) { next(err); }
});

export default router;
