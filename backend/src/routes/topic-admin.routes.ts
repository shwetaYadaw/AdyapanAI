import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler.middleware';
import { sendSuccess } from '../utils/response.utils';

const router = Router();

// ============================================
// MIDDLEWARE
// ============================================

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId || '' }
    });
    
    if (!user || user.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }
    next();
  } catch (err) {
    next(err);
  }
}

// ============================================
// TOPIC MANAGEMENT ENDPOINTS
// ============================================

// GET /api/admin/topics - Get all topics (filtered by system and active status)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const system = req.query.system as string | undefined; // 'coding-arena', 'tcs-nqt', 'aptitude'
    const activeOnly = req.query.activeOnly === 'true';

    if (!system) {
      throw new AppError('system query parameter is required', 400);
    }

    const where: any = {
      system
    };

    // Filter by courseId if provided
    if (req.query.courseId === 'none') {
      where.courseId = null; // Only global topics
    } else if (req.query.courseId) {
      where.courseId = String(req.query.courseId);
    }    if (activeOnly) {
      where.isActive = true;
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        system: true,
        description: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true
      }
    });

    sendSuccess({
      res,
      data: topics
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/topics - Create new topic
router.post('/', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, system, description, order, courseId } = req.body;

    if (!name || !system) {
      throw new AppError('name and system are required', 400);
    }

    // Validate system
    if (!['coding-arena', 'tcs-nqt', 'aptitude'].includes(system)) {
      throw new AppError('Invalid system. Must be one of: coding-arena, tcs-nqt, aptitude', 400);
    }

    // Check if topic already exists for this system and courseId combination
    const existingTopics = await prisma.topic.findMany({
      where: {
        name,
        system,
        courseId: courseId || null
      }
    });

    if (existingTopics.length > 0) {
      throw new AppError(`Topic "${name}" already exists for this system`, 409);
    }

    // Get the highest order and add 1
    const maxOrder = await prisma.topic.aggregate({
      where: { system, courseId: courseId || null },
      _max: { order: true }
    });

    const newOrder = ((maxOrder._max?.order) || 0) + 1;

    const topic = await prisma.topic.create({
      data: {
        name,
        system,
        description,
        order: order || newOrder,
        courseId: courseId || undefined, // Include courseId if provided
        isActive: true,
        createdBy: req.user?.userId
      }
    });

    sendSuccess({
      res,
      message: 'Topic created successfully',
      data: topic,
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/topics/:id - Update topic
router.put('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, order } = req.body;

    const existing = await prisma.topic.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new AppError('Topic not found', 404);
    }

    // Check for duplicate if changing name
    if (name && name !== existing.name) {
      const duplicates = await prisma.topic.findMany({
        where: {
          name,
          system: existing.system,
          courseId: existing.courseId || null
        }
      });

      if (duplicates.length > 0) {
        throw new AppError(`Topic "${name}" already exists for system "${existing.system}"`, 409);
      }
    }

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        order: order !== undefined ? order : existing.order
      }
    });

    sendSuccess({
      res,
      message: 'Topic updated successfully',
      data: topic
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/topics/:id - Delete topic
router.delete('/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await prisma.topic.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new AppError('Topic not found', 404);
    }

    await prisma.topic.delete({
      where: { id }
    });

    sendSuccess({
      res,
      message: 'Topic deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/topics/bulk/seed - Seed initial topics for all systems
router.post('/bulk/seed', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const initialTopics = [
      // Coding Arena Topics
      ...['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Hashing', 'Stack', 'Queue', 'Recursion', 'Backtracking', 'Greedy', 'Binary Search', 'Bit Manipulation', 'Segment Tree', 'Fenwick Tree', 'Trie', 'Two Pointers', 'Sliding Window', 'Heap/Priority Queue', 'DFS/BFS', 'Sorting'].map((name, idx) => ({
        name,
        system: 'coding-arena',
        description: `${name} problems for top MNC companies`,
        order: idx,
        isActive: true,
        createdBy: req.user?.userId
      })),
      // TCS NQT Topics - NEW TOPICS (replacing old ones)
      ...['Arrays', 'Numbers System', 'Bit Manipulation', 'Sorting', 'String'].map((name, idx) => ({
        name,
        system: 'tcs-nqt',
        description: `${name} questions for TCS NQT preparation`,
        order: idx,
        isActive: true,
        createdBy: req.user?.userId
      })),
      // Aptitude Topics
      ...['Quantitative Aptitude', 'Verbal Reasoning', 'Logical Reasoning', 'Data Interpretation', 'Puzzles', 'Numbers', 'Percentages', 'Time & Distance', 'Time & Work', 'Profit & Loss', 'Ratios & Proportions', 'Averages', 'Permutation & Combination', 'Probability', 'Geometry', 'Algebra'].map((name, idx) => ({
        name,
        system: 'aptitude',
        description: `${name} for all companies`,
        order: idx,
        isActive: true,
        createdBy: req.user?.userId
      }))
    ];

    const created: any[] = [];
    const skipped: any[] = [];

    for (const topicData of initialTopics) {
      try {
        // Check if already exists using findMany for safer null handling
        const existing = await prisma.topic.findMany({
          where: {
            name: topicData.name,
            system: topicData.system,
            courseId: null // Global topics don't have courseId
          }
        });

        if (existing.length > 0) {
          skipped.push({
            name: topicData.name,
            system: topicData.system,
            reason: 'Already exists'
          });
          continue;
        }

        const topic = await prisma.topic.create({
          data: topicData
        });

        created.push({
          name: topic.name,
          system: topic.system,
          id: topic.id
        });
      } catch (err: any) {
        skipped.push({
          name: topicData.name,
          system: topicData.system,
          reason: err.message
        });
      }
    }

    sendSuccess({
      res,
      message: `Seeded ${created.length} topics, skipped ${skipped.length}`,
      data: {
        created: created.length,
        skipped: skipped.length,
        results: {
          created: created.slice(0, 10),
          skipped: skipped.slice(0, 10)
        }
      },
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/topics/bulk/reorder - Reorder topics
router.put('/bulk/reorder', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topics } = req.body; // Array of { id, order }

    if (!Array.isArray(topics)) {
      throw new AppError('topics must be an array', 400);
    }

    const updated = await Promise.all(
      topics.map(({ id, order }) =>
        prisma.topic.update({
          where: { id },
          data: { order }
        })
      )
    );

    sendSuccess({
      res,
      message: 'Topics reordered successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/topics/tcs-nqt/refresh - Delete old TCS NQT topics and add new ones
router.post('/tcs-nqt/refresh', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all existing TCS NQT topics
    await prisma.topic.deleteMany({
      where: {
        system: 'tcs-nqt'
      }
    });

    // Create new TCS NQT topics
    const newTopics = ['Arrays', 'Numbers System', 'Bit Manipulation', 'Sorting', 'String'].map((name, idx) => ({
      name,
      system: 'tcs-nqt',
      description: `${name} questions for TCS NQT preparation`,
      order: idx,
      isActive: true,
      createdBy: req.user?.userId
    }));

    const created = await Promise.all(
      newTopics.map(topicData =>
        prisma.topic.create({
          data: topicData
        })
      )
    );

    sendSuccess({
      res,
      message: 'TCS NQT topics refreshed successfully',
      data: {
        deleted: 'All old TCS NQT topics',
        created: created.length,
        topics: created.map(t => ({ id: t.id, name: t.name, order: t.order }))
      },
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
});

export default router;
