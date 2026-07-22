/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate password strength
 * Min 8 chars, at least one uppercase, one lowercase, one number
 */
export function isValidPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  const levels = [
    { score: 0, label: 'Very Weak', color: '#ef4444' },
    { score: 1, label: 'Weak', color: '#f97316' },
    { score: 2, label: 'Fair', color: '#eab308' },
    { score: 3, label: 'Good', color: '#22c55e' },
    { score: 4, label: 'Strong', color: '#16a34a' },
  ];

  const capped = Math.min(score, 4);
  return levels[capped];
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone.replace(/\s|-/g, ''));
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate GitHub URL
 */
export function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+/.test(url);
}

/**
 * Validate LinkedIn URL
 */
export function isValidLinkedInUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/.test(url);
}

/**
 * Sanitize HTML (strip tags for display)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Validate file type by extension
 */
export function isAllowedFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return allowedTypes.includes(ext);
}

/**
 * Validate file size (in bytes)
 */
export function isFileSizeValid(sizeInBytes: number, maxMB: number): boolean {
  return sizeInBytes <= maxMB * 1024 * 1024;
}
