import { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, useColorScheme, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCourses } from '../../../hooks/useCourses';
import Header from '../../../components/layout/Header';
import CourseCard from '../../../components/feature/CourseCard';
import { ICourse } from '@adyapan/shared';

const CATEGORIES = ['All', 'tech', 'non-tech', 'placement', 'ai'];

export default function CoursesScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, isLoading, isFetchingNextPage } = useCourses({
    search: submittedSearch || undefined,
    category: category || undefined,
    page: 1,
    limit: 20,
  });

  const courses: ICourse[] = (data as { courses?: ICourse[] })?.courses ?? [];

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
      <Header title="Courses" />

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => setSubmittedSearch(search)}
          placeholder="Search courses..."
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          style={[styles.searchInput, {
            backgroundColor: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f9fafb' : '#111827',
            borderColor: isDark ? '#334155' : '#e5e7eb',
          }]}
        />
      </View>

      {/* Category pills */}
      <View>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCategory(item === 'All' ? '' : item)}
              style={[
                styles.pill,
                (category === item || (item === 'All' && !category))
                  ? styles.pillActive
                  : { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
              ]}
            >
              <Text style={[
                styles.pillText,
                (category === item || (item === 'All' && !category)) && styles.pillTextActive,
              ]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => router.push(`/(student)/courses/${item.slug}` as never)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: '#9ca3af', fontSize: 15 }}>No courses found</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchRow: { padding: 14, paddingBottom: 8 },
  searchInput: {
    borderRadius: 14, borderWidth: 1, paddingHorizontal: 14,
    paddingVertical: 11, fontSize: 14,
  },
  pills: { paddingHorizontal: 14, paddingBottom: 10, gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  pillActive: { backgroundColor: '#3b82f6' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  pillTextActive: { color: '#fff' },
  list: { padding: 14 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
});
