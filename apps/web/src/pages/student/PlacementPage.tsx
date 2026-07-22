import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Brain, FileText, Code, Trophy, BookOpen, ArrowRight, Play } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { id: 'aptitude', label: 'Aptitude Tests', icon: Brain, color: 'from-blue-500 to-cyan-400', desc: 'Quantitative, Verbal, Logical Reasoning' },
  { id: 'coding', label: 'Coding Challenges', icon: Code, color: 'from-purple-500 to-violet-400', desc: 'DSA, Algorithms, Problem Solving' },
  { id: 'interview', label: 'Mock Interviews', icon: Target, color: 'from-green-500 to-emerald-400', desc: 'AI-powered mock sessions with feedback' },
  { id: 'companies', label: 'Company Roadmaps', icon: Trophy, color: 'from-orange-500 to-amber-400', desc: 'Google, Amazon, Infosys, TCS & more' },
  { id: 'experiences', label: 'Interview Experiences', icon: BookOpen, color: 'from-pink-500 to-rose-400', desc: 'Real experiences shared by placed students' },
  { id: 'resume', label: 'Resume & ATS', icon: FileText, color: 'from-cyan-500 to-teal-400', desc: 'Build, analyze, and optimize your resume' },
];

export default function PlacementPage() {
  const [activeSection, setActiveSection] = useState('companies');

  const { data: companies } = useQuery({
    queryKey: ['placementCompanies'],
    queryFn: async () => { const { data } = await api.get('/placement/companies'); return data.data; },
  });

  const { data: tests } = useQuery({
    queryKey: ['aptitudeTests'],
    queryFn: async () => { const { data } = await api.get('/placement/aptitude/tests'); return data.data; },
  });

  const { data: experiences } = useQuery({
    queryKey: ['interviewExperiences'],
    queryFn: async () => { const { data } = await api.get('/placement/interview-experiences'); return data.data; },
    enabled: activeSection === 'experiences',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Placement Preparation</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Everything you need to crack top company interviews</p>
      </div>

      {/* Section tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {SECTIONS.map((sec) => (
          <motion.button
            key={sec.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection(sec.id)}
            className={`p-3 rounded-2xl border-2 text-left transition-all ${
              activeSection === sec.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center mb-2`}>
              <sec.icon className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs font-semibold ${activeSection === sec.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {sec.label}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Content panels */}
      {activeSection === 'companies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(companies ?? []).map((c: { name: string; tracks: string[]; difficulty: string }, i: number) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card hover padding="md">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-3 text-lg font-bold text-gray-600 dark:text-gray-300">
                  {c.name[0]}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{c.name}</h3>
                <Badge variant={c.difficulty === 'Hard' ? 'danger' : c.difficulty === 'Medium-Hard' ? 'warning' : 'success'} className="mb-2">
                  {c.difficulty}
                </Badge>
                <div className="flex flex-wrap gap-1">
                  {c.tracks.slice(0, 2).map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">{t}</span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeSection === 'aptitude' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tests ?? []).map((test: { _id: string; title: string; category: string; difficulty: string; duration: number; totalMarks: number }, i: number) => (
            <motion.div key={test._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card padding="md">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="primary" className="capitalize">{test.category}</Badge>
                  <Badge variant={test.difficulty === 'hard' ? 'danger' : test.difficulty === 'medium' ? 'warning' : 'success'}>
                    {test.difficulty}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{test.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>⏱ {test.duration} min</span>
                  <span>📊 {test.totalMarks} marks</span>
                </div>
                <Button size="sm" fullWidth leftIcon={<Play className="w-3.5 h-3.5" />}>Start Test</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeSection === 'interview' && (
        <Card padding="lg" animate>
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">AI Mock Interview</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Practice interviews with our AI interviewer. Get real-time feedback on your answers, communication, and confidence.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {['Technical', 'HR & Behavioral', 'Case Study', 'System Design'].map((type) => (
                <div key={type} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  <Target className="w-4 h-4 text-primary-500" /> {type}
                </div>
              ))}
            </div>
            <Link to="/student/ai">
              <Button size="lg" fullWidth rightIcon={<ArrowRight className="w-5 h-5" />}>Start Mock Interview</Button>
            </Link>
          </div>
        </Card>
      )}

      {activeSection === 'experiences' && (
        <div className="space-y-4">
          {(experiences?.data ?? []).map((exp: { _id: string; company: string; role: string; outcome: string; difficulty: string; date: string; rounds: { type: string }[] }, i: number) => (
            <motion.div key={exp._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card padding="md">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.company}</h3>
                    <p className="text-sm text-gray-500">{exp.role}</p>
                  </div>
                  <Badge variant={exp.outcome === 'selected' ? 'success' : exp.outcome === 'rejected' ? 'danger' : 'warning'}>
                    {exp.outcome}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{exp.rounds?.length ?? 0} rounds</span>
                  <span>•</span>
                  <span>{exp.difficulty}</span>
                  <span>•</span>
                  <span>{new Date(exp.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </Card>
            </motion.div>
          ))}
          {(experiences?.data ?? []).length === 0 && (
            <Card padding="lg" className="text-center">
              <p className="text-gray-400">No interview experiences yet. Be the first to share!</p>
              <Button variant="secondary" size="sm" className="mt-3">Share Your Experience</Button>
            </Card>
          )}
        </div>
      )}

      {activeSection === 'resume' && (
        <Card padding="lg" animate>
          <div className="text-center">
            <FileText className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Resume Builder & ATS Analyzer</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Build an ATS-optimized resume and get an AI score with detailed improvement suggestions.
            </p>
            <Link to="/student/resume">
              <Button rightIcon={<ArrowRight className="w-5 h-5" />}>Open Resume Builder</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
