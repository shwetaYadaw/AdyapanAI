import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, Trophy, Users, Award, Play } from 'lucide-react';
import { api } from '../../services/api';
import Navbar from '../../components/layout/Navbar/Navbar';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import PageLoader from '../../components/common/Loader/PageLoader';
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

  const handleRegister = (contestId: string, title: string) => {
    setRegisteredContests((prev) => [...prev, contestId]);
    toast.success(`Successfully registered for ${title}!`);
  };

  // Query all active / upcoming contests
  const { data: contests, isLoading } = useQuery<Contest[]>({
    queryKey: ['contestsList'],
    queryFn: async () => {
      try {
        await api.get('/courses?category=placement');
        const { data: qRes } = await api.get('/challenges/questions');
        const allQuestions = qRes?.data ?? [];
        const questionSlugs = allQuestions.map((q: any) => q.slug);

        const getRandomSlugs = (count: number, defaultSlugs: string[]) => {
          if (questionSlugs.length === 0) return defaultSlugs;
          const shuffled = [...questionSlugs].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };

        const c1Questions = getRandomSlugs(2, ['chocolate-distribution-problem-arrays', 'two-sum-arrays']);
        const c2Questions = getRandomSlugs(1, ['power-of-two-bit-manipulation']);

        const weeklyTime = getContestOccurrence(0, 2); // Sunday (0), 2 hours duration
        const monthlyTime = getContestOccurrence(3, 3); // Wednesday (3), 3 hours duration

        return [
          {
            _id: 'c1',
            title: 'ADYAPAN Weekly Speedrun #1',
            description: 'Test your speed and accuracy in our first weekly DSA placement coding speedrun. Win up to 100 XP and platform badges!',
            startTime: weeklyTime.startTime.toISOString(),
            endTime: weeklyTime.endTime.toISOString(),
            questions: c1Questions,
            participants: [1, 2, 3, 4, 5],
          },
          {
            _id: 'c2',
            title: 'Monthly Placement Mega Contest',
            description: 'Comprehensive 3-hour placement exam simulating FAANG and top-MNC coding screens. Solve 5 problems to grab recruiters attention!',
            startTime: monthlyTime.startTime.toISOString(),
            endTime: monthlyTime.endTime.toISOString(),
            questions: c2Questions,
            participants: [],
          }
        ];
      } catch {
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
                        <Button size="xs" variant="secondary" onClick={() => handleRegister(contest._id, contest.title)}>
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
    </div>
  );
}
