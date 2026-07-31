import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, BookOpen, Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { api } from '../../services/api';

interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  module: string;
  topic: string;
  difficulty: string;
}

interface TopicGroup {
  topic: string;
  questions: AptitudeQuestion[];
}

export default function AptitudePage() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string>('quantitative');

  // Fetch all aptitude questions
  const { data: questions, isLoading } = useQuery<AptitudeQuestion[]>({
    queryKey: ['aptitudeQuestions', selectedModule],
    queryFn: async () => {
      try {
        const { data } = await api.get('/aptitude', {
          params: { module: selectedModule },
        });
        return data.data || [];
      } catch (err) {
        console.error('Failed to fetch aptitude questions:', err);
        return [];
      }
    },
  });

  // Group questions by topic
  const topicGroups: TopicGroup[] = questions
    ? Object.values(
        questions.reduce((acc, question) => {
          if (!acc[question.topic]) {
            acc[question.topic] = { topic: question.topic, questions: [] };
          }
          acc[question.topic].questions.push(question);
          return acc;
        }, {} as Record<string, TopicGroup>)
      )
    : [];

  const handleTopicClick = (topic: string) => {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/student/aptitude/${selectedModule}/${slug}`);
  };

  const modules = [
    { id: 'quantitative', name: 'Quantitative', icon: '🔢', color: 'blue' },
    { id: 'verbal', name: 'Verbal', icon: '📝', color: 'green' },
    { id: 'logical', name: 'Logical Reasoning', icon: '🧩', color: 'purple' },
  ];

  return (
    <div className="page-wrapper space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            Aptitude Preparation
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Master quantitative, verbal, and logical reasoning for placement tests
          </p>
        </div>
      </div>

      {/* Module Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            padding="md"
            className={`cursor-pointer transition-all border-2 ${
              selectedModule === module.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            onClick={() => setSelectedModule(module.id)}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{module.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{module.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {topicGroups.length} topics
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Topics List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : topicGroups.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
            {modules.find((m) => m.id === selectedModule)?.name} Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicGroups.map((group) => (
              <Card
                key={group.topic}
                padding="md"
                className="border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleTopicClick(group.topic)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors capitalize">
                        {group.topic.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {group.questions.length} questions
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>

                  {/* Difficulty Distribution */}
                  <div className="flex items-center gap-2">
                    {['easy', 'medium', 'hard'].map((diff) => {
                      const count = group.questions.filter((q) => q.difficulty === diff).length;
                      if (count === 0) return null;
                      return (
                        <Badge
                          key={diff}
                          variant={
                            diff === 'easy' ? 'success' : diff === 'medium' ? 'warning' : 'danger'
                          }
                          className="text-xs capitalize"
                        >
                          {diff}: {count}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No questions available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Questions for this module will be added soon. Check back later!
          </p>
        </Card>
      )}
    </div>
  );
}
