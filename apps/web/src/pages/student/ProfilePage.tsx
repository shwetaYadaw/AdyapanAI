import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, MapPin, Edit2, Zap, Flame, Award, Target, BookOpen, Code2, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';
import Card from '../../components/common/Card/Card';
import Avatar from '../../components/common/Avatar/Avatar';
import Badge from '../../components/common/Badge/Badge';
import ProgressBar from '../../components/common/ProgressBar/ProgressBar';
import Button from '../../components/common/Button/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ headline: '', city: '', github: '', linkedin: '' });

  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const { data } = await api.get('/students/profile');
      return data.data;
    },
  });

  const { data: certificates } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: async () => { const { data } = await api.get('/certificates/my-certificates'); return data.data; },
  });

  const { data: codingStats } = useQuery({
    queryKey: ['codingStats'],
    queryFn: async () => { const { data } = await api.get('/challenges/stats'); return data.data; },
  });

  const updateProfile = useMutation({
    mutationFn: (payload: object) => api.put('/students/profile', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Profile updated!');
      setEditOpen(false);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const openEdit = () => {
    setForm({
      headline: profile?.headline ?? '',
      city: profile?.location?.city ?? '',
      github: profile?.socialLinks?.github ?? '',
      linkedin: profile?.socialLinks?.linkedin ?? '',
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    updateProfile.mutate({
      headline: form.headline,
      location: { city: form.city },
      socialLinks: { github: form.github, linkedin: form.linkedin },
    });
  };

  const levelProgress = ((profile?.totalXP ?? 0) % 1000) / 10;

  const stats = [
    { label: 'XP Points',       value: profile?.totalXP ?? 0,        icon: Zap,   color: 'from-yellow-400 to-amber-500'  },
    { label: 'Day Streak',      value: profile?.streak ?? 0,          icon: Flame, color: 'from-orange-400 to-red-500'    },
    { label: 'Certificates',    value: certificates?.length ?? 0,     icon: Award, color: 'from-purple-400 to-violet-500' },
    { label: 'Problems Solved', value: codingStats?.solvedCount ?? 0, icon: Code2, color: 'from-blue-400 to-cyan-500'     },
  ];

  return (
    <div className="page-wrapper space-y-5">

      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Award className="w-72 h-72 translate-x-16 -translate-y-16" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size="xl" ring className="ring-white/30 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-white/80 text-sm mt-0.5">{profile?.headline || 'Add your headline'}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/70">
                  {profile?.location?.city && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location.city}</span>
                  )}
                  {profile?.socialLinks?.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
                      <Github className="w-3 h-3" />GitHub
                    </a>
                  )}
                  {profile?.socialLinks?.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
                      <Linkedin className="w-3 h-3" />LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <button onClick={openEdit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/35 text-white text-xs font-semibold transition-all shrink-0">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card padding="md" className="flex flex-col h-full">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Level {profile?.level ?? 1}</p>
            <p className="text-xs text-gray-400 mt-0.5">{Math.round(levelProgress * 10)} / 1000 XP to next level</p>
          </div>
          <Badge variant="primary">{profile?.totalXP ?? 0} XP</Badge>
        </div>
        <ProgressBar value={levelProgress} showPercent size="sm" />
      </Card>

      {/* Skills + Placement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="md" className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-500" /> Skills
            </h3>
            <Button variant="ghost" size="xs">+ Add</Button>
          </div>
          {(profile?.skills ?? []).length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl py-8">
              <p className="text-sm text-gray-400 text-center">No skills added yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: { name: string; level: string }) => (
                <Badge key={s.name} variant={s.level === 'expert' ? 'purple' : s.level === 'advanced' ? 'primary' : 'gray'}>{s.name}</Badge>
              ))}
            </div>
          )}
        </Card>

        <Card padding="md" className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-500" /> Placement Status
            </h3>
            <Badge variant={profile?.placementStatus === 'placed' ? 'success' : profile?.placementStatus === 'in_progress' ? 'warning' : 'gray'} dot>
              {(profile?.placementStatus ?? 'not started').replace('_', ' ')}
            </Badge>
          </div>
          <div className="space-y-3 flex-1">
            {[
              { label: 'Resume Ready',        done: !!profile?.resumeUrl },
              { label: 'Profile Complete',    done: !!(profile?.headline && profile?.skills?.length > 0) },
              { label: 'ATS Score > 70',      done: (profile?.atsScore ?? 0) > 70 },
              { label: 'Mock Interview Done', done: false },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${item.done ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  {item.done ? '✓' : '○'}
                </span>
                <span className={`text-sm ${item.done ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-orange-600 to-amber-500">
                <h3 className="font-display font-bold text-white text-base">Edit Profile</h3>
                <button onClick={() => setEditOpen(false)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                {[
                  { label: 'Headline', key: 'headline', placeholder: 'e.g. Full Stack Developer | DSA Enthusiast', type: 'text' },
                  { label: 'City',     key: 'city',     placeholder: 'e.g. Bengaluru',                              type: 'text' },
                  { label: 'GitHub',   key: 'github',   placeholder: 'https://github.com/username',                 type: 'url'  },
                  { label: 'LinkedIn', key: 'linkedin', placeholder: 'https://linkedin.com/in/username',            type: 'url'  },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                    />
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={updateProfile.isPending}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-all">
                    {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
