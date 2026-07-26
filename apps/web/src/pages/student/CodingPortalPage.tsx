import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft, Play, Send, BrainCircuit, BookOpen, Clock, ShieldAlert, Sparkles,
  ThumbsUp, ThumbsDown, MessageSquare, Star, Share2, HelpCircle, Code, FileText, CheckCircle,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import PageLoader from '../../components/common/Loader/PageLoader';
import toast from 'react-hot-toast';

function formatInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-red-500 font-mono text-xs font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = '';

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        renderedElements.push(
          <pre key={`code-${idx}`} className="p-4 rounded-xl bg-gray-950 text-gray-100 font-mono text-xs overflow-x-auto border border-gray-800 my-3">
            <code className={codeLanguage ? `language-${codeLanguage}` : ''}>
              {codeBlockLines.join('\n')}
            </code>
          </pre>
        );
        codeBlockLines = [];
        codeLanguage = '';
      } else {
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    if (!trimmed) {
      renderedElements.push(<div key={idx} className="h-2" />);
      continue;
    }

    if (trimmed.startsWith('---')) {
      renderedElements.push(<hr key={idx} className="border-gray-200 dark:border-gray-800 my-4" />);
      continue;
    }

    if (trimmed.startsWith('![') && trimmed.endsWith(')')) {
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        renderedElements.push(
          <img key={idx} src={imgMatch[2]} alt={imgMatch[1]} className="max-w-full h-auto rounded-xl my-4 border border-gray-200 dark:border-gray-800" />
        );
        continue;
      }
    }

    if (trimmed.startsWith('# ')) {
      renderedElements.push(<h1 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-5 mb-2">{formatInline(trimmed.slice(2))}</h1>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      renderedElements.push(<h2 key={idx} className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">{formatInline(trimmed.slice(3))}</h2>);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      renderedElements.push(<h3 key={idx} className="text-sm font-bold text-gray-900 dark:text-white mt-3 mb-1">{formatInline(trimmed.slice(4))}</h3>);
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      renderedElements.push(
        <li key={idx} className="ml-4 list-disc text-gray-600 dark:text-gray-400">
          {formatInline(trimmed.slice(2))}
        </li>
      );
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      renderedElements.push(
        <li key={idx} className="ml-4 list-decimal text-gray-600 dark:text-gray-400">
          {formatInline(match ? match[2] : trimmed)}
        </li>
      );
      continue;
    }

    renderedElements.push(
      <p key={idx} className="text-gray-600 dark:text-gray-400">
        {formatInline(line)}
      </p>
    );
  }

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {renderedElements}
    </div>
  );
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900/50 mb-3 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all select-none"
      >
        <span>{title}</span>
        <span className="text-[10px] text-gray-400">{isOpen ? 'â–² Close' : 'â–¼ Expand'}</span>
      </button>
      {isOpen && <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">{children}</div>}
    </div>
  );
}

interface Question {
  id?: string;
  _id: string;
  title: string;
  statement: string;
  difficulty: string;
  topics: string[];
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  templates: { language: string; code: string }[];
  xpReward: number;
}

