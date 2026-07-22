import { ScrollView, View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { api } from '../../services/api';
import Header from '../../components/layout/Header';
import Card from '../../components/common/Card';
import CourseCard from '../../components/feature/CourseCard';
import { formatRelativeTime } from '@adyapan/shared';

const QUICK_ACTIONS = [
  { label: 'Mock Interview', emoji: '🎯', route: '/(student)/placement' },
  { label: 'Resume Builder', emoji: '📄', route: '/(student)/profile' },
  { label: 'AI Tutor', emoji: '🧠', route: '/(student)/ai' },
  { label: 'Browse Jobs', emoji: '💼', route: '/(student)/courses' },
];

export default function StudentHomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);

  const { data: enrollments } = useQuery({
    queryKey: ['mobileEnrollments'],
    queryFn: async () => {
      const { data } = await api.get('/enrollments/my-courses');
      return data.data;
    },
  });

  const inProgress = (enrollments ?? []).filter(
    (e: { progress: number; isCompleted: boolean }) => e.progress > 0 && !e.isCompleted
  );

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: isDark ? '#f9fafb' : '#111827' }]}>
            Hello, {user?.firstName ?? 'Student'} 👋
          </Text>
          <Text style={styles.greetingSubtext}>Ready to learn today?</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>Quick Actions</Text>
        </View>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: isDark ? '#1e293b' : '#fff' }]}
              onPress={() => router.push(action.route as never)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionEmoji}>{action.emoji}</Text>
              <Text style={[styles.actionLabel, { color: isDark ? '#e2e8f0' : '#374151' }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Learning */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>Continue Learning</Text>
          <TouchableOpacity onPress={() => router.push('/(student)/courses' as never)}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {inProgress.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={[styles.emptyTitle, { color: isDark ? '#e2e8f0' : '#374151' }]}>No courses in progress</Text>
            <Text style={styles.emptySubtext}>Browse courses to start learning</Text>
            <TouchableOpacity
              onPress={() => router.push('/(student)/courses' as never)}
              style={styles.browseCta}
            >
              <Text style={styles.browseCtaText}>Browse Courses</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          inProgress.slice(0, 3).map((e: { courseId: { _id: string; title: string; thumbnail: string; instructor: { firstName: string; lastName: string }; category: string; level: string; rating: number; ratingCount: number; enrollmentCount: number; totalDuration: number; price: number; originalPrice: number; currency: string; isFree: boolean; slug: string }; progress: number; lastAccessedAt: string }) => (
            <CourseCard
              key={e.courseId._id}
              course={{ ...e.courseId, _id: e.courseId._id } as never}
              progress={e.progress}
              enrolled
              onPress={() => router.push(`/(student)/courses/${e.courseId._id}` as never)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 4 },
  greeting: { marginBottom: 16 },
  greetingText: { fontSize: 22, fontWeight: '800' },
  greetingSubtext: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  seeAll: { fontSize: 13, color: '#3b82f6', fontWeight: '600' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  actionCard: {
    width: '47%',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionEmoji: { fontSize: 28 },
  actionLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  emptyCard: { alignItems: 'center', padding: 28, gap: 8 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptySubtext: { fontSize: 13, color: '#9ca3af' },
  browseCta: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 4 },
  browseCtaText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
