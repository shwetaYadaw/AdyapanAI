import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Clock, Briefcase, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Avatar from '../../components/common/Avatar/Avatar';
import Badge from '../../components/common/Badge/Badge';
import Modal from '../../components/common/Modal/Modal';
import toast from 'react-hot-toast';

export default function MentorsPage() {
  const [bookModal, setBookModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<{ _id: string; userId: { firstName: string; lastName: string; avatar: string }; headline: string; expertise: string[]; experience: number; currentCompany: string; currentRole: string; sessionRate: number; rating: number; totalSessions: number } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => { const { data } = await api.get('/mentors?limit=12'); return data.data; },
  });

  const bookSession = useMutation({
    mutationFn: (payload: object) => api.post('/mentors/sessions/book', payload),
    onSuccess: () => { toast.success('Session booked!'); setBookModal(false); },
    onError: () => toast.error('Failed to book session'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Find a Mentor</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">1:1 sessions with industry professionals from top companies</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex gap-3"><div className="skeleton w-12 h-12 rounded-full" /><div className="flex-1 space-y-2"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-1/2 rounded" /></div></div>
            </div>
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <Card padding="lg" className="text-center py-16"><p className="text-gray-400">No mentors available yet.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data ?? []).map((mentor: typeof selectedMentor, i: number) => mentor && (
            <motion.div key={mentor._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card padding="md" className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Avatar src={mentor.userId?.avatar} firstName={mentor.userId?.firstName} lastName={mentor.userId?.lastName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">{mentor.userId?.firstName} {mentor.userId?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{mentor.currentRole} @ {mentor.currentCompany}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{mentor.experience}+ yrs exp</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{mentor.headline}</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise?.slice(0, 3).map((e: string) => (
                    <Badge key={e} variant="primary" className="text-xs">{e}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{mentor.rating?.toFixed(1)}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{mentor.totalSessions} sessions</span>
                  <span className="flex items-center gap-1 ml-auto font-semibold text-gray-700 dark:text-gray-300">₹{mentor.sessionRate}/hr</span>
                </div>
                <Button size="sm" fullWidth onClick={() => { setSelectedMentor(mentor); setBookModal(true); }}>Book Session</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={bookModal} onClose={() => setBookModal(false)} title="Book Mentor Session" size="md">
        {selectedMentor && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar src={selectedMentor.userId?.avatar} firstName={selectedMentor.userId?.firstName} size="md" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedMentor.userId?.firstName} {selectedMentor.userId?.lastName}</p>
                <p className="text-sm text-gray-500">{selectedMentor.currentRole} @ {selectedMentor.currentCompany}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Topic</label>
              <input className="input-field" placeholder="What do you want to discuss?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred Date & Time</label>
              <input type="datetime-local" className="input-field" />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setBookModal(false)}>Cancel</Button>
              <Button fullWidth loading={bookSession.isPending} onClick={() => bookSession.mutate({ mentorId: selectedMentor._id })}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
