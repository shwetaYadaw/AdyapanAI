import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, MapPin, Edit2, Zap, Flame, Award } from 'lucide-react';
import { api } from '../../services/api';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';
import Card from '../../components/common/Card/Card';
import Avatar from '../../components/common/Avatar/Avatar';
import Badge from '../../components/common/Badge/Badge';
import ProgressBar from '../../components/common/ProgressBar/ProgressBar';
import Button from '../../components/common/Button/Button';

export default function ProfilePage() {
  const user = useAppSelector(selectUser);

  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => { const { data } = await api.get('/students/profile'); return data.data; },
  });

  const { data: certificates } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: async () => { const { data } = await api.get('/certificates/my-certificates'); return data.data; },
  });

  const levelProgress = ((profile?.totalXP ?? 0) % 1000) / 10;

  return (
    <div className="page-wrapper">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Award className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size="xl" ring className="ring-white/30" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display font-bold text-2xl text-white">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-white/95">{profile?.headline ?? 'Add your headline'}</p>
              </div>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/35 text-white border-0" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>Edit Profile</Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/80">
              {profile?.location?.city && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-white" />{profile.location.city}, {profile.location.country}</span>
              )}
              {profile?.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
                  <Github className="w-3.5 h-3.5 text-white" />GitHub
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
                  <Linkedin className="w-3.5 h-3.5 text-white" />LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'XP Points', value: profile?.totalXP ?? 0, icon: Zap, color: 'from-yellow-500 to-amber-400' },
          { label: 'Day Streak', value: profile?.streak ?? 0, icon: Flame, color: 'from-orange-500 to-red-400' },
          { label: 'Certificates', value: certificates?.length ?? 0, icon: Award, color: 'from-purple-500 to-violet-400' },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Level */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Level {profile?.level ?? 1}</p>
          <Badge variant="purple">{profile?.totalXP ?? 0} XP</Badge>
        </div>
        <ProgressBar value={levelProgress} showPercent label={`${Math.round(levelProgress * 10)} / 1000 XP to next level`} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
            <Button variant="ghost" size="xs">+ Add</Button>
          </div>
          {(profile?.skills ?? []).length === 0 ? (
            <p className="text-sm text-gray-400">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: { name: string; level: string }) => (
                <Badge key={s.name} variant={s.level === 'expert' ? 'purple' : s.level === 'advanced' ? 'primary' : 'gray'}>
                  {s.name}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Placement */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Placement Status</h3>
            <Badge variant={profile?.placementStatus === 'placed' ? 'success' : profile?.placementStatus === 'in_progress' ? 'warning' : 'gray'} dot>
              {(profile?.placementStatus ?? 'not_started').replace('_', ' ')}
            </Badge>
          </div>
          {profile?.availability && (
            <p className="text-sm text-gray-500">Availability: <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{profile.availability.replace('_', ' ')}</span></p>
          )}
          {profile?.targetCompanies?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1.5">Target Companies</p>
              <div className="flex flex-wrap gap-1">{profile.targetCompanies.map((c: string) => <Badge key={c} variant="gray">{c}</Badge>)}</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
