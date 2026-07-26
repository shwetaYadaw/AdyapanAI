import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Avatar from '../../components/common/Avatar/Avatar';
import { formatRelativeTime } from '@adyapan/shared';

export default function ApplicationsPage() {
  const { data } = useQuery({
    queryKey: ['recruiterJobs'],
    queryFn: async () => { const { data } = await api.get('/jobs?limit=20'); return data.data ?? []; },
  });

  return (
    <div className="page-wrapper space-y-5">
      <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Applications</h1>
      <p className="text-gray-500 text-sm">Select a job to view its applications.</p>
      <div className="space-y-3">
        {(data ?? []).map((job: { _id: string; title: string; applicationCount: number; createdAt: string }) => (
          <Card key={job._id} hover padding="md" className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{job.title}</p>
              <p className="text-sm text-gray-500">{job.applicationCount} applications • Posted {formatRelativeTime(job.createdAt)}</p>
            </div>
            <Badge variant="primary">{job.applicationCount}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
