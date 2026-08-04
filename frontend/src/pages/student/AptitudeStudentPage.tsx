import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, BookOpen, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { api } from '../../core/services/api';
import Card from '../../shared/components/Card/Card';
import Badge from '../../shared/components/Badge/Badge';
import Button from '../../shared/components/Button/Button';

interface Topic {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  name: string;
  description?: string;
  order: number;
  topicId: string;
  isActive: boolean;
  questions?: Question[];
}

interface Question {
  id: string;
  question: string;
  difficulty: string;
  marks: number;
  options: Option[];
  correctOptionIndex: number;
  explanation: string;
}

interface Option {
  id: string;
  text: string;
  questionId: string;
}

export default function AptitudeStudentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Fetch topics
  const { data: topics = [], isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ['aptitude-student-topics'],
    queryFn: async () => {
      const { data } = await api.get('/aptitude/topics');
      return data.data ?? [];
    },
  });

  // Fetch chapters for expanded topic
  const { data: chapters = {} } = useQuery<Record<string, Chapter[]>>({
    queryKey: ['aptitude-student-chapters', expandedTopic],
    queryFn: async () => {
      if (!expandedTopic) return {};
      try {
        const { data } = await api.get(`/aptitude/topics/${expandedTopic}`);
        return { [expandedTopic]: data.data?.chapters ?? [] };
      } catch {
        return {};
      }
    },
    enabled: !!expandedTopic,
  });

  // Fetch questions for expanded chapter
  const { data: questions = {} } = useQuery<Record<string, Question[]>>({
    queryKey: ['aptitude-student-questions', expandedChapter],
    queryFn: async () => {
      if (!expandedChapter || !expandedTopic) return {};
      try {
        const { data } = await api.get(
          `/aptitude/topics/${expandedTopic}/chapters/${expandedChapter}`
        );
        return { [expandedChapter]: data.data?.questions ?? [] };
      } catch {
        return {};
      }
    },
    enabled: !!expandedChapter && !!expandedTopic,
  });

  const filteredTopics = useMemo(
    () => topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [topics, searchQuery]
  );

  const topicChapters = expandedTopic ? chapters[expandedTopic] ?? [] : [];
  const chapterQuestions = expandedChapter ? questions[expandedChapter] ?? [] : [];

  const handleTopicClick = (topicId: string) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
      setExpandedChapter(null);
    } else {
      setExpandedTopic(topicId);
      setExpandedChapter(null);
    }
  };

  const handleChapterClick = (chapterId: string) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
    }
  };

  return (
    <div className="page-wrapper space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Brain className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight">
            Aptitude Preparation
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Master quantitative ability, logical reasoning, and verbal skills to ace top MNC placement assessments.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/70 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5">📚 {topics.length} Topics</span>
            <span className="flex items-center gap-1.5">📖 {topics.reduce((sum, t) => sum + (t.chapters?.length ?? 0), 0)} Chapters</span>
            <span className="flex items-center gap-1.5">❓ {topics.reduce((sum, t) => sum + ((t.chapters?.reduce((cs, c) => cs + (c.questions?.length ?? 0), 0)) ?? 0), 0)} Questions</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {topicsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading topics...</div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No topics available</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div key={topic.id}>
              {/* Topic Card */}
              <button
                onClick={() => handleTopicClick(topic.id)}
                className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {topic.name}
                    </h3>
                    {topic.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{topic.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>📖 {topic.chapters?.length ?? 0} Chapters</span>
                      <span>❓ {(topic.chapters?.reduce((sum, c) => sum + (c.questions?.length ?? 0), 0)) ?? 0} Questions</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedTopic === topic.id ? (
                      <ChevronUp size={24} className="text-green-600" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Chapters */}
              {expandedTopic === topic.id && (
                <div className="mt-2 ml-4 space-y-2 border-l-2 border-green-300 dark:border-green-700 pl-4">
                  {topicChapters.length === 0 ? (
                    <div className="py-4 text-gray-500 dark:text-gray-400">No chapters available</div>
                  ) : (
                    topicChapters.map((chapter, idx) => (
                      <div key={chapter.id}>
                        {/* Chapter Card */}
                        <button
                          onClick={() => handleChapterClick(chapter.id)}
                          className="w-full text-left bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700 hover:border-blue-400 transition-all hover:shadow-md group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                  {chapter.name}
                                </h4>
                                {chapter.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{chapter.description}</p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  ❓ {chapter.questions?.length ?? 0} Questions
                                </p>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              {expandedChapter === chapter.id ? (
                                <ChevronUp size={20} className="text-blue-600" />
                              ) : (
                                <ChevronDown size={20} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Questions */}
                        {expandedChapter === chapter.id && (
                          <div className="mt-2 ml-4 space-y-3 border-l-2 border-blue-300 dark:border-blue-700 pl-4">
                            {chapterQuestions.length === 0 ? (
                              <div className="py-4 text-gray-500 dark:text-gray-400">No questions available</div>
                            ) : (
                              chapterQuestions.map((question, qIdx) => (
                                <Card
                                  key={question.id}
                                  padding="md"
                                  className="border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                                >
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <span className="font-mono text-sm font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
                                        Q{qIdx + 1}.
                                      </span>
                                      <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium">
                                          {question.question.substring(0, 150)}
                                          {question.question.length > 150 ? '...' : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                      <Badge
                                        variant={
                                          question.difficulty === 'easy'
                                            ? 'success'
                                            : question.difficulty === 'medium'
                                            ? 'warning'
                                            : 'danger'
                                        }
                                      >
                                        {question.difficulty}
                                      </Badge>
                                      <Badge variant="primary">
                                        {question.marks} marks
                                      </Badge>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                      <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => {
                                          // Navigate to question attempt page
                                          // This can be implemented with router navigation
                                        }}
                                      >
                                        Attempt Question
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
