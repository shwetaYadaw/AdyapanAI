import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { sendSuccess, getPaginationParams, sendPaginated } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();

// GET /forum/posts
router.get('/posts', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, unknown>);
    const where: any = {};
    if (req.query.courseId) where.courseId = String(req.query.courseId);
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.search) {
      where.OR = [
        { title: { contains: String(req.query.search) } },
        { content: { contains: String(req.query.search) } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.forumPost.count({ where }),
    ]);
    sendPaginated({ res, data: posts, total, page, limit });
  } catch (err) { next(err); }
});

// POST /forum/posts
router.post('/posts', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.forumPost.create({
      data: { ...req.body, authorId: req.user!.userId },
    });
    sendSuccess({ res, statusCode: 201, data: post });
  } catch (err) { next(err); }
});

// GET /forum/posts/:id
router.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await prisma.forumPost.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
    });
    if (!post) throw new AppError('Post not found', 404);

    const replies = await prisma.forumReply.findMany({
      where: { postId: req.params.id },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
      orderBy: [{ isAccepted: 'desc' }, { upvotes: 'desc' }, { createdAt: 'asc' }],
    });

    sendSuccess({ res, data: { post, replies } });
  } catch (err) { next(err); }
});

// POST /forum/posts/:id/replies
router.post('/posts/:id/replies', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.forumPost.findUnique({ where: { id: req.params.id } });
    if (!post) throw new AppError('Post not found', 404);
    if (post.isClosed) throw new AppError('This post is closed', 400);

    const reply = await prisma.forumReply.create({
      data: { postId: req.params.id, authorId: req.user!.userId, content: req.body.content },
    });
    await prisma.forumPost.update({
      where: { id: req.params.id },
      data: { replyCount: { increment: 1 } },
    });
    sendSuccess({ res, statusCode: 201, data: reply });
  } catch (err) { next(err); }
});

// POST /forum/posts/:id/upvote
router.post('/posts/:id/upvote', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.forumPost.findUnique({ where: { id: req.params.id } });
    if (!post) throw new AppError('Post not found', 404);

    const upvotedBy: string[] = Array.isArray(post.upvotedBy) ? post.upvotedBy as string[] : [];
    const hasUpvoted = upvotedBy.includes(req.user!.userId);

    if (hasUpvoted) {
      await prisma.forumPost.update({
        where: { id: req.params.id },
        data: {
          upvotes: { decrement: 1 },
          upvotedBy: upvotedBy.filter(id => id !== req.user!.userId),
        },
      });
    } else {
      await prisma.forumPost.update({
        where: { id: req.params.id },
        data: {
          upvotes: { increment: 1 },
          upvotedBy: [...upvotedBy, req.user!.userId],
        },
      });
    }
    sendSuccess({ res, data: { upvoted: !hasUpvoted } });
  } catch (err) { next(err); }
});

export default router;
