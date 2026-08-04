import React, { useState } from 'react';
import { ArrowLeft, Plus, Brain } from 'lucide-react';
import AptitudeTopicsList from '../components/aptitude/AptitudeTopicsList';
import AptitudeTopicDetail from '../components/aptitude/AptitudeTopicDetail';
import Button from '../../../shared/components/Button/Button';

interface PageState {
  view: 'topics' | 'topic-detail';
  selectedTopicId?: string;
}

interface AptitudeManagementPageProps {
  onBack?: () => void;
}

export default function AptitudeManagementPage({ onBack }: AptitudeManagementPageProps) {
  const [pageState, setPageState] = useState<PageState>({ view: 'topics' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleViewTopic = (topicId: string) => {
    setPageState({ view: 'topic-detail', selectedTopicId: topicId });
  };

  const handleBack = () => {
    if (pageState.view === 'topic-detail') {
      setPageState({ view: 'topics' });
      setRefreshTrigger(prev => prev + 1);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {(pageState.view === 'topic-detail' || onBack) && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back {pageState.view === 'topic-detail' ? 'to Topics' : 'to Problems'}</span>
            </button>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {pageState.view === 'topics' ? 'Aptitude Management' : 'Topic Questions'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {pageState.view === 'topics' 
                    ? 'Manage quantitative, verbal, and logical reasoning topics' 
                    : 'Manage questions for this topic'}
                </p>
              </div>
            </div>
            
            {pageState.view === 'topics' && (
              <Button
                rightIcon={<Plus size={18} />}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Add Topic
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {pageState.view === 'topics' ? (
          <AptitudeTopicsList 
            onSelectTopic={handleViewTopic}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <AptitudeTopicDetail 
            topicId={pageState.selectedTopicId!}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