export default function CodingPortalPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Left Panel tabs
  const [leftTab, setLeftTab] = useState<'description' | 'ai-mentor'>('description');
  
  // Code editor states
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  
  // Console / Test Execution states
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleSize, setConsoleSize] = useState<'small' | 'medium' | 'large'>('small');
  const [consoleHeight, setConsoleHeight] = useState(180);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [unlockedBadgeData, setUnlockedBadgeData] = useState<any>(null);
  const editorRef = useRef<any>(null);

  // Responsive mobile views
  const [mobileTab, setMobileTab] = useState<'description' | 'code' | 'console'>('description');

  // AI Mentor Prompt type
  const [aiPromptType, setAiPromptType] = useState<'explain' | 'hint' | 'complexity' | 'review'>('explain');
  const [aiMentorResponse, setAiMentorResponse] = useState('');

  // Fetch question details
  const { data: question, isLoading } = useQuery<Question>({
    queryKey: ['codingQuestionDetail', slug],
    queryFn: async () => {
      const { data } = await api.get(`/challenges/questions/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });

  // Console panel tabs
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'result'>('testcase');
  const [customTestcaseInput, setCustomTestcaseInput] = useState('');

  // Set default code template when question or language changes
  useEffect(() => {
    if (question) {
      const template = question.templates.find(t => t.language === selectedLanguage);
      if (template) {
        setEditorCode(template.code);
      }
      if (question.sampleInput) {
        setCustomTestcaseInput(question.sampleInput);
      }
    }
  }, [question, selectedLanguage]);

  // Handle vertical resize of the console
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newHeight = window.innerHeight - e.clientY - 48; // subtract bottom action bar height
      if (newHeight >= 80 && newHeight <= window.innerHeight * 0.7) {
        setConsoleHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Adjust height preset options - smaller on mobile
  useEffect(() => {
    const isSmallScreen = window.innerHeight < 800;
    if (consoleSize === 'small') setConsoleHeight(isSmallScreen ? 100 : 120);
    else if (consoleSize === 'medium') setConsoleHeight(isSmallScreen ? 150 : 200);
    else if (consoleSize === 'large') setConsoleHeight(isSmallScreen ? 250 : 320);
  }, [consoleSize]);

  // Mutation: Run Code (sample tests)
  const runCodeMutation = useMutation({
    mutationFn: (payload: { code: string; language: string; input: string }) =>
      api.post(`/challenges/questions/${question?.id || question?._id}/run`, payload),
    onSuccess: (res) => {
      setExecutionOutput(res.data.data);
      setConsoleOpen(true);
      setConsoleTab('result');
      if (res.data.data.passed) {
        toast.success('Sample test cases passed!');
      } else {
        toast.error('Sample test cases failed.');
      }
    },
    onError: () => toast.error('Failed to run code'),
  });

  // Mutation: Submit Code (all tests)
  const submitCodeMutation = useMutation({
    mutationFn: (payload: { code: string; language: string }) =>
      api.post(`/challenges/questions/${question?.id || question?._id}/submit`, payload),
    onSuccess: (res) => {
      const payload = res.data.data;
      setExecutionOutput(payload);
      setConsoleOpen(true);
      setConsoleTab('result');
      if (payload.status === 'accepted') {
        toast.success(`ACCEPTED! Solution passed all test cases. +${question?.xpReward} XP!`);
        queryClient.invalidateQueries({ queryKey: ['codingStats'] });
        queryClient.invalidateQueries({ queryKey: ['codingQuestions'] });
        if (payload.unlockedBadge) {
          setUnlockedBadgeData(payload.unlockedBadge);
        }
        setShowBadgeModal(true);
      } else {
        toast.error(`Solution Rejected: ${payload.status.toUpperCase().replace(/_/g, ' ')}`);
      }
    },
    onError: () => toast.error('Failed to submit code'),
  });

  // Mutation: AI Mentor Prompt
  const askAiMentor = useMutation({
    mutationFn: (payload: { questionSlug: string; code: string; requestType: string }) =>
      api.post('/challenges/ai-mentor', payload),
    onSuccess: (res) => {
      setAiMentorResponse(res.data.data.response);
    },
    onError: () => {
      setAiMentorResponse('AI Mentor is temporarily offline. Please check your network and try again.');
    },
  });

  if (isLoading) return <PageLoader />;
  if (!question) return <div className="p-8 text-center text-gray-500">Problem not found.</div>;

  const handleRunCode = () => {
    runCodeMutation.mutate({
      code: editorCode,
      language: selectedLanguage,
      input: customTestcaseInput,
    });
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    submitCodeMutation.mutate(
      { code: editorCode, language: selectedLanguage },
      { onSettled: () => setIsSubmitting(false) }
    );
  };

  const handleResetCode = () => {
    if (question) {
      const template = question.templates.find(t => t.language === selectedLanguage);
      if (template) {
        setEditorCode(template.code);
        toast.success('Code reset to default template!');
      }
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      toast.success('Code formatted!');
    } else {
      toast.error('Editor is still loading...');
    }
  };

  const handleAskMentor = (type: 'explain' | 'hint' | 'complexity' | 'review') => {
    setAiPromptType(type);
    setLeftTab('ai-mentor');
    setAiMentorResponse('AI Mentor is compiling thoughts... âš¡');
    askAiMentor.mutate({
      questionSlug: slug!,
      code: editorCode,
      requestType: type
    });
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans overflow-hidden select-none">
      {/* Immersive Top Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between shadow-xs z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all border border-gray-200 dark:border-gray-700"
            title="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                DSA Arena
              </span>
              <h1 className="font-display font-bold text-sm text-gray-950 dark:text-white leading-none">{question.title}</h1>
            </div>
          </div>
        </div>

        {/* Mobile Tab Selectors (hidden on desktop) */}
        <div className="flex lg:hidden bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg text-xxs font-semibold">
          <button
            onClick={() => setMobileTab('description')}
            className={`px-2.5 py-1 rounded ${mobileTab === 'description' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
          >
            Description
          </button>
          <button
            onClick={() => setMobileTab('code')}
            className={`px-2.5 py-1 rounded ${mobileTab === 'code' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
          >
            Code
          </button>
          <button
            onClick={() => setMobileTab('console')}
            className={`px-2.5 py-1 rounded ${mobileTab === 'console' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
          >
            Console
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Indicators */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-[10px] font-bold border border-green-100 dark:border-green-950/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Compiler Ready</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-gray-100 dark:bg-gray-950">
        {/* Left Panel: Problem details / AI Mentor */}
        <div className={`w-full lg:w-[45%] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full overflow-hidden ${mobileTab === 'description' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Left panel tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 px-4 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
            <button
              onClick={() => setLeftTab('description')}
              className={`px-3 py-2 font-semibold text-xxs border-b-2 flex items-center gap-1.5 transition-all ${
                leftTab === 'description'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Description
            </button>
            <button
              onClick={() => handleAskMentor('explain')}
              className={`px-3 py-2 font-semibold text-xxs border-b-2 flex items-center gap-1.5 transition-all ${
                leftTab === 'ai-mentor'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              AI Code Mentor
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin min-h-0">
            {leftTab === 'description' ? (
              <div className="space-y-4">
                {/* Title & Metadata row */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{question.title}</h2>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      question.difficulty === 'hard'
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                        : question.difficulty === 'medium'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400'
                    }`}>
                      {question.difficulty || 'Easy'}
                    </span>

                  </div>
                </div>

                {/* Main Problem statement */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
                  {(() => {
                    const sections = question.statement.split(/(?=##\s)/g);
                    const core: string[] = [];
                    const collapsible: { title: string; content: string }[] = [];

                    sections.forEach(sec => {
                      const lines = sec.trim().split('\n');
                      const headerLine = lines[0] || '';
                      if (headerLine.startsWith('## ')) {
                        const title = headerLine.replace('## ', '').trim();
                        const content = lines.slice(1).join('\n');
                        const cleanTitle = title.replace(/[^\w\s]/g, '').trim().toLowerCase();
                        
                        const isCollapsible = cleanTitle.includes('complexity') ||
                                              cleanTitle.includes('hints') ||
                                              cleanTitle.includes('editorial') ||
                                              cleanTitle.includes('solutions') ||
                                              cleanTitle.includes('insights') ||
                                              cleanTitle.includes('mentor');
                                              
                        if (isCollapsible) {
                          collapsible.push({ title, content });
                        } else {
                          core.push(sec);
                        }
                      } else {
                        core.push(sec);
                      }
                    });

                    return (
                      <>
                        <MarkdownRenderer text={core.join('\n')} />
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                          {collapsible.map((sec, idx) => (
                            <CollapsibleSection key={idx} title={sec.title}>
                              <MarkdownRenderer text={sec.content} />
                            </CollapsibleSection>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Bottom Stats row */}
                <div className="border-t border-gray-100 dark:border-gray-850 pt-3 flex flex-wrap items-center gap-y-2 justify-between text-gray-400 text-xxs">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-white transition-all">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>223</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-white transition-all">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>10</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-white transition-all">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>126</span>
                    </button>
                    <button className="hover:text-amber-500 transition-all">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-gray-600 dark:hover:text-white transition-all">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>{(() => {
                      const base = (slug || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                      return (800 + (base % 4200)).toLocaleString();
                    })()} Online</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'explain', label: '📖 Explain', desc: 'Break down the problem' },
                    { type: 'hint', label: '💡 Hint', desc: 'Guided nudge toward solution' },
                    { type: 'complexity', label: '⏱️ Complexity', desc: 'Analyse your code complexity' },
                    { type: 'review', label: '🔍 Review', desc: 'Full code review + fix' },
                  ].map(({ type, label, desc }) => (
                    <button
                      key={type}
                      onClick={() => handleAskMentor(type as any)}
                      className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                        aiPromptType === type
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`text-xs font-bold ${aiPromptType === type ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {label}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-900/20 rounded-xl p-3.5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                    <Sparkles className={`w-3.5 h-3.5 ${askAiMentor.isPending ? 'animate-spin' : ''}`} />
                    {aiPromptType === 'explain' ? '📖 PROBLEM EXPLANATION'
                      : aiPromptType === 'hint' ? '💡 HINTS'
                      : aiPromptType === 'complexity' ? '⏱️ COMPLEXITY ANALYSIS'
                      : '🔍 CODE REVIEW'}
                  </div>
                  <div className="text-xs leading-relaxed">
                    {askAiMentor.isPending ? (
                      <div className="flex items-center gap-2 text-purple-400 text-xs py-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Mentor is analysing...</span>
                      </div>
                    ) : aiMentorResponse ? (
                      <MarkdownRenderer text={aiMentorResponse} />
                    ) : (
                      <p className="text-gray-400 text-xs">Select a mode above and the AI Mentor will respond based on your current code.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor & Console */}
        <div className={`w-full lg:w-[55%] flex flex-col h-full overflow-hidden bg-gray-900 ${
          mobileTab === 'code' || mobileTab === 'console' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Editor Header / Language selector */}
          <div className="bg-gray-950 px-3 py-1.5 border-b border-gray-850 flex items-center justify-between text-xxs text-gray-400 flex-shrink-0">
            <div className="flex items-center gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="py-1 px-2 rounded border border-gray-800 bg-gray-900 text-xxs font-semibold text-gray-300 focus:outline-none cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>

              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                <span>Auto Saved</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleFormatCode} className="hover:text-white transition-all text-xxs">Format</button>
              <button onClick={handleResetCode} className="hover:text-white transition-all text-xxs">Reset</button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-grow relative min-h-0">
            <Editor
              height="100%"
              theme="vs-dark"
              language={
                selectedLanguage === 'python' ? 'python' :
                selectedLanguage === 'cpp' ? 'cpp' :
                selectedLanguage === 'java' ? 'java' : 'javascript'
              }
              value={editorCode}
              onChange={(v) => setEditorCode(v || '')}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 10 },
              }}
            />
          </div>

          {/* Console / Testcases wrapper */}
          <div className="border-t border-gray-800 bg-gray-950 flex flex-col flex-shrink-0 relative">
            
            {/* Draggable resizer bar */}
            {consoleOpen && (
              <div
                onMouseDown={startResize}
                className="absolute top-0 left-0 w-full h-1 bg-transparent hover:bg-primary-500 cursor-row-resize z-20"
              />
            )}

            <div className="flex border-b border-gray-800 px-3 items-center justify-between bg-gray-950 flex-shrink-0 select-none">
              <div className="flex">
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setConsoleTab('testcase');
                  }}
                  className={`px-3 py-2 font-semibold text-xxs flex items-center gap-1.5 transition-all ${
                    consoleOpen && consoleTab === 'testcase'
                      ? 'border-t-2 border-green-500 text-green-400 bg-gray-900/30'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Testcase
                </button>
                <button
                  onClick={() => {
                    setConsoleOpen(true);
                    setConsoleTab('result');
                  }}
                  className={`px-3 py-2 font-semibold text-xxs flex items-center gap-1.5 transition-all ${
                    consoleOpen && consoleTab === 'result'
                      ? 'border-t-2 border-green-500 text-green-400 bg-gray-900/30'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  Result
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={consoleSize}
                  onChange={(e) => setConsoleSize(e.target.value as any)}
                  className="py-0.5 px-1.5 rounded border border-gray-800 bg-gray-900 text-[10px] font-semibold text-gray-500 focus:outline-none cursor-pointer"
                >
                  <option value="small">Small Console</option>
                  <option value="medium">Medium Console</option>
                  <option value="large">Large Console</option>
                </select>

                <button
                  onClick={() => setConsoleOpen(!consoleOpen)}
                  className="text-[10px] font-bold text-gray-500 hover:text-gray-300 uppercase tracking-wider px-1.5"
                >
                  {consoleOpen ? 'Collapse' : 'Console'}
                </button>
              </div>
            </div>

            {/* Console content */}
            {consoleOpen && (
              <div
                style={{ height: `${consoleHeight}px` }}
                className="p-4 overflow-y-auto font-mono text-xs text-gray-300 bg-gray-950 scrollbar-thin transition-all duration-150"
              >
                {consoleTab === 'testcase' ? (
                  <div className="space-y-2 h-full flex flex-col">
                    <span className="text-gray-400 text-xxs font-semibold">Custom Testcase Input:</span>
                    <textarea
                      value={customTestcaseInput}
                      onChange={(e) => setCustomTestcaseInput(e.target.value)}
                      className="w-full flex-1 min-h-[60px] p-2.5 bg-gray-900 rounded border border-gray-800 focus:outline-none focus:border-gray-700 text-xs font-mono text-white resize-none"
                    />
                  </div>
                ) : (
                  <div>
                    {executionOutput ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Result status:</span>
                          {executionOutput.status ? (
                            <Badge
                              variant={executionOutput.status === 'accepted' ? 'success' : 'danger'}
                              className="uppercase text-xxs font-bold"
                            >
                              {executionOutput.status}
                            </Badge>
                          ) : executionOutput.isCustomRun ? (
                            <Badge variant="primary" className="uppercase text-xxs font-bold">
                              EXECUTED
                            </Badge>
                          ) : (
                            <Badge
                              variant={executionOutput.passed ? 'success' : 'danger'}
                              className="uppercase text-xxs font-bold"
                            >
                              {executionOutput.passed ? 'PASSED' : 'FAILED'}
                            </Badge>
                          )}
                        </div>

                        {executionOutput.runtime !== undefined && (
                          <div className="flex items-center gap-1.5 text-xxs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>Execution Time: {executionOutput.runtime} ms</span>
                          </div>
                        )}

                        {executionOutput.errorMessage ? (
                          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 flex gap-2 text-xxs">
                            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="whitespace-pre-wrap">{executionOutput.errorMessage}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xxs">
                            {executionOutput.input && (
                              <div>
                                <span className="text-gray-500">Sample Input:</span>
                                <pre className="p-2 bg-gray-900/50 rounded border border-gray-850 mt-0.5">{executionOutput.input}</pre>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Your Output:</span>
                              <pre className="p-2 bg-gray-900/50 rounded border border-gray-850 mt-0.5">{executionOutput.actualOutput || 'No output'}</pre>
                            </div>
                            {executionOutput.expectedOutput && (
                              <div>
                                <span className="text-gray-500">Expected Output:</span>
                                <pre className="p-2 bg-gray-900/50 rounded border border-gray-850 mt-0.5">{executionOutput.expectedOutput}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 py-4 text-center text-xxs">Run code to inspect results.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action bar (Run & Submit buttons bottom right like LeetCode) */}
          <div className="bg-gray-950 px-4 py-2 border-t border-gray-850 flex items-center justify-between text-xxs flex-shrink-0">
            <button
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold transition-all border border-gray-800"
            >
              Console
            </button>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Play className="w-3 h-3" />}
                onClick={handleRunCode}
                loading={runCodeMutation.isPending}
                className="px-4 py-1.5 text-xxs"
              >
                Run
              </Button>

              <Button
                size="sm"
                leftIcon={<Send className="w-3 h-3" />}
                onClick={handleSubmitCode}
                loading={isSubmitting}
                className="px-4 py-1.5 text-xxs"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden animate-scaleUp">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600" />
            
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg relative">
                {unlockedBadgeData ? (
                  <span className="text-5xl animate-bounce">{unlockedBadgeData.iconUrl || 'ðŸ†'}</span>
                ) : (
                  <Award className="w-12 h-12 text-white animate-pulse" />
                )}
                <div className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-25" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                  {unlockedBadgeData ? 'Badge Unlocked! ðŸŽ‰' : 'Challenge Solved! ðŸš€'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {unlockedBadgeData 
                    ? `Congratulations! You unlocked the "${unlockedBadgeData.name}" badge for solving this coding challenge.`
                    : `Incredible job! You have passed 100% of the test cases for this challenge.`}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-800/50 flex justify-around text-center">
                <div>
                  <span className="text-xxs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">XP Gained</span>
                  <span className="text-lg font-bold text-amber-500">+{question.xpReward} XP</span>
                </div>
                <div className="border-r border-gray-200 dark:border-gray-800" />
                <div>
                  <span className="text-xxs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Difficulty</span>
                  <span className={`text-sm font-bold uppercase ${
                    question.difficulty === 'hard' ? 'text-red-500' :
                    question.difficulty === 'medium' ? 'text-amber-500' : 'text-green-500'
                  }`}>{question.difficulty}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => {
                    const text = `I just solved the "${question.title}" coding challenge on Adyapan! ðŸš€\n\nLevel: ${question.difficulty.toUpperCase()}\nXP Earned: +${question.xpReward}\n\nJoin me in preparing for top companies on Adyapan! #coding #programming #placement #adyapan`;
                    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0077b5] hover:bg-[#006297] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Share2 className="w-4 h-4" />
                  Share on LinkedIn
                </button>
                
                <button
                  onClick={() => {
                    setShowBadgeModal(false);
                    setUnlockedBadgeData(null);
                  }}
                  className="w-full py-3 px-6 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
