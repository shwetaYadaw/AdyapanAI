import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Table from '../../components/common/Table/Table';
import { CreditCard, TrendingUp, Download, ArrowUpRight } from 'lucide-react';

export default function EarningsPage() {
  // We can query course statistics or generic payments
  const { data: courses } = useQuery({
    queryKey: ['teacherCourses'],
    queryFn: async () => {
      const { data } = await api.get('/courses?instructor=me');
      return data.data ?? [];
    },
  });

  // Calculate generic earnings: let's say sum of price * enrollmentCount for paid courses
  const totalEarnings = courses?.reduce((acc: number, course: { price: number; enrollmentCount: number; isFree: boolean }) => {
    return acc + (course.isFree ? 0 : (course.price ?? 0) * (course.enrollmentCount ?? 0));
  }, 0) ?? 0;

  const mockTransactions = [
    { id: 'TXN-9081', date: '2026-07-14', course: 'Complete React Developer Bootcamp', student: 'Amit Sharma', amount: 2999, status: 'completed' },
    { id: 'TXN-9080', date: '2026-07-12', course: 'Data Science & Machine Learning with Python', student: 'Sneha Patel', amount: 3499, status: 'completed' },
    { id: 'TXN-9079', date: '2026-07-10', course: 'Full Stack Node.js & Express', student: 'Rohan Das', amount: 2499, status: 'completed' },
    { id: 'TXN-9078', date: '2026-07-09', course: 'Complete React Developer Bootcamp', student: 'Priya Nair', amount: 2999, status: 'completed' },
  ];

  const columns = [
    { key: 'id', header: 'Transaction ID' },
    { key: 'date', header: 'Date' },
    { key: 'course', header: 'Course' },
    { key: 'student', header: 'Student' },
    { key: 'amount', header: 'Amount', render: (r: { amount: number }) => <span>₹{r.amount}</span> },
    { key: 'status', header: 'Status', render: (r: { status: string }) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {r.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your course sales, payouts, and revenue metrics.</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700 dark:text-gray-300">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card padding="md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% this month
          </span>
        </Card>

        <Card padding="md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-gray-500">Available Payout</p>
          <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">₹{(totalEarnings * 0.8).toLocaleString('en-IN')}</p>
          <span className="text-xs text-gray-400 block mt-1">80% of net sales (after platform share)</span>
        </Card>

        <Card padding="md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-gray-500">Sales This Month</p>
          <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">₹11,996</p>
          <span className="text-xs text-gray-400 block mt-1">4 transactions completed</span>
        </Card>
      </div>

      <Card padding="md">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <Table
          columns={columns}
          data={mockTransactions}
          keyExtractor={(r: { id: string }) => r.id}
          emptyMessage="No recent transactions found."
        />
      </Card>
    </div>
  );
}
