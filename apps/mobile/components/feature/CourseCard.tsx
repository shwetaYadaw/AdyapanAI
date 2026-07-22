import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme,
} from 'react-native';
import { ICourse, formatCourseDuration, formatNumber, formatPrice } from '@adyapan/shared';

interface CourseCardProps {
  course: ICourse;
  onPress: () => void;
  progress?: number;
  enrolled?: boolean;
}

export default function CourseCard({ course, onPress, progress, enrolled }: CourseCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#f3f4f6' }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{course.category}</Text>
          </View>
          <View style={[styles.tag, styles.tagLevel]}>
            <Text style={[styles.tagText, { color: '#8b5cf6' }]}>{course.level}</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#111827' }]} numberOfLines={2}>
          {course.title}
        </Text>

        <Text style={styles.instructor} numberOfLines={1}>
          {course.instructor.firstName} {course.instructor.lastName}
        </Text>

        {enrolled && progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, progress)}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={styles.stat}>⭐ {course.rating.toFixed(1)}</Text>
            <Text style={styles.stat}>👥 {formatNumber(course.enrollmentCount)}</Text>
            <Text style={styles.stat}>🕐 {formatCourseDuration(course.totalDuration)}</Text>
          </View>
          {!enrolled && (
            <Text style={[styles.price, { color: course.isFree ? '#16a34a' : '#111827' }]}>
              {course.isFree ? 'Free' : formatPrice(course.price)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: { width: '100%', height: 160 },
  body: { padding: 14, gap: 6 },
  tags: { flexDirection: 'row', gap: 6 },
  tag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagLevel: { backgroundColor: '#f5f3ff' },
  tagText: { fontSize: 11, fontWeight: '600', color: '#3b82f6', textTransform: 'capitalize' },
  title: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  instructor: { fontSize: 12, color: '#6b7280' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  progressTrack: { flex: 1, height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 3 },
  progressText: { fontSize: 11, fontWeight: '700', color: '#3b82f6', width: 32 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { fontSize: 11, color: '#9ca3af' },
  price: { fontSize: 15, fontWeight: '800' },
});
