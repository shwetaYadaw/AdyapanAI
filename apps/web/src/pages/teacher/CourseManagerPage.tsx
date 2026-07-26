import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit2, BarChart2 } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Badge from '../../components/common/Badge/Badge';

export default function CourseManagerPage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['teacherCourses'],
    queryFn: async () => { const { data } = await api.get('/courses?instructor=me'); return data.data ?? []; },
  });

  const columns: any[] = [
    { key: 'title', header: 'Course', render: (r: { _id: string; title: string; thumbnail: string }) => (
      <div className="flex items-center gap-3">
        <img src={r.thumbnail} className="w-12 h-8 rounded-lg object-cover" alt="" />
        <span className="font-medium text-sm text-gray-900 dark:text-white">{r.title}</span>
      </div>
    )},
    { key: 'enrollmentCount', header: 'Students' },
    { key: 'rating', header: 'Rating', render: (r: { rating: number }) => <span>⭐ {r.rating?.toFixed(1)}</span> },
    { key: 'status', header: 'Status', render: (r: { isApproved: boolean; isPublished: boolean }) => (
      <Badge variant={r.isApproved ? 'success' : 'warning'}>{r.isApproved ? 'Published' : 'Pending Review'}</Badge>
    )},
    { key: 'actions', header: '', render: (r: { _id: string }) => (
      <div className="flex gap-2">
        <Link to={`/teacher/courses/${r._id}/edit`}><Button variant="ghost" size="xs" leftIcon={<Edit2 className="w-3 h-3" />}>Edit</Button></Link>
        <Link to={`/teacher/courses/${r._id}/analytics`}><Button variant="ghost" size="xs" leftIcon={<BarChart2 className="w-3 h-3" />}>Stats</Button></Link>
      </div>
    )},
  ];

  return (
    <div className="page-wrapper space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">My Courses</h1>
        <Link to="/teacher/courses/new"><Button leftIcon={<Plus className="w-4 h-4" />}>New Course</Button></Link>
      </div>
      <Table columns={columns} data={courses ?? []} keyExtractor={(r: { _id: string }) => r._id} loading={isLoading} emptyMessage="No courses yet. Create your first course." />
    </div>
  );
}
