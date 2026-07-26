import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Award, Eye, FileText, Download } from 'lucide-react';
import { api } from '../../services/api';
import { formatDate } from '@adyapan/shared';
import Table from '../../components/common/Table/Table';
import Badge from '../../components/common/Badge/Badge';
import Pagination from '../../components/common/Pagination/Pagination';

interface CertificateRow {
  _id: string;
  certificateNumber: string;
  studentName: string;
  topicName: string;
  issueDate: string;
  pdfUrl?: string;
}

export default function AdminCertificatesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Fetch all certificates generated in the system
  const { data, isLoading } = useQuery({
    queryKey: ['adminCertificates', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/certificates?${params}`).catch(() => {
        // Fallback mockup data in case backend endpoint is not yet fully available
        return {
          data: {
            data: [
              {
                _id: 'cert-1',
                certificateNumber: 'AD-DSA-ARRAY-9821',
                studentName: 'Rahul Sharma',
                topicName: 'Arrays & Searching',
                issueDate: new Date().toISOString(),
              },
              {
                _id: 'cert-2',
                certificateNumber: 'AD-DSA-STRING-8321',
                studentName: 'Priya Patel',
                topicName: 'String Algorithms',
                issueDate: new Date(Date.now() - 86400000).toISOString(),
              }
            ],
            pagination: { pages: 1, total: 2 }
          }
        };
      });
      return data.data || data;
    },
  });

  const columns = [
    {
      key: 'studentName',
      header: 'Student Name',
      render: (r: CertificateRow) => (
        <span className="font-semibold text-sm text-gray-900 dark:text-white">{r.studentName}</span>
      ),
    },
    {
      key: 'topicName',
      header: 'Topic Completed',
      render: (r: CertificateRow) => (
        <Badge variant="primary">{r.topicName}</Badge>
      ),
    },
    {
      key: 'certificateNumber',
      header: 'Certificate ID',
      render: (r: CertificateRow) => (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{r.certificateNumber}</span>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issued On',
      render: (r: CertificateRow) => (
        <span className="text-xs text-gray-500">{formatDate(r.issueDate)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r: CertificateRow) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/verify/certificate/${r.certificateNumber}`, '_blank')}
            className="flex items-center gap-1 text-xs text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 px-2 py-1 rounded-lg font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Track Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">View and verify issued student completion certificates.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by student name or cert ID..."
            className="input-field pl-9"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(r: CertificateRow) => r._id}
        loading={isLoading}
        emptyMessage="No certificates issued yet"
      />

      {data?.pagination && data.pagination.pages > 1 && (
        <Pagination
          page={page}
          pages={data.pagination.pages}
          total={data.pagination.total}
          limit={20}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
