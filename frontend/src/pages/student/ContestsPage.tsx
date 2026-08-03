import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, Trophy, Users, Award, Play, X, Timer } from 'lucide-react';
import { api } from '../../core/services/api';
import Navbar from '../../components/layout/Navbar/Navbar';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/Card/Card';
import Badge from '../../shared/components/Badge/Badge';
import PageLoader from '../../shared/components/Loader/PageLoader';
import toast from 'react-hot-toast';

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: string[];
  participants: any[];
}

interface RegForm {
  name: string;
  phone: string;
  college: string;
  email: string;
  language: string;
}

const LANGUAGES = ['C++', 'Java', 'Python', 'JavaScript', 'C'];

// Countdown hook — returns { days, hours, minutes, seconds } until targetDate
function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      started: false,
    };
  };
  const [countdown, setCountdown] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return countdown;
}

function ContestCountdown({ startTime }: { startTime: string }) {
  const { days, hours, minutes, seconds, started } = useCountdown(startTime);
  if (started) return <span className="text-xs font-bold text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" /> Live Now</span>;
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <Timer className="w-3.5 h-3.5 text-primary-500 shrink-0" />
      <span className="text-[10px] text-gray-500 dark:text-gray-400">Starts in</span>
      <div className="flex items-center gap-1">
        {days > 0 && <span className="text-xs font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{days}d</span>}
        <span className="text-xs font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{String(hours).padStart(2,'0')}h</span>
        <span className="text-xs font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{String(minutes).padStart(2,'0')}m</span>
        <span className="text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-950/30 px-1.5 py-0.5 rounded animate-pulse">{String(seconds).padStart(2,'0')}s</span>
      </div>
    </div>
  );
}

function getContestOccurrence(targetDay: number, durationHours: number) {
  const now = new Date();
  const todayAtNine = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
  const currentDay = now.getDay();
  
  let daysDifference = currentDay - targetDay;
  if (daysDifference < 0) {
    daysDifference += 7;
  }
  
  const mostRecentOccurrence = new Date(todayAtNine);
  mostRecentOccurrence.setDate(mostRecentOccurrence.getDate() - daysDifference);
  const endOfMostRecent = new Date(mostRecentOccurrence.getTime() + durationHours * 60 * 60 * 1000);
  
  if (now.getTime() >= mostRecentOccurrence.getTime() && now.getTime() <= endOfMostRecent.getTime()) {
    return { startTime: mostRecentOccurrence, endTime: endOfMostRecent };
  }
  
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }
  
  const upcomingStart = new Date(todayAtNine);
  upcomingStart.setDate(upcomingStart.getDate() + daysToAdd);
  const upcomingEnd = new Date(upcomingStart.getTime() + durationHours * 60 * 60 * 1000);
  
  return { startTime: upcomingStart, endTime: upcomingEnd };
}

