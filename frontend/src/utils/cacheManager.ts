/**
 * Cache Manager - Handles clearing and invalidating cache across the app
 * This ensures that when admin deletes/updates data, students see the changes immediately
 */

export class CacheManager {
  /**
   * Clear all cached data for a specific entity
   */
  static clearEntityCache(entityType: string, entityId?: string) {
    if (entityId) {
      // Clear specific entity cache
      localStorage.removeItem(`${entityType}_${entityId}`);
      sessionStorage.removeItem(`${entityType}_${entityId}`);
    }
    
    // Clear list cache
    localStorage.removeItem(`${entityType}_list_cache`);
    sessionStorage.removeItem(`${entityType}_list_cache`);
    
    // Clear paginated caches
    for (let i = 1; i <= 100; i++) {
      localStorage.removeItem(`${entityType}_page_${i}`);
      sessionStorage.removeItem(`${entityType}_page_${i}`);
    }
  }

  /**
   * Clear all application cache
   */
  static clearAllCache() {
    // Preserve auth tokens
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    localStorage.clear();
    sessionStorage.clear();
    
    // Restore tokens
    if (token) localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Clear specific problem cache
   */
  static clearProblemCache(problemId?: string) {
    this.clearEntityCache('problem', problemId);
    this.clearEntityCache('coding-arena', problemId);
  }

  /**
   * Clear specific question cache (TCS NQT, Aptitude, etc.)
   */
  static clearQuestionCache(questionId?: string) {
    this.clearEntityCache('question', questionId);
    this.clearEntityCache('tcs-nqt', questionId);
    this.clearEntityCache('aptitude', questionId);
  }

  /**
   * Set cache with expiration
   */
  static setWithExpiration(key: string, value: any, minutesExpiration: number = 30) {
    const now = new Date();
    const expiration = new Date(now.getTime() + minutesExpiration * 60000);
    
    localStorage.setItem(key, JSON.stringify({
      value,
      expiration: expiration.getTime(),
    }));
  }

  /**
   * Get cache with expiration check
   */
  static getWithExpiration(key: string) {
    const item = localStorage.getItem(key);
    
    if (!item) return null;
    
    const cached = JSON.parse(item);
    const now = new Date().getTime();
    
    // Check if cache has expired
    if (now > cached.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cached.value;
  }

  /**
   * Invalidate cache on window focus
   * This ensures fresh data when user switches tabs
   */
  static setupWindowFocusRefresh(callback: () => void) {
    window.addEventListener('focus', () => {
      callback();
    });
  }
}

export default CacheManager;
