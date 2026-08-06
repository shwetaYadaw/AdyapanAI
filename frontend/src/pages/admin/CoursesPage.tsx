import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Code2, ChevronDown, ArrowLeft, Plus, Trophy } from 'lucide-react';
import { api } from '../../core/services/api';
import CourseCodingArena from '../../features/admin/pages/CourseCodingArena';
import CoursePlacementPrep from '../../features/admin/pages/CoursePlacementPrep';

interface Course {
  id: string;
  name: string;
  category: string;
  languages: string[];
  technologies: string[];
  description: string;
}

export default function AdminCoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Read state from URL params
  const courseId = searchParams.get('course');
  const section = searchParams.get('section'); // 'coding-arena' | 'placement-prep'

  const { data: coursesGrouped } = useQuery<Record<string, Course[]>>({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data } = await api.get('/courses?grouped=true');
      return data.data;
    },
  });

  const allCourses = coursesGrouped ? Object.values(coursesGrouped).flat() : [];
  const categories = coursesGrouped ? ['all', ...Object.keys(coursesGrouped)] : ['all'];
  const selectedCourse = courseId ? allCourses.find(c => c.id === courseId) : null;

  const filtered = allCourses.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.languages.some(l => l.toLowerCase().includes(search.toLowerCase())) ||
      c.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Navigate helpers
  const goToCourse = (c: Course) => setSearchParams({ course: c.id });
  const goToSection = (s: string) => setSearchParams({ course: courseId!, section: s });
  const goBack = () => {
    if (section) {
      setSearchParams({ course: courseId! });
    } else {
      setSearchParams({});
    }
  };

  // === SECTION VIEW: Coding Arena or Placement Prep ===
  if (selectedCourse && section === 'coding-arena') {
    return <CourseCodingArena onBack={goBack} courseId={selectedCourse.id} courseName={selectedCourse.name} />;
  }
  if (selectedCourse && section === 'placement-prep') {
    return <CoursePlacementPrep onBack={goBack} courseId={selectedCourse.id} courseName={selectedCourse.name} />;
  }

  // === COURSE DETAIL VIEW ===
  if (selectedCourse) {
    return (
      <div className="page-wrapper space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium text-sm transition">
          <ArrowLeft size={18} /> Back to All Courses
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber rounded-2xl p-6 text-white shadow-brand">
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 font-medium backdrop-blur-sm">{selectedCourse.category}</span>
          <h1 className="text-2xl font-bold mt-3">{selectedCourse.name}</h1>
          <p className="text-white/75 text-sm mt-1">{selectedCourse.description}</p>
          {selectedCourse.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCourse.languages.map(lang => (
                <span key={lang} className="text-xs px-3 py-1 rounded-full bg-white/15 font-medium">{lang}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div onClick={() => goToSection('coding-arena')} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Code2 size={22} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Coding Arena</h2>
                <p className="text-xs text-gray-500">DSA problems for {selectedCourse.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedCourse.languages.length > 0 ? <>Languages: <strong>{selectedCourse.languages.join(', ')}</strong></> : 'Add coding problems'}
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all"><Plus size={16} /> Manage Problems <ChevronDown size={14} className="rotate-[-90deg]" /></div>
          </div>

          <div onClick={() => goToSection('placement-prep')} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-brand-amber flex items-center justify-center shadow-brand">
                <Trophy size={22} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Placement Prep</h2>
                <p className="text-xs text-gray-500">Placement questions for {selectedCourse.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedCourse.technologies.length > 0 ? <>Focus: <strong>{selectedCourse.technologies.join(', ')}</strong></> : 'Add placement questions'}
            </p>
            <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all"><Plus size={16} /> Manage Questions <ChevronDown size={14} className="rotate-[-90deg]" /></div>
          </div>
        </div>
      </div>
    );
  }

  // === MAIN COURSES LIST ===
  return (
    <div className="page-wrapper space-y-6 bg-brand-cream min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber rounded-2xl p-6 shadow-brand">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Course Management</h1>
              <p className="text-sm text-white/70 mt-0.5">Click a course to add Coding Arena & Placement Prep questions.</p>
            </div>
          </div>
          <span className="hidden sm:block text-sm text-white/80 bg-white/10 px-3 py-1.5 rounded-lg font-medium">{filtered.length} Courses</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-md">
        <div className="relative">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400">
            {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400" />
        </div>
        <span className="text-xs text-gray-400 ml-auto font-medium">Showing {filtered.length} courses</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course, idx) => {
          const gradients = [
            'from-blue-500 via-indigo-500 to-violet-500',
            'from-primary-500 via-primary-400 to-brand-amber',
            'from-emerald-500 via-teal-500 to-cyan-500',
            'from-rose-500 via-pink-500 to-fuchsia-500',
            'from-amber-500 via-orange-500 to-red-400',
            'from-cyan-500 via-blue-500 to-indigo-500',
          ];
          const gradient = gradients[idx % gradients.length];
          return (
          <div key={course.id} onClick={() => goToCourse(course)} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className={`h-28 relative p-4 bg-gradient-to-br ${gradient}`}>
              <span className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full bg-white/90 text-green-600 font-bold shadow-sm">Active</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/20 text-white font-medium backdrop-blur-sm">{course.category}</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-primary-600 transition-colors">{course.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-1">{course.description}</p>
              {course.languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {course.languages.slice(0, 4).map(lang => <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">{lang}</span>)}
                  {course.languages.length > 4 && <span className="text-[10px] text-gray-400">+{course.languages.length - 4}</span>}
                </div>
              )}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold"><Code2 size={10} /> Coding Arena</span>
                <span className="flex items-center gap-1 text-[10px] text-primary-600 font-semibold"><Trophy size={10} /> Placement</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
