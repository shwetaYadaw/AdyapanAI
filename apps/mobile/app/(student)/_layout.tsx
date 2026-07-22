import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Home, BookOpen, Target, Brain, User } from 'lucide-react-native';

export default function StudentLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopColor: isDark ? '#1f2937' : '#f3f4f6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="courses/index"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="placement/index"
        options={{
          title: 'Placement',
          tabBarIcon: ({ color, size }) => <Target color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="ai/index"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, size }) => <Brain color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}
