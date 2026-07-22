import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Table from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import { formatDate, formatPrice } from '@adyapan/shared';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

interface PaymentRow {
  _id: string;
  userId: { firstName?: string; lastName?: string; email?: string };
  courseId?: { title?: string };
  amount: number;
  currency: string;
  gateway: string;
  status: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);

  const { data: revenueChart } = useQuery({
    queryKey: ['revenueChart'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics/revenue?days=30');
      return data.data ?? [];
    },
  });

  const { data: overview } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics/overview');
      return data.data;
    },
  });

  const columns = [
    {
      key: 'user',
      header: 'Student',
      render: (r: PaymentRow) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {r.userId?.firstName} {r.userId?.lastName}
          </p>
          <p className="text-xs text-gray-400">{r.userId?.email}</p>
        </div>
      ),
    },
    {
      key: 'course',
      header: 'Course',
      render: (r: PaymentRow) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {r.courseId?.title ?? '—'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (r: PaymentRow) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatPrice(r.amount, r.currency)}
        </span>
      ),
    },
    {
      key: 'gateway',
      header: 'Gateway',
      render: (r: PaymentRow) => (
        <Badge variant={r.gateway === 'razorpay' ? 'primary' : 'purple'} className="capitalize">
          {r.gateway}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: PaymentRow) => (
        <Badge
          variant={
            r.status === 'completed' ? 'success' :
            r.status === 'failed' ? 'danger' :
            r.status === 'refunded' ? 'warning' : 'gray'
          }
          dot
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (r: PaymentRow) => (
        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Payments</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: formatPrice(overview?.totalRevenue ?? 0),
            icon: DollarSign,
            color: 'from-green-500 to-emerald-400',
          },
          {
            label: 'This Month',
            value: formatPrice(revenueChart?.reduce((a: number, d: { revenue: number }) => a + d.revenue, 0) ?? 0),
            icon: TrendingUp,
            color: 'from-primary-500 to-blue-400',
          },
          {
            label: 'Total Transactions',
            value: overview?.totalEnrollments ?? 0,
            icon: CreditCard,
            color: 'from-purple-500 to-violet-400',
          },
        ].map((s) => (
          <Card key={s.label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="font-display font-bold text-xl text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      {revenueChart && revenueChart.length > 0 && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend (30 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Transactions table placeholder */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <Table
          columns={columns}
          data={[]}
          keyExtractor={(r: PaymentRow) => r._id}
          emptyMessage="No transactions to display"
        />
      </Card>
    </div>
  );
}
