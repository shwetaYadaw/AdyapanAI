import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ICourse, ICoursePagination, ICourseFilters } from '@adyapan/shared';

export function useCourses(filters: ICourseFilters = {}) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async (): Promise<ICoursePagination> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.append(k, String(v));
      });
      const { data } = await api.get(`/courses?${params.toString()}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourseDetail(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async (): Promise<{ course: ICourse; isEnrolled: boolean }> => {
      const { data } = await api.get(`/courses/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['myEnrollments'],
    queryFn: async () => {
      const { data } = await api.get('/enrollments/my-courses');
      return data.data;
    },
  });
}
