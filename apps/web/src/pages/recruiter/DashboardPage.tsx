import { useQuery } from '@tanstack/react-query';
import { Briefcase, Users, Calendar, CheckCircle2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';

export default function RecruiterDashboard() {
  const user = useAppSelector(selectUser);
  const { data: jobs } = useQuery({ queryKey: ['recruiterJobs'], queryFn: async () => { const { data } = await api.get('/jobs?limit=5'); return data.data; } });

  const stats = [
    { label: 'Active Jobs', value: 0, icon: Briefcase, color: 'from-primary-500 to-blue-400' },
    { label: 'Applications', value: 0, icon: Users, color: 'from-purple-500 to-violet-400' },
    { label: 'Interviews Scheduled', value: 0, icon: Calendar, color: 'from-green-500 to-emerald-400' },
    { label: 'Offers Extended', value: 0, icon: CheckCircle2, color: 'from-orange-500 to-amber-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome, {user?.firstName}</p>
        </div>
        <Link to="/recruiter/jobs"><Button leftIcon={<Plus className="w-4 h-4" />}>Post a Job</Button></Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="md">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white" /></div>
            <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
