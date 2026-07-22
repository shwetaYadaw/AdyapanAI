import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { getInitials } from '@adyapan/shared';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
const FONT_MAP: Record<AvatarSize, number> = { xs: 9, sm: 12, md: 15, lg: 18, xl: 24 };

export default function Avatar({
  src,
  firstName = 'U',
  lastName,
  size = 'md',
  style,
}: AvatarProps) {
  const dim = SIZE_MAP[size];
  const initials = getInitials(firstName, lastName);

  return (
    <View
      style={[
        styles.container,
        { width: dim, height: dim, borderRadius: dim / 2 },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          accessibilityLabel={`${firstName} ${lastName ?? ''}`.trim()}
        />
      ) : (
        <View style={[styles.placeholder, { width: dim, height: dim, borderRadius: dim / 2 }]}>
          <Text style={[styles.initials, { fontSize: FONT_MAP[size] }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  placeholder: {
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '700' },
});
