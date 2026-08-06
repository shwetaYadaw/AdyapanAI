import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AdminProblemFilters } from '../types/problem';
import { topicAdminService } from '../services/topicAdminService';

interface ProblemFiltersProps {
  filters: AdminProblemFilters;
  onFiltersChange: (filters: AdminProblemFilters) => void;
  system?: 'coding-arena' | 'tcs-nqt';
  courseId?: string;
}

export default function ProblemFilters({ filters, onFiltersChange, system = 'coding-arena', courseId }: ProblemFiltersProps) {
  const [topics, setTopics] = useState<any[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  // Fetch topics from database on mount and when system/courseId changes
  useEffect(() => {
    fetchTopics();
  }, [system, courseId]);

  const fetchTopics = async () => {
    try {
      setTopicsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setTopics([]);
        return;
      }
      const data = await topicAdminService.getTopics(system, true, courseId);
      setTopics(data || []);
    } catch (err: any) {
      console.error('Failed to fetch topics:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setTopics([]);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search || undefined,
      page: 1
    });
  };

  const handleDifficultyChange = (difficulty: string) => {
    onFiltersChange({
      ...filters,
      difficulty: difficulty || undefined,
      page: 1
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category || undefined,
      page: 1
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search problems..."
          defaultValue={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Difficulty Filter */}
      <select
        value={filters.difficulty || ''}
        onChange={(e) => handleDifficultyChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Category Filter - Now Dynamic from Database */}
      <select
        value={filters.category || ''}
        onChange={(e) => handleCategoryChange(e.target.value)}
        disabled={topicsLoading}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">All Categories {topicsLoading ? '(Loading...)' : `(${topics.length})`}</option>
        {topics.map(topic => (
          <option key={topic.id} value={topic.name}>
            {topic.name}
          </option>
        ))}
      </select>

      {/* Items per page */}
      <select
        value={filters.limit || 20}
        onChange={(e) => onFiltersChange({ ...filters, limit: parseInt(e.target.value), page: 1 })}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
        <option value={100}>100 per page</option>
      </select>
    </div>
  );
}
