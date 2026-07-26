import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Download, Sparkles, User, Briefcase, GraduationCap, Code2, Award } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Badge from '../../components/common/Badge/Badge';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Award },
];

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<{ atsScore: number; overallRating: number; strengths: string[]; weaknesses: string[]; suggestions: { section: string; recommendation: string; priority: string }[]; keywordsMissing: string[] } | null>(null);
  const [resumeText, setResumeText] = useState('');

  const { data: resumeData } = useQuery({
    queryKey: ['resumeProfile'],
    queryFn: async () => { const { data } = await api.get('/resume/profile'); return data.data; },
  });

  const saveResume = useMutation({
    mutationFn: (data: object) => api.put('/resume/profile', { name: 'Resume v1', data }),
    onSuccess: () => toast.success('Resume saved'),
  });

  const analyzeResume = async () => {
    if (!resumeText.trim()) { toast.error('Paste your resume text to analyze'); return; }
    setIsAnalyzing(true);
    try {
      const { data } = await api.post('/resume/analyze', { resumeText });
      setAtsResult(data.data);
    } catch { toast.error('Analysis failed. Please try again.'); }
    finally { setIsAnalyzing(false); }
  };

  const scoreColor = (score: number) => score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = (score: number) => score >= 80 ? 'from-green-500 to-emerald-400' : score >= 60 ? 'from-yellow-500 to-amber-400' : 'from-red-500 to-rose-400';

  return (
    <div className="page-wrapper space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Resume Builder</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Build an ATS-optimized resume with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} size="sm">Download PDF</Button>
          <Button leftIcon={<Save className="w-4 h-4" />} size="sm" onClick={() => saveResume.mutate({})}>Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card padding="md" className="space-y-4">
                {activeTab === 'personal' && (
                  <>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="Rahul" />
                      <Input label="Last Name" placeholder="Sharma" />
                    </div>
                    <Input label="Professional Headline" placeholder="Full Stack Developer | React | Node.js" />
                    <Input label="Email" type="email" placeholder="rahul@example.com" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Phone" placeholder="+91 9876543210" />
                      <Input label="Location" placeholder="Bangalore, India" />
                    </div>
                    <Input label="LinkedIn URL" placeholder="linkedin.com/in/rahulsharma" />
                    <Input label="GitHub URL" placeholder="github.com/rahulsharma" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Professional Summary</label>
                      <textarea
                        rows={4}
                        className="input-field"
                        placeholder="Write a 3-4 line summary about your skills, experience, and career goals..."
                      />
                    </div>
                  </>
                )}
                {activeTab === 'skills' && (
                  <>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
                    <p className="text-sm text-gray-500">Add skills separated by commas. Include both technical and soft skills.</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Technical Skills</label>
                      <textarea className="input-field" rows={3} placeholder="React, Node.js, Python, MongoDB, AWS, Docker, Git..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Soft Skills</label>
                      <textarea className="input-field" rows={2} placeholder="Team Leadership, Problem Solving, Communication..." />
                    </div>
                  </>
                )}
                {(activeTab === 'experience' || activeTab === 'education' || activeTab === 'projects') && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                      Fill in your {activeTab} details to build a complete resume.
                    </p>
                    <Button variant="secondary" size="sm">+ Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ATS Analyzer */}
        <div className="space-y-4">
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI ATS Analyzer</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Paste your resume text to get an ATS score and AI improvement suggestions.
            </p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={6}
              className="input-field text-xs"
              placeholder="Paste your resume text here..."
            />
            <Button onClick={analyzeResume} loading={isAnalyzing} fullWidth size="sm" className="mt-3"
              leftIcon={<Sparkles className="w-4 h-4" />}>
              Analyze Resume
            </Button>
          </Card>

          {atsResult && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Card padding="md" className="space-y-4">
                {/* Score */}
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${scoreBg(atsResult.atsScore)} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                    <span className="text-white font-display font-bold text-2xl">{atsResult.atsScore}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">ATS Score</p>
                  <p className="text-xs text-gray-400">Out of 100</p>
                </div>

                {/* Strengths */}
                {atsResult.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1.5">✅ Strengths</p>
                    {atsResult.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-gray-600 dark:text-gray-400 mb-1">• {s}</p>
                    ))}
                  </div>
                )}

                {/* Missing keywords */}
                {atsResult.keywordsMissing.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1.5">⚠ Missing Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.keywordsMissing.map((k) => (
                        <Badge key={k} variant="danger" className="text-xs">{k}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {atsResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">💡 Suggestions</p>
                    {atsResult.suggestions.slice(0, 3).map((s, i) => (
                      <div key={i} className="mb-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.section}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
