import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, BookOpen, ChevronRight, Award, Sparkles, CheckCircle2, Users, Briefcase } from 'lucide-react';
import Card from '../../shared/components/Card/Card';
import Badge from '../../shared/components/Badge/Badge';
import Button from '../../shared/components/Button/Button';
import { api } from '../../core/services/api';

type ExperienceLevel = 'freshers' | 'experienced';

interface TCSQuestion {
  id?: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics?: string[];
  experienceLevel?: ExperienceLevel;
}

interface Topic {
  id: string;
  name: string;
  system: string;
  order: number;
}

export default function PlacementPrepPage() {
  const [activeLevel, setActiveLevel] = useState<ExperienceLevel>('freshers');
  const [activeTab, setActiveTab]     = useState<string>('');
  const [search, setSearch]           = useState('');
  const [difficulty, setDifficulty]   = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Fetch topics dynamically
  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['tcsNqtTopics'],
    queryFn: async () => {
      const { data } = await api.get('/topics?system=tcs-nqt');
      return data.data ?? [];
    },
  });

  const { data: storedQuestions = [], isLoading, isError } = useQuery<TCSQuestion[]>({
    queryKey: ['placementPrepQuestions'],
    queryFn: async () => {
      const { data } = await api.get('/tcs-nqt?limit=500');
      return (data.data ?? []).map((q: any) => ({
        ...q,
        id: q.id ?? q._id,
        // topic is a single string — normalise to lowercase array
        topics: [String(q.topic ?? '').toLowerCase()].filter(Boolean),
        experienceLevel: q.experienceLevel || 'freshers',
      }));
    },
  });

  // Split questions by experience level
  const fresherQuestions    = useMemo(() => storedQuestions.filter(q => (q.experienceLevel || 'freshers') === 'freshers'), [storedQuestions]);
  const experiencedQuestions = useMemo(() => storedQuestions.filter(q => (q.experienceLevel || 'freshers') === 'experienced'), [storedQuestions]);

  const levelQuestions = activeLevel === 'freshers' ? fresherQuestions : experiencedQuestions;

  // Derive active tab key (first topic of current level, or empty)
  const levelTopicNames = useMemo(() => {
    const names = new Set<string>();
    levelQuestions.forEach(q => q.topics?.forEach(t => names.add(t)));
    return names;
  }, [levelQuestions]);

  const filteredTopics = useMemo(
    () => topics.filter(t => levelTopicNames.has(t.name.toLowerCase())).sort((a, b) => a.order - b.order),
    [topics, levelTopicNames]
  );

  const tabKey = activeTab && levelTopicNames.has(activeTab)
    ? activeTab
    : (filteredTopics.length > 0 ? filteredTopics[0].name.toLowerCase() : '');

  // per-tab counts (unfiltered by search/difficulty) within the current level
  const tabCounts = useMemo(() =>
    Object.fromEntries(
      filteredTopics.map(t => [
        t.name.toLowerCase(),
        levelQuestions.filter(q => q.topics?.includes(t.name.toLowerCase())).length
      ])
    ),
    [filteredTopics, levelQuestions]
  );

  // questions for current tab + filters
  const filtered = useMemo(() => {
    if (!tabKey) return [];
    return levelQuestions
      .filter(q => q.topics?.includes(tabKey))
      .filter(q => difficulty === 'all' || q.difficulty?.toLowerCase() === difficulty)
      .filter(q => !search || q.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        ({ easy: 1, medium: 2, hard: 3 }[a.difficulty?.toLowerCase() ?? 'medium'] ?? 2) -
        ({ easy: 1, medium: 2, hard: 3 }[b.difficulty?.toLowerCase() ?? 'medium'] ?? 2)
      );
  }, [tabKey, levelQuestions, difficulty, search]);

  const handleLevelChange = (level: ExperienceLevel) => {
    setActiveLevel(level);
    setActiveTab(''); // reset tab when level changes
    setSearch('');
    setDifficulty('all');
  };

  return (
    <div className="page-wrapper space-y-5">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Code className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Placement Prep Track
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight">
            Placement Prep Questions
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Master the top coding challenges frequently asked in placement assessments by TCS, Infosys, Wipro, Accenture and more.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/70 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-white" /> {storedQuestions.length} Total Problems</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-white" /> {fresherQuestions.length} Fresher Level</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-white" /> {experiencedQuestions.length} Experienced Level</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-white" /> Company Specific Test Cases</span>
          </div>
        </div>
      </div>

      {/* ── Experience Level Tabs ── */}
      <div className="flex gap-3">
        {/* Freshers Tab */}
        <button
          id="tab-freshers"
          onClick={() => handleLevelChange('freshers')}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all border-2 ${
            activeLevel === 'freshers'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <div className={`p-2 rounded-lg ${activeLevel === 'freshers' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <Users className={`w-5 h-5 ${activeLevel === 'freshers' ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold">Freshers Level</div>
            <div className="text-xs opacity-70">{fresherQuestions.length} questions</div>
          </div>
        </button>

        {/* Experienced Tab */}
        <button
          id="tab-experienced"
          onClick={() => handleLevelChange('experienced')}
          className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all border-2 ${
            activeLevel === 'experienced'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-md'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 hover:bg-purple-50/50'
          }`}
        >
          <div className={`p-2 rounded-lg ${activeLevel === 'experienced' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <Briefcase className={`w-5 h-5 ${activeLevel === 'experienced' ? 'text-purple-600' : 'text-gray-500'}`} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold">Experienced Level</div>
            <div className="text-xs opacity-70">{experiencedQuestions.length} questions</div>
          </div>
        </button>
      </div>

      {/* ── Level Info Banner ── */}
      {activeLevel === 'freshers' ? (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Freshers Level</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              These questions cover fundamental topics like Arrays, Strings, Sorting etc. — perfect for students who are just starting their placement preparation.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <Briefcase className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">Experienced Level</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
              Advanced problems covering Dynamic Programming, Graphs, System Design etc. — ideal for students with prior coding experience targeting senior roles.
            </p>
          </div>
        </div>
      )}

      {/* ── Topic Tabs (within selected level) ── */}
      {filteredTopics.length > 0 ? (
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-max min-w-full">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => { setActiveTab(topic.name.toLowerCase()); setSearch(''); setDifficulty('all'); }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  tabKey === topic.name.toLowerCase()
                    ? activeLevel === 'freshers'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {topic.name}
                <span className="ml-1.5 text-xs opacity-60">
                  ({isLoading ? '…' : tabCounts[topic.name.toLowerCase()] ?? 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            No topics with questions available for this level yet. Check back soon!
          </div>
        )
      )}

      {/* ── Search + Difficulty filter bar ── */}
      {filteredTopics.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400"
            />
          </div>

          {/* Difficulty select */}
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Result count */}
          {!isLoading && (
            <div className={`flex items-center px-4 py-2.5 rounded-xl border text-sm font-semibold whitespace-nowrap ${
              activeLevel === 'freshers'
                ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 text-blue-700 dark:text-blue-400'
                : 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-400'
            }`}>
              {filtered.length} / {tabCounts[tabKey] ?? 0} shown
            </div>
          )}
        </div>
      )}

      {/* ── Error / empty states ── */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          Unable to load questions. Make sure the backend is running on port 5000.
        </div>
      )}
      {!isError && !isLoading && filteredTopics.length > 0 && filtered.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          {search || difficulty !== 'all'
            ? 'No questions match your filters. Try adjusting the search or difficulty.'
            : 'No questions found for this category yet.'}
        </div>
      )}

      {/* ── Question grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((q, idx) => (
          <motion.div
            key={q.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(idx * 0.015, 0.3) }}
          >
            <Card padding="md" className={`hover:border-opacity-60 transition-all group flex flex-col justify-between h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ${
              activeLevel === 'freshers' ? 'hover:border-blue-400/40' : 'hover:border-purple-400/40'
            }`}>
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-xs font-bold font-mono ${activeLevel === 'freshers' ? 'text-blue-500/80' : 'text-purple-500/80'}`}>
                    Q{idx + 1}.
                  </span>
                  <Badge
                    variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'}
                    className="capitalize"
                  >
                    {q.difficulty}
                  </Badge>
                </div>
                <h3 className={`font-display font-bold text-gray-900 dark:text-white transition-colors text-sm sm:text-base pr-4 ${
                  activeLevel === 'freshers' ? 'group-hover:text-blue-600' : 'group-hover:text-purple-600'
                }`}>
                  {q.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  activeLevel === 'freshers'
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                }`}>
                  {activeLevel === 'freshers' ? '🎓 Fresher' : '💼 Experienced'}
                </span>
                <Link to={`/student/tcs-nqt/${q.slug}`}>
                  <Button size="sm" variant="primary" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Solve
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