export default function ContestsPage() {
  const [registeredContests, setRegisteredContests] = useState<string[]>([]);
  const [modalContest, setModalContest] = useState<Contest | null>(null);
  const [regForm, setRegForm] = useState<RegForm>({ name: '', phone: '', college: '', email: '', language: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenRegister = (contest: Contest) => {
    setRegForm({ name: '', phone: '', college: '', email: '', language: '' });
    setModalContest(contest);
  };

  const handleRegister = async () => {
    const { name, phone, college, email, language } = regForm;
    if (!name.trim() || !phone.trim() || !college.trim() || !email.trim() || !language) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error('Enter a valid email'); return; }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) { toast.error('Enter a valid 10-digit phone number'); return; }

    // Duplicate check — one registration per email and phone per contest
    const storageKey = `contest_registrations`;
    const existing: { contestId: string; email: string; phone: string }[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const contestId = modalContest!._id;
    const normalEmail = email.trim().toLowerCase();
    const normalPhone = phone.replace(/\s/g, '');

    if (existing.some(r => r.contestId === contestId && r.email === normalEmail)) {
      toast.error('This email is already registered for this contest');
      return;
    }
    if (existing.some(r => r.contestId === contestId && r.phone === normalPhone)) {
      toast.error('This phone number is already registered for this contest');
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    // Save to localStorage
    existing.push({ contestId, email: normalEmail, phone: normalPhone });
    localStorage.setItem(storageKey, JSON.stringify(existing));

    setRegisteredContests(prev => [...prev, contestId]);
    toast.success(`Registered for ${modalContest!.title}! 🎉`);
    setModalContest(null);
    setSubmitting(false);
  };

  // Query all active / upcoming contests from backend
  const { data: contests, isLoading } = useQuery<Contest[]>({
    queryKey: ['contestsList'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/contests');
        // Map backend Contest model to frontend interface
        const backendContests = (data.data || []).map((contest: any) => ({
          _id: contest.id,
          title: contest.title,
          description: contest.description,
          startTime: contest.startTime,
          endTime: contest.endTime,
          questions: Array.isArray(contest.questions) ? contest.questions : [],
          participants: [], // Can be extended later to track participants
        }));
        return backendContests;
      } catch (error) {
        console.error('Failed to fetch contests:', error);
        return [];
      }
    }
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <div className="page-container pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
          <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
            <Trophy className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight flex items-center gap-2">
              ADYAPAN Coding Contests
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Participate in timed weekly and monthly speedruns, top the leaderboard, and unlock direct placement opportunities with top recruiters.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contests List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Active & Upcoming Contests</h2>
            
            {(contests ?? []).map((contest) => {
              const start = new Date(contest.startTime);
              const isUpcoming = start.getTime() > Date.now();

              return (
                <Card key={contest._id} padding="md" className="border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={isUpcoming ? 'primary' : 'success'}>
                          {isUpcoming ? 'Upcoming' : 'Live Now'}
                        </Badge>
                        <span className="text-xxs text-gray-400 font-medium flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {contest.participants.length + (registeredContests.includes(contest._id) ? 1 : 0)} registered
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{contest.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{contest.description}</p>
                      {/* Countdown Timer */}
                      <ContestCountdown startTime={contest.startTime} />
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 justify-between border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                      <div className="text-right">
                        <p className="text-xxs text-gray-400">Date & Time</p>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                          {start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xxs text-gray-400">Duration</p>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                          {(() => {
                            const durationMs = new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime();
                            const durationHours = Math.round(durationMs / (1000 * 60 * 60));
                            return `${durationHours} Hour${durationHours > 1 ? 's' : ''}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/60 mt-5 pt-4">
                    <span className="text-xxs text-amber-500 font-bold flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      XP Reward & Badges Eligible
                    </span>

                    {isUpcoming ? (
                      registeredContests.includes(contest._id) ? (
                        <Button size="xs" variant="outline" disabled className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                          Registered ✓
                        </Button>
                      ) : (
                        <Button size="xs" variant="secondary" onClick={() => handleOpenRegister(contest)}>
                          Register Now
                        </Button>
                      )
                    ) : (
                      <Link to={`/student/challenges/${contest.questions[0] || ''}`}>
                        <Button size="xs" leftIcon={<Play className="w-3 h-3" />}>
                          Enter Contest
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Rules & Rewards Sidebar */}
          <div className="space-y-6">
            <Card padding="md" className="border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary-500" />
                Contest Rules
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed list-disc pl-4">
                <li>Strict time limit applies. Once started, you cannot pause the contest.</li>
                <li>All submissions undergo automated checks for syntax, execution time, and memory limits.</li>
                <li>Copying code or using external assistance is monitored. Fair play rules apply.</li>
                <li>Leaderboard rankings are based on total correct problems solved and time taken.</li>
              </ul>
            </Card>

            <Card padding="md" className="border border-gray-100 dark:border-gray-800">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-purple-500" />
                Recruiter Spotlights
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Top 10 leaderboard finishers in Monthly Contests are featured on the ADYAPAN Recruiter Portal with direct fast-track interview pipelines to MNC partners.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {modalContest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-medium">Registering for</p>
                <h3 className="text-white font-display font-bold text-base leading-tight">{modalContest.title}</h3>
              </div>
              <button onClick={() => setModalContest(null)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Priya Sharma' },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: 'e.g. 9876543210' },
                { label: 'College / University', key: 'college', type: 'text', placeholder: 'e.g. VIT Vellore' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'e.g. priya@college.edu' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{label} <span className="text-red-500">*</span></label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={regForm[key as keyof RegForm]}
                    onChange={e => setRegForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred Language <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setRegForm(f => ({ ...f, language: lang }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        regForm.language === lang
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModalContest(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {submitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
