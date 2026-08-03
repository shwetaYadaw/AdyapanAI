import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserCheck, UserX } from 'lucide-react';
import { api } from '../../core/services/api';
import { formatDate, formatRelativeTime } from '@adyapan/shared';
import Table from '../../shared/components/Table/Table';
import Badge from '../../shared/components/Badge/Badge';
import Avatar from '../../shared/components/Avatar/Avatar';
import Pagination from '../../shared/components/Pagination/Pagination';
import toast from 'react-hot-toast';

interface UserRow { _id: string; firstName: string; lastName: string; email: string; role: string; isActive: boolean; createdAt: string; lastLogin?: string; avatar?: string; }

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('student'); // Default to students only
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

  const columns = [
    {
      key: 'user', header: 'User',
      render: (r: UserRow) => (
        <div className="flex items-center gap-3">
          <Avatar src={r.avatar} firstName={r.firstName} lastName={r.lastName} size="sm" />
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-white">{r.firstName} {r.lastName}</p>
            <p className="text-xs text-gray-400">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (r: UserRow) => <Badge variant="primary" className="capitalize">{r.role}</Badge> },
    { key: 'status', header: 'Status', render: (r: UserRow) => <Badge variant={r.isActive ? 'success' : 'danger'} dot>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'joined', header: 'Joined', render: (r: UserRow) => <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span> },
    { key: 'lastLogin', header: 'Last Login', render: (r: UserRow) => <span className="text-xs text-gray-500">{r.lastLogin ? formatRelativeTime(r.lastLogin) : 'Never'}</span> },
    {
      key: 'actions', header: 'Actions',
      render: (r: UserRow) => (
        <button
          onClick={() => toggleStatus.mutate({ id: r._id, isActive: !r.isActive })}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${r.isActive ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'}`}
        >
          {r.isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
        </button>
      ),
    },
  ];

  return (
    <div className="page-wrapper space-y-5">
      <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Manage Users</h1>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="input-field pl-9" />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="student">Students Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>
      <Table columns={columns} data={data?.data ?? []} keyExtractor={(r: UserRow) => r._id} loading={isLoading} emptyMessage="No users found" />
      {data?.pagination && (
        <Pagination page={page} pages={data.pagination.pages} total={data.pagination.total} limit={20} onPageChange={setPage} />
      )}
    </div>
  );
}
