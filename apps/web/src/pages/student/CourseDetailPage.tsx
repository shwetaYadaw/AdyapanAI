import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Clock, Users, Star, Award, ChevronDown, ChevronUp, PlayCircle,
  Lock, CheckCircle2, Globe, ArrowRight, ShoppingCart
} from 'lucide-react';
import { api } from '../../services/api';
import { formatCourseDuration, formatNumber, formatPrice } from '@adyapan/shared';
import Navbar from '../../components/layout/Navbar/Navbar';
import Badge from '../../components/common/Badge/Badge';
import Avatar from '../../components/common/Avatar/Avatar';
import Rating from '../../components/common/Rating/Rating';
import Button from '../../components/common/Button/Button';
import PageLoader from '../../components/common/Loader/PageLoader';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [enrolling, setEnrolling] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${slug}`);
      return data.data as { course: any; isEnrolled: boolean };
    },
    enabled: !!slug,
  });

  if (isLoading) return <PageLoader />;
  if (!data) return null;

  const { course, isEnrolled } = data;

  const toggleSection = (id: string) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleEnrollFree = async () => {
    setEnrolling(true);
    try {
      await api.post('/enrollments', { courseId: course._id });
      toast.success('Enrolled successfully!');
      navigate(`/student/learn/${course._id}`);
    } catch {
      toast.error('Failed to enroll. Please try again.');
    } finally { setEnrolling(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-12">
        <div className="page-container">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary" className="capitalize">{course.category}</Badge>
                <Badge variant="gray" className="capitalize">{course.level}</Badge>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight">{course.title}</h1>
              <p className="text-gray-300 text-base leading-relaxed">{course.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Rating value={course.rating} showValue count={course.ratingCount} />
                <span className="flex items-center gap-1 text-gray-300">
                  <Users className="w-4 h-4" /> {formatNumber(course.enrollmentCount)} students
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" /> {formatCourseDuration(course.totalDuration)}
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Globe className="w-4 h-4" /> {course.language}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar src={course.instructor?.avatar} firstName={course.instructor?.firstName} size="sm" />
                <span className="text-gray-300 text-sm">
                  by <span className="text-white font-medium">{course.instructor?.firstName} {course.instructor?.lastName}</span>
                </span>
              </div>
            </div>

            {/* Sticky card */}
            <div className="lg:sticky lg:top-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative aspect-video bg-gray-800">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
                      <PlayCircle className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                      {course.isFree ? 'Free' : formatPrice(course.price)}
                    </span>
                    {!course.isFree && course.originalPrice > course.price && (
                      <span className="text-gray-400 line-through text-sm">{formatPrice(course.originalPrice)}</span>
                    )}
                    {!course.isFree && course.originalPrice > course.price && (
                      <Badge variant="danger">{Math.round((1 - course.price / course.originalPrice) * 100)}% OFF</Badge>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link to={`/student/learn/${course._id}`}>
                      <Button fullWidth size="lg" leftIcon={<PlayCircle className="w-5 h-5" />}>
                        Continue Learning
                      </Button>
                    </Link>
                  ) : course.isFree ? (
                    <Button fullWidth size="lg" loading={enrolling} onClick={handleEnrollFree} rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Enroll for Free
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button fullWidth size="lg" leftIcon={<ShoppingCart className="w-5 h-5" />}>
                        Buy Now
                      </Button>
                      <Button fullWidth size="lg" variant="secondary">Add to Cart</Button>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 text-center mt-3">30-day money-back guarantee</p>

                  <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {formatCourseDuration(course.totalDuration)} on-demand video
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {course.totalLectures} lectures
                    </li>
                    {course.certificateEnabled && (
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        Certificate of completion
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Full lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="page-container py-10">
        <div className="lg:max-w-[66%] space-y-10">
          {/* What you'll learn */}
          {course.learningOutcomes?.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-2 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                {course.learningOutcomes.map((outcome: string) => (
                  <div key={outcome} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {outcome}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curriculum */}
          {course.sections?.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-4">Course Content</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                {course.sections.map((section: any) => (
                  <div key={section._id}>
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                    >
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{section.title}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{section.lectureCount} lectures</span>
                        <span>{formatCourseDuration(section.duration)}</span>
                        {expandedSections[section._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    {expandedSections[section._id] && section.lectures?.map((lecture: any) => (
                      <div key={lecture._id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          {lecture.isPreview || isEnrolled
                            ? <PlayCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            : <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          }
                          {lecture.title}
                        </div>
                        <span className="text-xs text-gray-400">{formatCourseDuration(lecture.duration / 60)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
