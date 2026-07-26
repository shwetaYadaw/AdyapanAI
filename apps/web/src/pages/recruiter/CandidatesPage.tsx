import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Avatar from '../../components/common/Avatar/Avatar';
import Badge from '../../components/common/Badge/Badge';
import Pagination from '../../components/common/Pagination/Pagination';

export default function CandidatesPage() {
  const [skills, setSkills] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', skills, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (skills) params.set('skills', skills);
      const { data } = await api.get(`/students/search?${params}`);
      return data;
    },
  });

  return (
    <div className="page-wrapper space-y-5">
      <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Search Candidates</h1>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={skills}
          onChange={(e) => { setSkills(e.target.value); setPage(1); }}
          placeholder="Search by skills, e.g. react,node,python"
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5 space-y-3"><div className="flex gap-3"><div className="skeleton w-12 h-12 rounded-full" /><div className="flex-1 space-y-2"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-1/2 rounded" /></div></div></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data ?? []).map((profile: { _id: string; userId: { firstName: string; lastName: string; email: string; avatar: string }; headline: string; skills: { name: string }[]; location: { city: string; country: string }; availability: string; placementStatus: string }) => (
            <Card key={profile._id} hover padding="md">
              <div className="flex items-start gap-3 mb-3">
                <Avatar src={profile.userId?.avatar} firstName={profile.userId?.firstName} lastName={profile.userId?.lastName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{profile.userId?.firstName} {profile.userId?.lastName}</p>
                  <p className="text-xs text-gray-500 truncate">{profile.headline}</p>
                </div>
                <Badge variant={profile.availability === 'immediate' ? 'success' : 'gray'} dot className="flex-shrink-0">{profile.availability?.replace('_', ' ')}</Badge>
              </div>
              {profile.location?.city && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{profile.location.city}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {profile.skills?.slice(0, 4).map((s: { name: string }) => (
                  <Badge key={s.name} variant="gray" className="text-xs">{s.name}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {data?.pagination && <Pagination page={page} pages={data.pagination.pages} total={data.pagination.total} limit={12} onPageChange={setPage} />}
    </div>
  );
}
