import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ChevronRight, Briefcase, CheckCircle2 } from 'lucide-react';
import { api } from '../../core/services/api';
import toast from 'react-hot-toast';
import PageLoader from '../../shared/components/Loader/PageLoader';

interface Course {
  id: string;
  name: string;
  category: string;
  languages: string[];
  technologies: string[];
  description: string;
}

export default function CourseSelectionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const { data: courses, isLoading } = useQuery<Record<string, Course[]>>({
    queryKey: ['courses-grouped'],
    queryFn: async () => {
      const { data } = await api.get('/courses?grouped=true');
      return data.data;
    },
  });

  const selectMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return api.put('/courses/select', { courseId });
    },
    onSuccess: () => {
      toast.success('Course selected! Your dashboard is now personalized.', { position: 'top-center' });
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      navigate('/student/dashboard', { replace: true });
    },
    onError: () => {
      toast.error('Failed to select course', { position: 'top-center' });
    },
  });

  const handleSelect = () => {
    if (selectedCourse) {
      selectMutation.mutate(selectedCourse);
    }
  };

  if (isLoading) return <PageLoader />;

  // Filter courses by search
  const filteredCategories = courses ? Object.entries(courses).reduce((acc, [category, courseList]) => {
    const filtered = courseList.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.languages.some(l => l.toLowerCase().includes(search.toLowerCase())) ||
      c.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    if (filtered.length > 0) acc[category] = filtered;
    return acc;
  }, {} as Record<string, Course[]>) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Career Path</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Select your target job role. We'll personalize your coding arena and placement prep with relevant languages and questions.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, language, or technology..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>

        {/* Course Grid */}
        <div className="space-y-8">
          {Object.entries(filteredCategories).map(([category, courseList]) => (
            <div key={category}>
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseList.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                      selectedCourse === course.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    {selectedCourse === course.id && (
                      <CheckCircle2 size={20} className="absolute top-3 right-3 text-orange-500" />
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{course.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{course.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {course.languages.map((lang) => (
                        <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Bottom Bar */}
        {selectedCourse && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Selected: {courses && Object.values(courses).flat().find(c => c.id === selectedCourse)?.name}
                </p>
                <p className="text-xs text-gray-500">You can change this anytime from your profile</p>
              </div>
              <button
                onClick={handleSelect}
                disabled={selectMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-semibold text-sm disabled:opacity-50"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
