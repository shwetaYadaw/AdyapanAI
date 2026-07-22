import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, DollarSign, ExternalLink, Filter } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Pagination from '../../components/common/Pagination/Pagination';
import Modal from '../../components/common/Modal/Modal';
import { IJob } from '@adyapan/shared';
import { formatRelativeTime } from '@adyapan/shared';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [applyModal, setApplyModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, type, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      const { data } = await api.get(`/jobs?${params}`);
      return data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: (jobId: string) => api.post(`/jobs/${jobId}/apply`, { resumeUrl: '' }),
    onSuccess: () => { toast.success('Application submitted!'); setApplyModal(false); },
    onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message ?? 'Failed to apply'),
  });

  const JOB_TYPES = ['', 'full-time', 'internship', 'remote', 'part-time'];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Jobs & Internships</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">500+ curated opportunities from top companies</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search jobs, skills, companies..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {JOB_TYPES.map((t) => (
            <button
              key={t || 'all'}
              onClick={() => { setType(t); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                type === t ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-4 w-1/2 rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.data ?? []).map((job: IJob, i: number) => (
            <motion.div key={job._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card hover padding="md" className="cursor-pointer" onClick={() => setSelectedJob(job)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm flex-shrink-0">
                    {job.company?.name?.[0] ?? 'C'}
                  </div>
                  <Badge variant={job.type === 'internship' ? 'warning' : job.type === 'remote' ? 'success' : 'primary'} className="capitalize">
                    {job.type}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5">{job.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{job.company?.name}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}{job.isRemote ? ' / Remote' : ''}</span>
                  {job.salaryMin && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{job.salaryMin}–{job.salaryMax}L</span>}
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatRelativeTime(job.createdAt)}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {job.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">{s}</span>
                  ))}
                  {job.skills.length > 3 && <span className="text-xs text-gray-400">+{job.skills.length - 3}</span>}
                </div>

                <Button
                  size="sm"
                  fullWidth
                  onClick={(e) => { e.stopPropagation(); setSelectedJob(job); setApplyModal(true); }}
                >
                  Apply Now
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {data?.pagination && (
        <Pagination
          page={page}
          pages={data.pagination.pages}
          total={data.pagination.total}
          limit={12}
          onPageChange={setPage}
        />
      )}

      {/* Apply modal */}
      <Modal isOpen={applyModal} onClose={() => setApplyModal(false)} title="Apply for Position" size="md">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white">{selectedJob.title}</p>
              <p className="text-sm text-gray-500">{selectedJob.company?.name} • {selectedJob.location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cover Letter (optional)</label>
              <textarea rows={4} className="input-field" placeholder="Why are you a great fit for this role?" />
            </div>
            <p className="text-xs text-gray-400">Your profile resume will be shared automatically with your application.</p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setApplyModal(false)}>Cancel</Button>
              <Button
                fullWidth
                loading={applyMutation.isPending}
                onClick={() => applyMutation.mutate(selectedJob._id)}
              >
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
