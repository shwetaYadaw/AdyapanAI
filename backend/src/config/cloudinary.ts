import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const CLOUDINARY_FOLDERS = {
  AVATARS: 'adyapan/avatars',
  COURSE_THUMBNAILS: 'adyapan/courses/thumbnails',
  COURSE_VIDEOS: 'adyapan/courses/videos',
  COURSE_PDFS: 'adyapan/courses/pdfs',
  CERTIFICATES: 'adyapan/certificates',
  RESUMES: 'adyapan/resumes',
  PROJECTS: 'adyapan/projects',
  ASSIGNMENTS: 'adyapan/assignments',
  COMPANY_LOGOS: 'adyapan/companies',
} as const;

export function getUploadSignature(folder: string, publicId?: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params: Record<string, string | number> = {
    timestamp,
    folder,
  };
  if (publicId) params.public_id = publicId;

  const signature = cloudinary.utils.api_sign_request(
    params,
    env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    folder,
  };
}
