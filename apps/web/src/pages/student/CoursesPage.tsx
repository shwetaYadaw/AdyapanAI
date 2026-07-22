import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCoursesThunk, setFilters } from '../../features/courses/coursesSlice';
import CourseCard from '../../components/feature/course/CourseCard/CourseCard';
import Pagination from '../../components/common/Pagination/Pagination';
import Badge from '../../components/common/Badge/Badge';
import Navbar from '../../components/layout/Navbar/Navbar';
import { clsx } from 'clsx';

const CATEGORIES = [
  { value: '', label: 'All Courses' },
  { value: 'tech', label: 'Tech' },
  { value: 'non-tech', label: 'Non-Tech' },
  { value: 'placement', label: 'Placement' },
  { value: 'ai', label: 'AI / ML' },
];

const LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'enrollments', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { courses, pagination, isLoading, filters } = useAppSelector((s) => s.courses);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCoursesThunk(filters));
  }, [filters, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search, page: 1 }));
  };

  const handleCategory = (cat: string) => {
    dispatch(setFilters({ category: cat as never, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary-50 dark:from-primary-950/20 to-transparent py-14">
        <div className="page-container text-center">
          <h1 className="section-title mb-3">Explore Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
            200+ courses across Tech, Non-Tech, AI, and Placement tracks
          </p>
          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, skills, topics..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); dispatch(setFilters({ search: '', page: 1 })); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary px-6 py-3">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="page-container pb-16">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={clsx(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                filters.category === cat.value || (cat.value === '' && !filters.category)
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {pagination && (
              <span>{pagination.total.toLocaleString()} courses found</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => dispatch(setFilters({ level: lvl.value as never, page: 1 }))}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                  filters.level === lvl.value || (lvl.value === '' && !filters.level)
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {lvl.label}
              </button>
            ))}
            <select
              value={filters.sort ?? 'newest'}
              onChange={(e) => dispatch(setFilters({ sort: e.target.value as never, page: 1 }))}
              className="input-field !py-1 !px-3 !text-xs w-auto"
            >
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton aspect-video" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-1/3 rounded" />
                  <div className="skeleton h-4 rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="font-medium text-gray-600 dark:text-gray-400">No courses found</p>
            <p className="text-sm text-gray-400 mt-1">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="mt-10">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(p) => dispatch(setFilters({ page: p }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
