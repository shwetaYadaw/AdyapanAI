import axios, { AxiosInstance } from 'axios';
import { Problem, AdminProblemFilters, AdminProblemResponse, ProblemVersion } from '../types/problem';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

class ProblemAdminService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/admin/problems`,
      withCredentials: true,
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Create a new problem
   */
  async createProblem(problem: Problem): Promise<Problem> {
    const { data } = await this.api.post('/', problem);
    return data.data;
  }

  /**
   * Get all problems with filters and pagination
   */
  async getProblems(filters?: AdminProblemFilters): Promise<AdminProblemResponse> {
    const { data } = await this.api.get('/', { params: filters });
    // Backend returns: { success, data: { problems: [], pagination: {} } }
    const inner = data.data ?? {};
    return {
      problems: Array.isArray(inner.problems) ? inner.problems : (Array.isArray(inner) ? inner : []),
      pagination: inner.pagination ?? data.pagination ?? { total: 0, page: 1, limit: 20, pages: 0 },
    };
  }

  /**
   * Get a single problem with all details
   */
  async getProblem(id: string): Promise<Problem> {
    const { data } = await this.api.get(`/${id}`);
    return data.data;
  }

  /**
   * Update a problem
   */
  async updateProblem(id: string, problem: Partial<Problem>, changeReason?: string): Promise<Problem> {
    const payload = {
      ...problem,
      changeReason
    };
    const { data } = await this.api.put(`/${id}`, payload);
    return data.data;
  }

  /**
   * Archive a problem (soft delete)
   */
  async deleteProblem(id: string, queryClient?: any): Promise<void> {
    await this.api.delete(`/${id}`);
    
    // Invalidate React Query caches if queryClient is provided
    if (queryClient) {
      // Invalidate all problems queries
      queryClient.invalidateQueries({ queryKey: ['codingArenaProblems'] });
      // Also invalidate specific topic pages
      queryClient.invalidateQueries({ queryKey: ['codingArenaProblems', /.*/ ] });
    }
    
    // Clear local storage cache as fallback
    localStorage.removeItem(`problem_${id}`);
    localStorage.removeItem('problems_list_cache');
  }

  /**
   * Restore an archived problem
   */
  async restoreProblem(id: string): Promise<void> {
    await this.api.post(`/${id}/restore`);
  }

  /**
   * Get version history for a problem
   */
  async getVersionHistory(id: string): Promise<ProblemVersion[]> {
    const { data } = await this.api.get(`/${id}/version-history`);
    return data.data;
  }

  /**
   * Import problems from JSON
   */
  async importProblems(problems: Problem[]): Promise<any> {
    const { data } = await this.api.post('/bulk/import', { problems });
    return data.data;
  }

  /**
   * Get analytics
   */
  async getAnalytics(): Promise<any> {
    const { data } = await this.api.get('/analytics/overview');
    return data.data;
  }
}

export const problemAdminService = new ProblemAdminService();
