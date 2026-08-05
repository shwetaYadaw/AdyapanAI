import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserCheck, UserX, UserPlus, Home, GraduationCap, Plus, Eye, Edit2, Award, Trash2 } from 'lucide-react';
import { api } from '../../core/services/api';
import { formatDate, formatRelativeTime } from '@adyapan/shared';
import Table from '../../shared/components/Table/Table';
import Badge from '../../shared/components/Badge/Badge';
import Avatar from '../../shared/components/Avatar/Avatar';
import Pagination from '../../shared/components/Pagination/Pagination';
import toast from 'react-hot-toast';
import AddStudentModal from './components/AddStudentModal';

interface UserRow { _id: string; firstName: string; lastName: string; email: string; role: string; isActive: boolean; createdAt: string; lastLogin?: string; avatar?: string; }

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('student'); // Default to students only
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page, search, role],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      else params.set('role', 'student'); // Only show students by default
      const { data } = await api.get(`/admin/users?${params}`);
      return data;
    },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/admin/users/${id}/status`, { isActive }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('User status updated'); },
  });

  const createStudent = useMutation({
    mutationFn: (data: any) => api.post('/admin/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setIsAddModalOpen(false);
      toast.success('Student created successfully and email sent!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create student');
    }
  });

  const deleteStudent = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Student deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete student');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent.mutate(id);
    }
  };

  const handleNotImplemented = () => {
    toast('Feature coming soon!', { icon: '🚧' });
  };

  const columns = [
    {
      key: 'photo', header: 'Photo',
      render: (r: UserRow) => (
        <Avatar src={r.avatar} firstName={r.firstName} lastName={r.lastName} size="sm" />
      ),
    },
    {
      key: 'name', header: 'Name',
      render: (r: UserRow) => (
        <p className="font-medium text-sm text-gray-900 dark:text-white">{r.firstName} {r.lastName}</p>
      ),
    },
    {
      key: 'email', header: 'Email',
      render: (r: UserRow) => (
        <p className="text-sm text-gray-600 dark:text-gray-400">{r.email}</p>
      ),
    },

    { key: 'role', header: 'Role', render: (r: UserRow) => <Badge variant="primary" className="capitalize">{r.role}</Badge> },
    { key: 'joined', header: 'Joined', render: (r: UserRow) => <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span> },
    { key: 'status', header: 'Status', render: (r: UserRow) => <Badge variant={r.isActive ? 'success' : 'danger'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', header: 'Actions',
      render: (r: UserRow) => (
        <div className="flex items-center gap-1">
          <button onClick={handleNotImplemented} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
          <button onClick={handleNotImplemented} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
          <button onClick={handleNotImplemented} className="p-1.5 text-yellow-500 hover:text-yellow-600 transition-colors" title="Awards"><Award className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(r._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
          
          <button
            onClick={() => toggleStatus.mutate({ id: r._id, isActive: !r.isActive })}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium transition-colors ml-1 ${r.isActive ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'}`}
            title={r.isActive ? 'Deactivate' : 'Activate'}
          >
            {r.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper space-y-6">

      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <GraduationCap className="w-7 h-7 text-[#FFB800]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Student Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Add new learners, edit enrollment statuses, and review active progress report metrics.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#FFB800] hover:bg-[#F0AD00] text-gray-900 font-bold flex items-center gap-2 !py-2.5 !px-5 text-sm rounded-xl transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4 font-bold" />
          Add Student Profile
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              placeholder="Search by name, email..." 
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white" 
            />
          </div>

        </div>

        {/* Table inside the card */}
        <Table columns={columns} data={data?.data ?? []} keyExtractor={(r: UserRow) => r._id} loading={isLoading} emptyMessage="No users found" />
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          {data?.pagination && (
            <Pagination page={page} pages={data.pagination.pages} total={data.pagination.total} limit={20} onPageChange={setPage} />
          )}
        </div>
      </div>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => createStudent.mutate(data)}
        isLoading={createStudent.isPending}
      />
    </div>
  );
}
