import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress?: () => void;
  children: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const BG: Record<Variant, string> = {
  primary: '#3b82f6',
  secondary: '#eff6ff',
  ghost: 'transparent',
  danger: '#ef4444',
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: '#ffffff',
  secondary: '#3b82f6',
  ghost: '#6b7280',
  danger: '#ffffff',
};

const PADDING: Record<Size, { paddingVertical: number; paddingHorizontal: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 14 },
  md: { paddingVertical: 12, paddingHorizontal: 20 },
  lg: { paddingVertical: 16, paddingHorizontal: 28 },
};

const FONT_SIZE: Record<Size, number> = { sm: 13, md: 14, lg: 16 };

export default function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        { backgroundColor: BG[variant] },
        PADDING[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'secondary' && styles.secondaryBorder,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={children}
    >
      {loading ? (
        <ActivityIndicator size="small" color={TEXT_COLOR[variant]} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: TEXT_COLOR[variant], fontSize: FONT_SIZE[size] },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.6 },
  secondaryBorder: { borderWidth: 1.5, borderColor: '#3b82f6' },
  text: { fontWeight: '600', letterSpacing: 0.2 },
});
