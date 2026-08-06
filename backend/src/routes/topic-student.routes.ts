import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler.middleware';
import { sendSuccess } from '../utils/response.utils';

const router = Router();

// ============================================
// PUBLIC STUDENT ENDPOINTS
// ============================================

// GET /topics - Get all active topics for a specific system (public endpoint for students)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const system = req.query.system as string | undefined; // 'coding-arena', 'tcs-nqt', 'aptitude'
    const courseId = req.query.courseId as string | undefined;

    if (!system) {
      throw new AppError('system query parameter is required', 400);
    }

    const where: any = {
      system,
      isActive: true,
    };

    if (courseId) {
      where.courseId = courseId;
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        system: true,
        description: true,
        order: true
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

// POST /topics/bulk/seed - Seed initial topics for Coding Arena (public endpoint for initial setup)
router.post('/bulk/seed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const initialTopics = [
      { name: 'Arrays', system: 'coding-arena', description: 'Kadane\'s, Two Pointer, Sliding Window, Prefix Sum, and other Array essentials.', order: 0 },
      { name: 'Strings', system: 'coding-arena', description: 'Anagrams, Palindromes, Group Anagrams, and other String algorithms.', order: 1 },
      { name: '2D Arrays', system: 'coding-arena', description: 'Matrix operations, Zigzag traversals, Set zeroes, Spiral and Rotate matrix.', order: 2 },
      { name: 'Hashing', system: 'coding-arena', description: 'Hashing concepts, Two Sum, Top K elements, Majority Element, Consecutive sequences.', order: 3 },
      { name: 'Two Pointers', system: 'coding-arena', description: 'Sorted array operations, 3Sum, Container with most water, and Trapping water.', order: 4 },
      { name: 'Sliding Window', system: 'coding-arena', description: 'Maximum sum subarray, character replacement, permutation matching.', order: 5 },
      { name: 'Binary Search', system: 'coding-arena', description: 'Rotated arrays search, insert positions, peak elements, and search bounds.', order: 6 },
      { name: 'Searching & Sorting', system: 'coding-arena', description: 'Counting sort, merge sorted arrays, inversion counts, aggressive cows, and page allocation.', order: 7 },
      { name: 'Linked List', system: 'coding-arena', description: 'Reversing lists, cycle detection, middle node, LRU Cache.', order: 8 },
      { name: 'Stack', system: 'coding-arena', description: 'Valid Parentheses, Min Stack, Next Greater Element, and Histogram problems.', order: 9 },
      { name: 'Queue & Deque', system: 'coding-arena', description: 'Queues using stacks, circular queues, sliding window maximums, and rotten oranges.', order: 10 },
      { name: 'Recursion & Backtracking', system: 'coding-arena', description: 'Generate Parentheses, subsets, permutations, combination sums, N-Queens.', order: 11 },
      { name: 'Trees', system: 'coding-arena', description: 'Binary trees depth, LCA, level order traversals, inversion, serialization.', order: 12 },
      { name: 'Binary Search Tree', system: 'coding-arena', description: 'BST validation, Lowest Common Ancestor, recovering BST, BST Iterator.', order: 13 },
      { name: 'Heap/Priority Queue', system: 'coding-arena', description: 'Kth largest element, top K frequent, merging K sorted lists, median streaming.', order: 14 },
      { name: 'Graphs', system: 'coding-arena', description: 'Number of islands, course scheduling, clone graph, network delay time.', order: 15 },
      { name: 'DFS/BFS', system: 'coding-arena', description: 'Flood fill, provinces count, surrounded regions, shortest paths in binary matrices.', order: 16 },
      { name: 'Dynamic Programming', system: 'coding-arena', description: 'Climbing Stairs, House Robber, Coin Change, LIS, LCS, Edit Distance.', order: 17 },
      { name: 'Greedy', system: 'coding-arena', description: 'Jump Game I & II, Gas Station, Cookies assignment, Non-overlapping intervals.', order: 18 },
      { name: 'Bit Manipulation', system: 'coding-arena', description: 'Single Number, counting bits, missing number, power of two checks.', order: 19 },
      { name: 'Trie', system: 'coding-arena', description: 'Implement Trie, replace words, map sum pairs, maximum XOR of two numbers.', order: 20 },
      { name: 'Segment Tree/Fenwick Tree', system: 'coding-arena', description: 'Range sum queries, mutable range queries, lazy propagation.', order: 21 }
    ];

    const created: any[] = [];
    const skipped: any[] = [];

    for (const topicData of initialTopics) {
      try {
        const existing = await prisma.topic.findUnique({
          where: {
            name_system: {
              name: topicData.name,
              system: topicData.system
            }
          }
        });

        if (existing) {
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
          created,
          skipped
        }
      },
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
});

export default router;
