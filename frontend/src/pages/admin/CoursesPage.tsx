import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, Code2, ChevronDown } from 'lucide-react';
import { api } from '../../core/services/api';

interface Course {
  id: string;
  name: string;
  category: string;
  languages: string[];
  technologies: string[];
  description: string;
}

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: coursesGrouped } = useQuery<Record<string, Course[]>>({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data } = await api.get('/courses?grouped=true');
      return data.data;
    },
  });

  const allCourses = coursesGrouped ? Object.values(coursesGrouped).flat() : [];
  const categories = coursesGrouped ? ['all', ...Object.keys(coursesGrouped)] : ['all'];

  const filtered = allCourses.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.languages.some(l => l.toLowerCase().includes(search.toLowerCase())) ||
      c.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page-wrapper space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen size={24} className="text-orange-500" />
            Course Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse all courses. Each course has its own Coding Arena & Placement Prep section.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Category:</span>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Course..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <span className="text-sm text-gray-400 ml-auto">
          Showing {filtered.length} courses
        </span>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Card Header with gradient */}
            <div className="h-28 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 dark:from-orange-600 dark:via-amber-700 dark:to-yellow-600 relative flex items-end p-4">
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-bold">
                Active
              </span>
              <div className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium backdrop-blur-sm">
                {course.category}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-orange-600 transition-colors">
                {course.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{course.description}</p>

              {/* Languages */}
              {course.languages.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {course.languages.map((lang) => (
                    <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              )}

              {/* Technologies */}
              {course.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {course.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                      {tech}
                    </span>
                  ))}
                  {course.technologies.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{course.technologies.length - 3}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Code2 size={12} />
                  <span>{course.languages.length > 0 ? `${course.languages.length} languages` : 'No coding'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
}
