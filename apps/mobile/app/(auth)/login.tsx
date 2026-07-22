import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store';
import Button from '../../components/common/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }
    const result = await dispatch(loginThunk({ email: email.trim(), password }));
    if (loginThunk.fulfilled.match(result)) {
      const role = result.payload.user?.role;
      const routes: Record<string, string> = {
        student: '/(student)',
        teacher: '/(teacher)',
        recruiter: '/(recruiter)',
        mentor: '/(mentor)',
        admin: '/(student)',
        superadmin: '/(student)',
      };
      router.replace((routes[role] ?? '/(student)') as never);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <LinearGradient colors={['#f59e0b', '#f97316']} style={styles.logoBadge}>
            <Text style={styles.logoText}>ady.</Text>
          </LinearGradient>
          <Text style={[styles.logoName, { color: isDark ? '#f9fafb' : '#111827' }]}>ADYAPAN</Text>
          <Text style={styles.tagline}>AI-Powered Career Development</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to continue learning</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: isDark ? '#d1d5db' : '#374151' }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={[styles.input, { backgroundColor: isDark ? '#111827' : '#f9fafb', color: isDark ? '#f9fafb' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb' }]}
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: isDark ? '#d1d5db' : '#374151' }]}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPass}
                autoComplete="password"
                style={[styles.input, styles.passwordInput, { backgroundColor: isDark ? '#111827' : '#f9fafb', color: isDark ? '#f9fafb' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb' }]}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as never)} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button onPress={handleLogin} loading={isLoading} fullWidth size="lg">
            Sign In
          </Button>

          <View style={styles.registerRow}>
            <Text style={[styles.registerLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as never)}>
              <Text style={styles.registerLink}>Sign up free</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 24 },
  logoSection: { alignItems: 'center', gap: 8 },
  logoBadge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#f59e0b', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  logoName: { fontWeight: '900', fontSize: 24, letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: '#9ca3af' },
  card: { borderRadius: 20, borderWidth: 1, padding: 24, gap: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  cardTitle: { fontWeight: '800', fontSize: 22 },
  cardSubtitle: { color: '#9ca3af', fontSize: 13, marginTop: -8 },
  errorBox: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 10, padding: 12 },
  errorText: { color: '#dc2626', fontSize: 13 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 46 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },
  eyeIcon: { fontSize: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 13, color: '#3b82f6', fontWeight: '600' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  registerLabel: { fontSize: 13 },
  registerLink: { fontSize: 13, color: '#3b82f6', fontWeight: '700' },
});
