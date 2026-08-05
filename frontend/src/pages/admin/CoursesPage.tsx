import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, Code2, ChevronDown, ArrowLeft, Plus, Trophy } from 'lucide-react';
import { api } from '../../core/services/api';
import CodingArenaDashboard from '../../features/admin/pages/CodingArenaDashboard';
import TcsNqtDashboard from '../../features/admin/pages/TcsNqtDashboard';

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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'coding-arena' | 'placement-prep'>('overview');

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

  // If a course is selected and a section is active, show that section
  if (selectedCourse && activeSection === 'coding-arena') {
    return <CodingArenaDashboard onBack={() => setActiveSection('overview')} />;
  }

  if (selectedCourse && activeSection === 'placement-prep') {
    return <TcsNqtDashboard onBack={() => setActiveSection('overview')} />;
  }

  // If a course is selected, show its detail page
  if (selectedCourse) {
    return (
      <div className="page-wrapper space-y-6">
        {/* Back button */}
        <button
          onClick={() => { setSelectedCourse(null); setActiveSection('overview'); }}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
        >
          <ArrowLeft size={18} />
          Back to All Courses
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">{selectedCourse.category}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{selectedCourse.name}</h1>
          <p className="text-white/80 text-sm">{selectedCourse.description}</p>
          {selectedCourse.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCourse.languages.map(lang => (
                <span key={lang} className="text-xs px-3 py-1 rounded-full bg-white/20 font-medium">{lang}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Coding Arena Section */}
          <div
            onClick={() => setActiveSection('coding-arena')}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 transition">
                <Code2 size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Coding Arena</h2>
                <p className="text-xs text-gray-500">Add & manage coding problems</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add DSA and coding problems for students in <strong>{selectedCourse.name}</strong>.
              {selectedCourse.languages.length > 0 && (
                <> Problems should be in: <strong>{selectedCourse.languages.join(', ')}</strong></>
              )}
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
              <Plus size={16} />
              Add Coding Problems
            </div>
          </div>

          {/* Placement Prep Section */}
          <div
            onClick={() => setActiveSection('placement-prep')}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 cursor-pointer hover:shadow-lg hover:border-orange-400 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:bg-orange-200 transition">
                <Trophy size={24} className="text-orange-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Placement Prep</h2>
                <p className="text-xs text-gray-500">Add placement questions</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add placement preparation questions for students targeting <strong>{selectedCourse.name}</strong> roles.
              {selectedCourse.technologies.length > 0 && (
                <> Focus on: <strong>{selectedCourse.technologies.join(', ')}</strong></>
              )}
            </p>
            <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
              <Plus size={16} />
              Add Placement Questions
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main courses list
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
            Click on a course to add Coding Arena & Placement Prep questions for it.
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
            onClick={() => setSelectedCourse(course)}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
          >
            {/* Card Header */}
            <div className="h-24 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 dark:from-orange-600 dark:via-amber-700 dark:to-yellow-600 relative p-4">
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-bold">
                Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                {course.category}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-orange-600 transition-colors">
                {course.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{course.description}</p>

              {course.languages.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {course.languages.slice(0, 4).map((lang) => (
                    <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                      {lang}
                    </span>
                  ))}
                  {course.languages.length > 4 && (
                    <span className="text-[10px] text-gray-400">+{course.languages.length - 4}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-blue-600 font-medium"><Code2 size={10} /> Coding Arena</span>
                  <span className="flex items-center gap-1 text-[10px] text-orange-600 font-medium"><Trophy size={10} /> Placement</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No courses found.</p>
        </div>
      )}
    </div>
  );
}
