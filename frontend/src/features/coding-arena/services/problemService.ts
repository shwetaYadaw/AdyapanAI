/**
 * Problem Service
 * API calls for coding arena problems
 */

import { api } from '../../../core/services/api';
import { Problem, ProblemWithTestCases, ProblemFilters } from '../../../shared/types';
import { API_ENDPOINTS } from '../../../shared/constants';

export const problemService = {
  async getAll(filters?: ProblemFilters) {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.topics) params.append('topics', filters.topics);

    const response = await api.get(`${API_ENDPOINTS.PROBLEMS.LIST}?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<ProblemWithTestCases> {
    const response = await api.get(API_ENDPOINTS.PROBLEMS.GET(id));
    return response.data;
  },

  async getBySlug(slug: string): Promise<Problem> {
    const response = await api.get(`/problems/slug/${slug}`);
    return response.data;
  },

  async runCode(problemId: string, code: string, language: string) {
    const response = await api.post(API_ENDPOINTS.PROBLEMS.RUN(problemId), {
      code,
      language,
    });
    return response.data;
  },

  async submitCode(problemId: string, code: string, language: string) {
    const response = await api.post(API_ENDPOINTS.PROBLEMS.SUBMIT(problemId), {
      code,
      language,
    });
    return response.data;
  },
};
