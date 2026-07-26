import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import Table from '../../components/common/Table/Table';
import Badge from '../../components/common/Badge/Badge';

export default function StudentsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['teacherStudents'],
    queryFn: async () => {
      const { data } = await api.get('/students/search?limit=50');
      return data.data ?? [];
    },
  });

  const columns: any[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r: { userId: { firstName: string; lastName: string; avatar?: string } }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xs overflow-hidden text-gray-700">
            {r.userId.avatar ? (
              <img src={r.userId.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              `${r.userId.firstName[0]}${r.userId.lastName[0]}`
            )}
          </div>
          <span className="font-medium text-sm text-gray-900 dark:text-white">
            {r.userId.firstName} {r.userId.lastName}
          </span>
        </div>
      ),
    },
    {
      key: 'skills',
      header: 'Skills',
      render: (r: { skills: { name: string }[] }) => (
        <div className="flex flex-wrap gap-1">
          {r.skills?.slice(0, 3).map((s, idx) => (
            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
              {s.name}
            </span>
          ))}
          {r.skills?.length > 3 && <span className="text-xs text-gray-400">+{r.skills.length - 3}</span>}
        </div>
      ),
    },
    {
      key: 'level',
      header: 'XP Level',
      render: (r: { level: number; totalXP: number }) => (
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
          Lvl {r.level ?? 1} ({r.totalXP ?? 0} XP)
        </span>
      ),
    },
    {
      key: 'placementStatus',
      header: 'Placement Status',
      render: (r: { placementStatus: string }) => {
        let variant: any = 'primary';
        if (r.placementStatus === 'placed') variant = 'success';
        if (r.placementStatus === 'seeking') variant = 'warning';
        return <Badge variant={variant}>{r.placementStatus || 'learning'}</Badge>;
      },
    },
  ];

  return (
    <div className="page-wrapper space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Students Directory</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">View and track all student profiles enrolled in the platform.</p>
      </div>
      <Table
        columns={columns}
        data={response ?? []}
        keyExtractor={(r: { _id: string }) => r._id}
        loading={isLoading}
        emptyMessage="No students found in the directory."
      />
    </div>
  );
}
