/**
 * API utility with automatic cache invalidation support
 * Watches for X-Cache-Invalidate headers in responses and clears cache
 */

import CacheManager from './cacheManager';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Make an API request and handle cache invalidation
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Check for cache invalidation headers
  const cacheInvalidate = response.headers.get('X-Cache-Invalidate');
  const entityId = response.headers.get('X-Entity-ID');

  if (cacheInvalidate && entityId) {
    // Clear the specific entity cache
    CacheManager.clearEntityCache(cacheInvalidate, entityId);
  } else if (cacheInvalidate) {
    // Clear all caches for that entity type
    CacheManager.clearEntityCache(cacheInvalidate);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * GET request with cache invalidation support
 */
export function apiGet<T = any>(url: string) {
  return apiRequest<T>(url, { method: 'GET' });
}

/**
 * POST request with cache invalidation support
 */
export function apiPost<T = any>(url: string, data?: any) {
  return apiRequest<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request with cache invalidation support
 */
export function apiPut<T = any>(url: string, data?: any) {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request with cache invalidation support
 */
export function apiPatch<T = any>(url: string, data?: any) {
  return apiRequest<T>(url, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request with cache invalidation support
 */
export function apiDelete<T = any>(url: string) {
  return apiRequest<T>(url, { method: 'DELETE' });
}

export default {
  request: apiRequest,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};
