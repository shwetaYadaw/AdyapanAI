import axios from 'axios';

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
      const response = await axios.get(`${API_BASE_URL}/admin/topics`, {
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
      const response = await axios.post(`${API_BASE_URL}/admin/topics`, topic);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }

  // Update topic
  async updateTopic(id: string, updates: Partial<Topic>) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/topics/${id}`, updates);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete topic
  async deleteTopic(id: string) {
    try {
      await axios.delete(`${API_BASE_URL}/admin/topics/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Seed initial topics for all systems
  async seedTopics() {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/topics/bulk/seed`);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }

  // Reorder topics
  async reorderTopics(topics: Array<{ id: string; order: number }>) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/topics/bulk/reorder`, {
        topics
      });
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }
}

export const topicAdminService = new TopicAdminService();
