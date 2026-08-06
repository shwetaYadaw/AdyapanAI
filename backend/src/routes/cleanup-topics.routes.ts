import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response.utils';

const router = Router();

// DELETE /cleanup/duplicate-topics - Remove duplicate/old topic names
router.post('/duplicate-topics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🧹 Cleaning up duplicate topics...');

    // Topics to DELETE (old names that conflict with seeded names)
    const topicsToDelete = [
      'Problems on Arrays',  // Keep "Arrays" instead
      'Array',               // Keep "Arrays" instead
    ];

    let deletedCount = 0;

    for (const topicName of topicsToDelete) {
      try {
        const result = await prisma.topic.deleteMany({
          where: {
            name: topicName,
            system: 'coding-arena'
          }
        });
        
        if (result.count > 0) {
          console.log(`✅ Deleted: ${topicName}`);
          deletedCount += result.count;
        }
      } catch (err: any) {
        console.error(`❌ Error deleting ${topicName}:`, err.message);
      }
    }

    // Verify the remaining topics
    const remainingTopics = await prisma.topic.findMany({
      where: { system: 'coding-arena' },
      select: { name: true, id: true },
      orderBy: { order: 'asc' }
    });

    console.log(`\n📋 Remaining topics after cleanup:`);
    remainingTopics.forEach((t, idx) => {
      console.log(`   ${idx + 1}. ${t.name}`);
    });

    sendSuccess({
      res,
      message: `Cleaned up ${deletedCount} duplicate topics`,
      data: {
        deletedCount,
        remainingTopics: remainingTopics.length,
        remainingTopicsList: remainingTopics.map(t => t.name)
      },
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
});

// GET /cleanup/verify - Verify topic-problem matching
router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 Verifying topic-problem matching...');

    const topics = await prisma.topic.findMany({
      where: { system: 'coding-arena' },
      select: { name: true, id: true }
    });

    const verification: any = {};

    for (const topic of topics) {
      const problemCount = await prisma.problem.count({
        where: {
          category: 'coding-arena',
          topics: {
            contains: topic.name,
            mode: 'insensitive'
          }
        }
      });

      verification[topic.name] = {
        topicId: topic.id,
        problemCount
      };
    }

    sendSuccess({
      res,
      data: verification
    });
  } catch (err) {
    next(err);
  }
});

export default router;
