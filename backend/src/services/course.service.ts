// @ts-nocheck
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler.middleware';
import { getCache, setCache, deleteCachePattern } from '../config/redis';

const CACHE_TTL = 60 * 5; // 5 minutes

export class CourseService {
  async listCourses(filters: {
    category?: string;
    level?: string;
    search?: string;
    isFree?: boolean;
    sort?: string;
    page: number;
    limit: number;
  }) {
    const cacheKey = `courses:list:${JSON.stringify(filters)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const where: any = { isPublished: true, isApproved: true };
    if (filters.category) where.category = filters.category;
    if (filters.level) where.level = filters.level;
    if (filters.isFree !== undefined) where.isFree = filters.isFree;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const sortMap: Record<string, any> = {
      rating: { rating: 'desc' },
      enrollments: { enrollmentCount: 'desc' },
      newest: { createdAt: 'desc' },
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
    };
    const orderBy = sortMap[filters.sort ?? 'newest'] ?? { createdAt: 'desc' };

    const skip = (filters.page - 1) * filters.limit;
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        select: {
          id: true, title: true, slug: true, image: true, price: true,
          isFree: true, level: true, category: true, instructorId: true,
          rating: true, ratingCount: true, enrollmentCount: true,
          isPublished: true, isApproved: true, createdAt: true,
        },
      }),
      prisma.course.count({ where }),
    ]);

    const result = {
      courses,
      total,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
      limit: filters.limit,
    };

    await setCache(cacheKey, result, CACHE_TTL);
    return result;
  }

  async getCourseBySlug(slug: string, userId?: string) {
    const course = await prisma.course.findFirst({
      where: { slug, isPublished: true, isApproved: true },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lectures: {
              orderBy: { order: 'asc' },
              select: { id: true, title: true, type: true, duration: true, isPreview: true, order: true },
            },
          },
        },
      },
    });

    if (!course) throw new AppError('Course not found', 404);

    let isEnrolled = false;
    if (userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
      });
      isEnrolled = !!enrollment;
    }

    return { course, isEnrolled };
  }

  async createCourse(data: Record<string, any>, instructorId: string) {
    const course = await prisma.course.create({
      data: { ...data, instructorId } as any,
    });
    await deleteCachePattern('courses:list:*');
    return course;
  }


  async updateCourse(courseId: string, data: Record<string, any>, userId: string, userRole: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    const isOwner = course.instructorId === userId;
    const isAdmin = ['admin', 'superadmin'].includes(userRole);
    if (!isOwner && !isAdmin) throw new AppError('Access denied', 403);

    const updated = await prisma.course.update({ where: { id: courseId }, data });
    await deleteCachePattern('courses:list:*');
    return updated;
  }

  async deleteCourse(courseId: string, userId: string, userRole: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    const isAdmin = ['admin', 'superadmin'].includes(userRole);
    if (!isAdmin) throw new AppError('Access denied', 403);

    await prisma.course.delete({ where: { id: courseId } });
    await deleteCachePattern('courses:list:*');
    return { message: 'Course deleted' };
  }

  async approveCourse(courseId: string, adminId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { isApproved: true, approvedBy: adminId },
    });
    await deleteCachePattern('courses:list:*');
    return updated;
  }

  async getInstructorCourses(instructorId: string) {
    return prisma.course.findMany({
      where: { instructorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseAnalytics(courseId: string, instructorId: string) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId },
    });
    if (!course) throw new AppError('Course not found', 404);

    const [totalEnrollments, completedEnrollments, progressAgg] = await Promise.all([
      prisma.enrollment.count({ where: { courseId } }),
      prisma.enrollment.count({ where: { courseId, isCompleted: true } }),
      prisma.enrollment.aggregate({ where: { courseId }, _avg: { progress: true } }),
    ]);

    return {
      totalEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments > 0
        ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
        : 0,
      averageProgress: progressAgg._avg.progress?.toFixed(1) ?? 0,
      rating: course.rating,
      ratingCount: course.ratingCount,
    };
  }
}
