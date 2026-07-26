import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CheckCircle2, Eye, Plus, UserCheck, X, BookOpen, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import Table from '../../components/common/Table/Table';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import { formatDate } from '@adyapan/shared';
import toast from 'react-hot-toast';

interface CourseRow {
  _id: string;
  title: string;
  category: string;
  subCategory?: string;
  level?: string;
  instructor: { firstName: string; lastName: string };
  enrollmentCount: number;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminCoursesPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  
  // Modals state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form states
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  
  const [courseTitle, setCourseTitle] = useState('');
  const [courseShortDesc, setCourseShortDesc] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('tech');
  const [courseSubCategory, setCourseSubCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [coursePrice, setCoursePrice] = useState('0');
  const [courseOriginalPrice, setCourseOriginalPrice] = useState('0');

  // Fetch pending courses
  const { data: pendingCourses, isLoading: loadingPending } = useQuery({
    queryKey: ['pendingCourses'],
    queryFn: async () => {
      const { data } = await api.get('/admin/courses/pending');
      return data.data ?? [];
    },
  });

  // Fetch all courses (for All tab and for the enroll dropdown)
  const { data: allCoursesResponse, isLoading: loadingAll } = useQuery({
    queryKey: ['allCoursesAdmin'],
    queryFn: async () => {
      const { data } = await api.get('/courses?limit=100');
      return data.data ?? [];
    },
  });

  const coursesList = activeTab === 'pending' ? (pendingCourses ?? []) : (allCoursesResponse ?? []);
  const isLoading = activeTab === 'pending' ? loadingPending : loadingAll;

  // Mutation: Approve course
  const approveCourse = useMutation({
    mutationFn: (id: string) => api.put(`/admin/courses/${id}/approve`),
    onSuccess: () => {
      toast.success('Course approved successfully!');
      qc.invalidateQueries({ queryKey: ['pendingCourses'] });
      qc.invalidateQueries({ queryKey: ['allCoursesAdmin'] });
    },
    onError: () => toast.error('Failed to approve course'),
  });

  // Mutation: Enroll student manually
  const enrollStudent = useMutation({
    mutationFn: (payload: { studentEmail: string; courseId: string }) =>
      api.post('/admin/enrollments', payload),
    onSuccess: () => {
      toast.success('Student enrolled successfully!');
      setShowEnrollModal(false);
      setStudentEmail('');
      setSelectedCourseId('');
      qc.invalidateQueries({ queryKey: ['pendingCourses'] });
      qc.invalidateQueries({ queryKey: ['allCoursesAdmin'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message ?? 'Failed to enroll student';
      toast.error(msg);
    },
  });

  // Mutation: Create Course
  const createCourse = useMutation({
    mutationFn: (payload: any) => api.post('/courses', payload),
    onSuccess: () => {
      toast.success('Course created and published successfully!');
      setShowCreateModal(false);
      // Reset form
      setCourseTitle('');
      setCourseShortDesc('');
      setCourseDesc('');
      setCourseCategory('tech');
      setCourseSubCategory('');
      setCourseLevel('beginner');
      setCoursePrice('0');
      setCourseOriginalPrice('0');
      qc.invalidateQueries({ queryKey: ['pendingCourses'] });
      qc.invalidateQueries({ queryKey: ['allCoursesAdmin'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message ?? 'Failed to create course';
      toast.error(msg);
    },
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail || !selectedCourseId) {
      toast.error('Please fill in all fields');
      return;
    }
    enrollStudent.mutate({ studentEmail, courseId: selectedCourseId });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseDesc || !courseShortDesc || !courseSubCategory) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Choose a high-quality category specific background thumbnail from Unsplash
    const thumbnails: Record<string, string> = {
      tech: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      ai: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      placement: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
      'non-tech': 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5f01a?w=800',
    };

    const payload = {
      title: courseTitle,
      shortDescription: courseShortDesc,
      description: courseDesc,
      category: courseCategory,
      subCategory: courseSubCategory,
      level: courseLevel,
      price: Number(coursePrice),
      originalPrice: Number(courseOriginalPrice),
      isFree: Number(coursePrice) === 0,
      thumbnail: thumbnails[courseCategory] ?? thumbnails.tech,
      isPublished: true,
      isApproved: true, // Admin created courses are auto-approved
    };

    createCourse.mutate(payload);
  };

  const columns = [
    {
      key: 'title',
      header: 'Course',
      render: (r: CourseRow) => (
        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{r.title}</p>
          <div className="flex gap-1.5 mt-0.5">
            <span className="text-xxs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 capitalize">{r.category}</span>
            {r.subCategory && <span className="text-xxs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 capitalize">{r.subCategory}</span>}
          </div>
        </div>
      ),
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (r: CourseRow) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {r.instructor ? `${r.instructor.firstName} ${r.instructor.lastName}` : 'System Admin'}
        </span>
      ),
    },
    {
      key: 'enrollmentCount',
      header: 'Students Enrolled',
      render: (r: CourseRow) => <span className="text-sm font-medium">{r.enrollmentCount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: CourseRow) => (
        <Badge variant={r.isApproved ? 'success' : 'warning'}>
          {r.isApproved ? 'Approved' : 'Pending Review'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Submitted On',
      render: (r: CourseRow) => (
        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r: CourseRow) => (
        <div className="flex items-center gap-2">
          {!r.isApproved && (
            <Button
              size="xs"
              variant="secondary"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              loading={approveCourse.isPending}
              onClick={() => approveCourse.mutate(r._id)}
            >
              Approve
            </Button>
          )}
          <Button size="xs" variant="ghost" leftIcon={<Eye className="w-3.5 h-3.5" />}>
            Preview
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Manage Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Review submitted courses, create new ones, and assign students access
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={<UserCheck className="w-4 h-4" />}
            onClick={() => setShowEnrollModal(true)}
          >
            Enroll Student
          </Button>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Add Course
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2.5 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Pending Review ({(pendingCourses ?? []).length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          All Published ({(allCoursesResponse ?? []).length})
        </button>
      </div>

      <Table
        columns={columns}
        data={coursesList}
        keyExtractor={(r: CourseRow) => r._id}
        loading={isLoading}
        emptyMessage={activeTab === 'pending' ? 'No courses pending review' : 'No courses found'}
      />

      {/* ENROLL STUDENT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary-600" />
                Enroll Student manually
              </h2>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4">
              <Input
                label="Student Email Address"
                type="email"
                placeholder="student@example.com"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">-- Choose Course --</option>
                  {(allCoursesResponse ?? []).map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowEnrollModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={enrollStudent.isPending}
                >
                  Enroll Student
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Add New Course
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3 flex gap-2 text-xs text-blue-700 dark:text-blue-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Administrator Action</p>
                  <p>Courses created here by admins are published and approved automatically.</p>
                </div>
              </div>

              <Input
                label="Course Title"
                placeholder="e.g. Master C++ Programming & Data Structures"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />

              <Input
                label="Short Description"
                placeholder="e.g. Master modern C++ with object-oriented programming, STL, templates, memory management, and DSA."
                required
                value={courseShortDesc}
                onChange={(e) => setCourseShortDesc(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Detailed Course Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                  placeholder="Provide a comprehensive syllabus details, outcomes, and topics covered..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                  >
                    <option value="tech">Tech</option>
                    <option value="non-tech">Non-Tech</option>
                    <option value="placement">Placement Track</option>
                    <option value="ai">AI / ML</option>
                  </select>
                </div>

                <Input
                  label="Sub-Category"
                  placeholder="e.g. Backend, Frontend, DSA, Sales"
                  required
                  value={courseSubCategory}
                  onChange={(e) => setCourseSubCategory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Difficulty Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="0 for free"
                  required
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                />

                <Input
                  label="Original Price (₹)"
                  type="number"
                  placeholder="Original price for discount display"
                  value={courseOriginalPrice}
                  onChange={(e) => setCourseOriginalPrice(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createCourse.isPending}
                >
                  Create Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
