import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useColorScheme, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Avatar from '../common/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBack = false, rightElement }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: isDark ? '#111827' : '#fff',
          borderBottomColor: isDark ? '#1f2937' : '#f3f4f6',
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Text style={[styles.backIcon, { color: isDark ? '#f9fafb' : '#111827' }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>ady.</Text>
            </View>
            <Text style={[styles.logoName, { color: isDark ? '#f9fafb' : '#111827' }]}>ADYAPAN</Text>
          </View>
        )}

        {title && (
          <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#111827' }]} numberOfLines={1}>
            {title}
          </Text>
        )}

        <View style={styles.rightSlot}>
          {rightElement ?? (
            user && (
              <Avatar
                src={user.avatar}
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
              />
            )
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  logoName: { fontWeight: '800', fontSize: 16 },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, fontWeight: '300' },
  title: { fontWeight: '700', fontSize: 17, flex: 1, textAlign: 'center', marginHorizontal: 8 },
  rightSlot: { minWidth: 32, alignItems: 'flex-end' },
});
