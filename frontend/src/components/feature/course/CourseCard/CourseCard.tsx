import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, PlayCircle } from 'lucide-react';
import { ICourse } from '@adyapan/shared';
import { formatCourseDuration, formatNumber, formatPrice } from '@adyapan/shared';
import Badge from '../../../../shared/components/Badge/Badge';
import Avatar from '../../../../shared/components/Avatar/Avatar';
import { api } from '../../../../core/services/api';
import toast from 'react-hot-toast';

interface CourseCardProps {
  course: ICourse;
  enrolled?: boolean;
  progress?: number;
  index?: number;
}

export default function CourseCard({ course, enrolled, progress, index = 0 }: CourseCardProps) {
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (course.isFree) {
      setEnrolling(true);
      try {
        await api.post('/enrollments', { courseId: course._id });
        toast.success('Enrolled successfully!');
        navigate(`/student/learn/${course._id}`);
      } catch {
        toast.error('Failed to enroll. Please try again.');
      } finally { setEnrolling(false); }
    } else {
      navigate(`/courses/${course.slug}`);
    }
  };
  const levelColor: Record<string, 'success' | 'warning' | 'danger' | 'primary'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
    all: 'primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/courses/${course.slug}`} className="block">
        <div className="card overflow-hidden h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300 drop-shadow-lg" />
            </div>
            {course.isFree && (
              <div className="absolute top-2 left-2">
                <Badge variant="success">Free</Badge>
              </div>
            )}
            {enrolled && (
              <div className="absolute top-2 right-2">
                <Badge variant="primary">Enrolled</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 gap-2">
            {/* Category + Level */}
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="capitalize">{course.category}</Badge>
              <Badge variant={levelColor[course.level] ?? 'gray'} className="capitalize">
                {course.level}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {course.title}
            </h3>

            {/* Instructor */}
            <div className="flex items-center gap-2 mt-auto pt-1">
              <Avatar
                src={course.instructor.avatar}
                firstName={course.instructor.firstName}
                lastName={course.instructor.lastName}
                size="xs"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </div>

            {/* Progress bar (enrolled) */}
            {enrolled && progress !== undefined && (
              <div className="mt-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span className="font-medium text-primary-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {course.rating.toFixed(1)}
                  <span className="text-gray-400">({formatNumber(course.ratingCount)})</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatNumber(course.enrollmentCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatCourseDuration(course.totalDuration)}
                </span>
              </div>

              {/* Price + Enroll */}
              {!enrolled && (
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">
                    {course.isFree ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      <div className="text-right">
                        <span className="text-gray-900 dark:text-white">{formatPrice(course.price)}</span>
                        {course.originalPrice > course.price && (
                          <span className="ml-1 text-gray-400 line-through text-xs">{formatPrice(course.originalPrice)}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      course.isFree
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : 'bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 text-white dark:text-gray-900'
                    } disabled:opacity-60`}
                  >
                    {enrolling ? '...' : course.isFree ? 'Enroll Free' : 'Buy Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
