export const env = {
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID ?? '',
  APP_NAME: 'ADYAPAN',
  APP_TAGLINE: 'AI-Powered Career Development Ecosystem',
};
