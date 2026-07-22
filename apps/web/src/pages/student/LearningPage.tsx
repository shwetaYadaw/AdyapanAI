import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, CheckCircle2, List, X } from 'lucide-react';
import { api } from '../../services/api';
import ProgressBar from '../../components/common/ProgressBar/ProgressBar';
import { clsx } from 'clsx';

export default function LearningPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: courseData } = useQuery({
    queryKey: ['courseContent', courseId],
    queryFn: async () => {
      const [courseRes, progressRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/enrollments/${courseId}/progress`),
      ]);
      return {
        course: courseRes.data.data.course,
        enrollment: progressRes.data.data,
      };
    },
    enabled: !!courseId,
  });

  const updateProgress = useMutation({
    mutationFn: (data: { lectureId: string; watchedDuration: number; completed: boolean }) =>
      api.put(`/enrollments/${courseId}/progress`, data),
  });

  const course = courseData?.course;
  const enrollment = courseData?.enrollment;

  const allLectures = course?.sections?.flatMap((s: { lectures: { _id: string }[] }) => s.lectures ?? []) ?? [];
  const currentLecture = allLectures.find((l: { _id: string }) => l._id === currentLectureId) ?? allLectures[0];
  const currentIndex = allLectures.findIndex((l: { _id: string }) => l._id === currentLecture?._id);

  const isCompleted = (lectureId: string) =>
    enrollment?.lectureProgress?.some((p: { lectureId: string; completed: boolean }) => p.lectureId === lectureId && p.completed);

  const handleVideoEnd = () => {
    if (!currentLecture) return;
    updateProgress.mutate({ lectureId: currentLecture._id, watchedDuration: currentLecture.duration ?? 0, completed: true });
  };

  const goTo = (index: number) => {
    if (index >= 0 && index < allLectures.length) {
      setCurrentLectureId(allLectures[index]._id);
    }
  };

  if (!course) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <List className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{currentLecture?.title ?? 'Select a lecture'}</p>
            <p className="text-gray-400 text-xs">{course.title}</p>
          </div>
          <div className="hidden sm:block w-40">
            <ProgressBar value={enrollment?.progress ?? 0} size="xs" showPercent />
          </div>
        </div>

        {/* Video player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {currentLecture?.videoUrl ? (
            <video
              key={currentLecture._id}
              src={currentLecture.videoUrl}
              controls
              className="w-full h-full max-h-[calc(100vh-160px)] object-contain"
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg">Select a lecture to start watching</p>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-t border-gray-800">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex <= 0}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-gray-500">{currentIndex + 1} / {allLectures.length}</span>
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex >= allLectures.length - 1}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <p className="text-white font-semibold text-sm">Course Content</p>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {course.sections?.map((section: { _id: string; title: string; lectures: { _id: string; title: string; duration: number }[] }) => (
              <div key={section._id}>
                <div className="px-4 py-2.5 bg-gray-800/50 sticky top-0">
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{section.title}</p>
                </div>
                {section.lectures?.map((lecture) => (
                  <button
                    key={lecture._id}
                    onClick={() => setCurrentLectureId(lecture._id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-b border-gray-800/30',
                      currentLecture?._id === lecture._id && 'bg-primary-900/30 border-l-2 border-l-primary-500'
                    )}
                  >
                    <CheckCircle2 className={clsx('w-4 h-4 flex-shrink-0', isCompleted(lecture._id) ? 'text-green-500' : 'text-gray-600')} />
                    <p className={clsx('text-xs leading-snug', currentLecture?._id === lecture._id ? 'text-white' : 'text-gray-400')}>
                      {lecture.title}
                    </p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
