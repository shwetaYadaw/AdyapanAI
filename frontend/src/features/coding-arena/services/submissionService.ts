/**
 * Submission Service
 * API calls for submissions
 */

import { api } from '../../../core/services/api';
import { SubmissionWithDetails } from '../../../shared/types';
import { API_ENDPOINTS } from '../../../shared/constants';

export const submissionService = {
  async getSubmission(submissionId: string): Promise<SubmissionWithDetails> {
    const response = await api.get(API_ENDPOINTS.SUBMISSIONS.GET(submissionId));
    return response.data;
  },

  async getHistory(filters?: { problemId?: string; status?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters?.problemId) params.append('problemId', filters.problemId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await api.get(`${API_ENDPOINTS.SUBMISSIONS.HISTORY}?${params.toString()}`);
    return response.data;
  },

  async getMySubmissions(problemId: string) {
    const response = await api.get(API_ENDPOINTS.SUBMISSIONS.MY_SUBMISSIONS(problemId));
    return response.data;
  },
};
