import { api } from '../../../core/services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface Topic {
  id?: string;
  name: string;
  system: 'coding-arena' | 'tcs-nqt' | 'aptitude';
  description?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

class TopicAdminService {
  // Get all topics for a specific system
  async getTopics(system: 'coding-arena' | 'tcs-nqt' | 'aptitude', activeOnly = true) {
    try {
      const response = await api.get('/admin/topics', {
        params: {
          system,
          activeOnly
        }
      });
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  }

  // Create new topic
  async createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await api.post('/admin/topics', topic);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }

  // Update topic
  async updateTopic(id: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const response = await api.put(`/admin/topics/${id}`, updates);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete topic
  async deleteTopic(id: string) {
    try {
      await api.delete(`/admin/topics/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Seed initial topics for all systems
  async seedTopics() {
    try {
      const response = await api.post('/admin/topics/bulk/seed');
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }

  // Reorder topics
  async reorderTopics(topics: Array<{ id: string; order: number }>) {
    try {
      const response = await api.put('/admin/topics/bulk/reorder', {
        topics
      });
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }
}

export const topicAdminService = new TopicAdminService();
