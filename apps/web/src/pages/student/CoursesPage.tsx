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
      <div className="bg-gradient-to-b from-primary-50 dark:from-primary-950/20 to-transparent py-8 xs:py-10 md:py-14">
        <div className="page-container text-center">
          <h1 className="section-title mb-2 xs:mb-3">Explore Courses</h1>
          <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-4 xs:mb-6 md:mb-8 px-2">
            200+ courses across Tech, Non-Tech, AI, and Placement tracks
          </p>
          <form onSubmit={handleSearch} className="max-w-lg mx-auto px-2 xs:px-0">
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-9 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-3 rounded-lg xs:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs xs:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); dispatch(setFilters({ search: '', page: 1 })); }} className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary px-4 xs:px-6 py-2 xs:py-3 !text-xs xs:!text-sm flex-shrink-0">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="page-container pb-12 xs:pb-16">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-4 xs:mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={clsx(
                'px-2.5 xs:px-4 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium transition-all',
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
        <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center justify-between gap-2 xs:gap-3 mb-4 xs:mb-6">
          <div className="flex items-center gap-2 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            {pagination && (
              <span>{pagination.total.toLocaleString()} courses</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => dispatch(setFilters({ level: lvl.value as never, page: 1 }))}
                className={clsx(
                  'px-2 xs:px-3 py-0.5 xs:py-1 rounded-lg text-xs font-medium transition-all',
                  filters.level === lvl.value || (lvl.value === '' && !filters.level)
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <span className="hidden xs:inline">{lvl.label}</span>
                <span className="inline xs:hidden">{lvl.label.split(' ')[0]}</span>
              </button>
            ))}
            <select
              value={filters.sort ?? 'newest'}
              onChange={(e) => dispatch(setFilters({ sort: e.target.value as never, page: 1 }))}
              className="input-field !py-0.5 xs:!py-1 !px-2 xs:!px-3 !text-xs w-auto"
            >
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton aspect-video" />
                <div className="p-3 xs:p-4 space-y-2">
                  <div className="skeleton h-2.5 xs:h-3 w-1/3 rounded" />
                  <div className="skeleton h-3 xs:h-4 rounded" />
                  <div className="skeleton h-3 xs:h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 xs:py-16 md:py-20">
            <Search className="w-10 xs:w-12 h-10 xs:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2 xs:mb-4" />
            <p className="font-medium text-xs xs:text-sm text-gray-600 dark:text-gray-400">No courses found</p>
            <p className="text-xs text-gray-400 mt-1">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 md:gap-5">
            {courses.map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="mt-8 xs:mt-10">
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
