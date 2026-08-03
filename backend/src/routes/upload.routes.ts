import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadRateLimiter } from '../middleware/rateLimiter.middleware';
import { getUploadSignature, CLOUDINARY_FOLDERS } from '../config/cloudinary';
import { sendSuccess } from '../utils/response.utils';
import { AppError } from '../middleware/errorHandler.middleware';

const router = Router();
router.use(authenticate, uploadRateLimiter);

// POST /upload/signature — get signed Cloudinary upload params
router.post('/signature', (req, res, next) => {
  try {
    const { folder, type } = req.body;

    const folderMap: Record<string, string> = {
      avatar: CLOUDINARY_FOLDERS.AVATARS,
      course_thumbnail: CLOUDINARY_FOLDERS.COURSE_THUMBNAILS,
      course_video: CLOUDINARY_FOLDERS.COURSE_VIDEOS,
      course_pdf: CLOUDINARY_FOLDERS.COURSE_PDFS,
      resume: CLOUDINARY_FOLDERS.RESUMES,
      project: CLOUDINARY_FOLDERS.PROJECTS,
      assignment: CLOUDINARY_FOLDERS.ASSIGNMENTS,
      company_logo: CLOUDINARY_FOLDERS.COMPANY_LOGOS,
    };

    const cloudFolder = folderMap[type as string] ?? CLOUDINARY_FOLDERS.AVATARS;
    const signature = getUploadSignature(cloudFolder);
    sendSuccess({ res, data: signature });
  } catch (err) { next(err); }
});

export default router;
