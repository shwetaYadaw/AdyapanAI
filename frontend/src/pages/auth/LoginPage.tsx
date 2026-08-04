import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/hooks';
import { loginThunk, selectAuthLoading, selectAuthError, clearError, googleLoginThunk } from '../../features/auth/authSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { env } from '../../core/config/env';
import Navbar from '../../shared/components/Navbar/Navbar';

declare global {
  interface Window {
    google?: any;
  }
}

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

const ORANGE = '#E85D04';
const AMBER  = '#F48C06';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch   = useAppDispatch();
  const isLoading  = useAppSelector(selectAuthLoading);
  const authError  = useAppSelector(selectAuthError);
  const navigate   = useNavigate();
  const location   = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/student/dashboard';

  const handleGoogleResponse = async (response: any) => {
    const result = await dispatch(googleLoginThunk(response.credential));
    if (googleLoginThunk.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const role = result.payload.user?.role;
      // Only two roles: student and admin
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      toast.error('Google sign in failed');
    }
  };

  useEffect(() => {
    dispatch(clearError());
    
    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: env.GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn-container'),
          { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'signup_with', width: '280' }
        );
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGsi();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [dispatch]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const role = result.payload.user?.role;
      // Only two roles: student and admin
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight:'calc(100vh - 64px)',
        display:'flex',
        fontFamily:'Inter,sans-serif',
        backgroundImage: 'url(/login-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position:'relative',
        overflow:'hidden',
      }}>
        
        {/* ── Full-page dark overlay for readability ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(60, 60, 60, 0.6)',
          zIndex: 0,
        }} />

        {/* ── Main Container ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '40px 60px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>

          {/* ── Center Form Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: 'rgba(255, 250, 246, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20,
              padding: 40,
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1) inset',
              border: '1px solid rgba(255,255,255,0.2)',
              zIndex: 10,
              position: 'relative',
            }}
          >
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg,${ORANGE},${AMBER})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 8px 24px rgba(232, 93, 4, 0.3)',
              }}>
                <span style={{
                  fontFamily: 'Poppins,sans-serif',
                  fontWeight: 900,
                  fontSize: 12,
                  color: '#fff',
                }}>ady.</span>
              </div>
              <h2 style={{
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 800,
                fontSize: 18,
                color: '#1A0A00',
                margin: '0 0 4px',
              }}>ADYAPAN</h2>
              <p style={{
                fontSize: 12,
                color: '#7C4A1E',
                margin: '0 0 4px',
              }}>Welcome Back</p>
              <p style={{
                fontSize: 12,
                color: '#B88A6A',
                margin: 0,
              }}>Sign in to continue your journey</p>
            </div>

            {/* Error */}
            {authError && (
              <div style={{
                background: '#FFF0E0',
                border: `1px solid ${ORANGE}`,
                borderRadius: 12,
                padding: '10px 12px',
                marginBottom: 16,
                color: ORANGE,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#4A2800',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Email address <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #E5D4C1',
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#FFFAF6',
                    color: '#1A0A00',
                  }}
                  {...register('email')}
                />
                {errors.email && <p style={{
                  color: ORANGE,
                  fontSize: 11,
                  margin: '4px 0 0',
                }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#4A2800',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Password <span style={{ color: ORANGE }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    autoComplete="current-password"
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      paddingRight: 40,
                      border: '1px solid #E5D4C1',
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#FFFAF6',
                      color: '#1A0A00',
                    }}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#B88A6A',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{
                  color: ORANGE,
                  fontSize: 11,
                  margin: '4px 0 0',
                }}>{errors.password.message}</p>}
              </div>

              {/* Forgot */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6 }}>
                <Link to="/forgot-password" style={{
                  fontSize: 11,
                  color: ORANGE,
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  background: `linear-gradient(135deg, ${ORANGE}, ${AMBER})`,
                  border: 'none',
                  borderRadius: 8,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.7 : 1,
                  marginTop: 4,
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                    Signing in...
                  </span>
                ) : (
                  <><LogIn size={16} /> Sign In</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              margin: '16px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#F0D9C8' }} />
              <span style={{ fontSize: 11, color: '#B88A6A', fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: '#F0D9C8' }} />
            </div>

            {/* Google Button */}
            <div id="google-signin-btn-container" style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: 40,
            }} />

            <p style={{
              textAlign: 'center',
              fontSize: 12,
              color: '#7C4A1E',
              marginTop: 16,
              margin: '16px 0 0',
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                color: ORANGE,
                fontWeight: 800,
                textDecoration: 'none',
              }}>
                Sign up free →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1200px) {
          div[style*="maxWidth: '45%'"] { display: none; }
          div[style*="maxWidth: '30%'"] { display: none; }
        }
        input:focus {
          outline: none;
          border-color: ${ORANGE} !important;
          box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1) !important;
        }
      `}</style>
    </>
  );
}
