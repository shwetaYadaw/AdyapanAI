import React from 'react';
import { Search } from 'lucide-react';
import { AdminProblemFilters } from '../types/problem';

interface ProblemFiltersProps {
  filters: AdminProblemFilters;
  onFiltersChange: (filters: AdminProblemFilters) => void;
}

export default function ProblemFilters({ filters, onFiltersChange }: ProblemFiltersProps) {
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

      {/* Category Filter */}
      <select
        value={filters.category || ''}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="arrays">Arrays</option>
        <option value="strings">Strings</option>
        <option value="trees">Trees</option>
        <option value="graphs">Graphs</option>
        <option value="dynamic-programming">Dynamic Programming</option>
        <option value="general">General</option>
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
