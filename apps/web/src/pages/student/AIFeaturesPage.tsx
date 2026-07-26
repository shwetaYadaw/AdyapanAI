import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, FileText, Mic, BookOpen, HelpCircle, Layers, GitBranch,
  ClipboardCheck, Target, TrendingUp, Calendar, Image, Globe,
  Volume2, MessageSquare
} from 'lucide-react';
import AIChat from '../../components/feature/ai/AIChat/AIChat';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { clsx } from 'clsx';

const AI_TOOLS = [
  { id: 'chat', label: 'AI Chatbot', icon: MessageSquare, color: 'from-primary-500 to-blue-400', desc: 'Ask anything — concepts, career advice, doubt clearing' },
  { id: 'tutor', label: 'AI Tutor', icon: Brain, color: 'from-purple-500 to-violet-400', desc: 'Deep explanations with examples tailored to your level' },
  { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle, color: 'from-green-500 to-emerald-400', desc: 'Generate quizzes on any topic with AI' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, color: 'from-yellow-500 to-amber-400', desc: 'Smart flashcards for quick revision' },
  { id: 'notes', label: 'Notes Generator', icon: FileText, color: 'from-cyan-500 to-teal-400', desc: 'Auto-generate structured notes from any lecture' },
  { id: 'mindmap', label: 'Mind Map', icon: GitBranch, color: 'from-pink-500 to-rose-400', desc: 'Visualize any concept as an interactive mind map' },
  { id: 'career', label: 'Career Advisor', icon: TrendingUp, color: 'from-orange-500 to-amber-400', desc: 'AI-powered career recommendations based on your profile' },
  { id: 'skill-gap', label: 'Skill Gap', icon: Target, color: 'from-red-500 to-rose-400', desc: 'Identify missing skills for your dream role' },
  { id: 'study-plan', label: 'Study Planner', icon: Calendar, color: 'from-indigo-500 to-primary-400', desc: 'Personalized study plan with timeline' },
  { id: 'resume', label: 'Resume Analyzer', icon: ClipboardCheck, color: 'from-teal-500 to-cyan-400', desc: 'AI resume analysis with ATS score and suggestions' },
  { id: 'ocr', label: 'OCR', icon: Image, color: 'from-gray-500 to-gray-400', desc: 'Extract text from images and documents' },
  { id: 'translate', label: 'Translate', icon: Globe, color: 'from-blue-500 to-cyan-400', desc: 'Translate course content to 50+ languages' },
  { id: 'tts', label: 'Text to Speech', icon: Volume2, color: 'from-violet-500 to-purple-400', desc: 'Listen to any content read aloud by AI' },
  { id: 'voice', label: 'Voice Assistant', icon: Mic, color: 'from-fuchsia-500 to-pink-400', desc: 'Hands-free learning with voice commands' },
];

export default function AIFeaturesPage() {
  const [activeTool, setActiveTool] = useState('chat');
  const activeMeta = AI_TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="page-wrapper space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">AI Features</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your AI-powered learning and career assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool selector */}
        <div className="lg:col-span-1">
          <div className="card p-3 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
            {AI_TOOLS.map((tool) => (
              <motion.button
                key={tool.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTool(tool.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                  activeTool === tool.id
                    ? 'bg-primary-50 dark:bg-primary-950/40'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                  <tool.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className={clsx('text-sm font-medium truncate', activeTool === tool.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300')}>
                    {tool.label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{tool.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active tool panel */}
        <div className="lg:col-span-2 h-[calc(100vh-200px)]">
          {activeTool === 'chat' || activeTool === 'tutor' ? (
            <AIChat />
          ) : (
            <Card padding="lg" className="h-full flex flex-col items-center justify-center text-center">
              {activeMeta && (
                <>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeMeta.color} flex items-center justify-center mb-4`}>
                    <activeMeta.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                    {activeMeta.label}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-4">{activeMeta.desc}</p>
                  <Badge variant="primary">Coming soon in this view — use the API directly</Badge>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
