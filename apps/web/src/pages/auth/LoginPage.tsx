import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginThunk, selectAuthLoading, selectAuthError, clearError, googleLoginThunk } from '../../features/auth/authSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { env } from '../../config/env';
import Navbar from '../../components/layout/Navbar/Navbar';

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
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
      const redirectMap: Record<string, string> = {
        student: '/student/dashboard', teacher: '/teacher/dashboard',
        mentor: '/mentor/dashboard',   recruiter: '/recruiter/dashboard',
        admin: '/admin/dashboard',     superadmin: '/admin/dashboard',
      };
      navigate(redirectMap[role] ?? from, { replace: true });
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
          { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'signin_with', width: '280' }
        );
        setGsiReady(true);
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
      // After 3s if GSI still not loaded, show fallback button
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!window.google?.accounts?.id) setGsiReady(false);
      }, 3000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
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
      const redirectMap: Record<string, string> = {
        student: '/student/dashboard', teacher: '/teacher/dashboard',
        mentor: '/mentor/dashboard',   recruiter: '/recruiter/dashboard',
        admin: '/admin/dashboard',     superadmin: '/admin/dashboard',
      };
      navigate(redirectMap[role] ?? from, { replace: true });
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight:'calc(100vh - 64px)',
        display:'flex',
        fontFamily:'Inter,sans-serif',
        backgroundColor: '#fff',
        position: 'relative',
      }}>
        
        {/* Left Orange Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: '0 0 45%',
            background: `linear-gradient(135deg, ${ORANGE} 0%, #F48C06 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            top: -100,
            left: -100,
          }} />
          <div style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            bottom: -60,
            right: -60,
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 300 }}>
            {/* Logo Circle */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 900,
                fontSize: 20,
                color: '#fff',
              }}>ady.</span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: 'Poppins,sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: '#fff',
              margin: '0 0 20px',
              letterSpacing: 2,
            }}>
              ADYAPAN
            </h1>

            {/* Description */}
            <p style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 14,
              lineHeight: 1.7,
              margin: '0 0 32px',
              fontWeight: 500,
            }}>
              Hub for Smarter Connections, Stronger Relationships, Better Results.
            </p>

            {/* Features */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {[
                'AI-Powered Career Development',
                '200+ Expert-Led Courses',
                'Placement Ready in 90 Days',
              ].map((feature) => (
                <div key={feature} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 13,
                  fontWeight: 500,
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#fff',
                    flexShrink: 0,
                  }} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            flex: '0 0 55%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ width: '100%', maxWidth: 380 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${ORANGE}, #F48C06)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <span style={{
                  fontFamily: 'Poppins,sans-serif',
                  fontWeight: 900,
                  fontSize: 14,
                  color: '#fff',
                }}>ady.</span>
              </div>
              <h2 style={{
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 800,
                fontSize: 22,
                color: '#1A0A00',
                margin: '0 0 8px',
              }}>
                ADYAPAN
              </h2>
              <h3 style={{
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: '#1A0A00',
                margin: '0 0 6px',
              }}>
                Welcome Back
              </h3>
              <p style={{
                fontSize: 13,
                color: ORANGE,
                margin: 0,
              }}>
                Sign in to continue your journey
              </p>
            </div>

            {/* Error */}
            {authError && (
              <div style={{
                background: '#FFF0E0',
                border: `1px solid ${ORANGE}`,
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 20,
                color: ORANGE,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#4A2800',
                  marginBottom: 8,
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
                    backgroundColor: '#fff',
                    color: '#1A0A00',
                  }}
                  {...register('email')}
                />
                {errors.email && <p style={{
                  color: ORANGE,
                  fontSize: 11,
                  margin: '6px 0 0',
                }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#4A2800',
                  marginBottom: 8,
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
                      backgroundColor: '#fff',
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
                  margin: '6px 0 0',
                }}>{errors.password.message}</p>}
              </div>

              {/* Forgot */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/forgot-password" style={{
                  fontSize: 12,
                  color: ORANGE,
                  fontWeight: 700,
                  textDecoration: 'none',
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
                  padding: '14px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  background: `linear-gradient(135deg, ${ORANGE}, #F48C06)`,
                  border: 'none',
                  borderRadius: 8,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.7 : 1,
                  marginTop: 8,
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
              gap: 12,
              margin: '24px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#E5D4C1' }} />
              <span style={{ fontSize: 12, color: '#B88A6A', fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: '#E5D4C1' }} />
            </div>

            {/* Google Button */}
            <div id="google-signin-btn-container" style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: 44,
            }} />

            {/* Sign up link */}
            <p style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#7C4A1E',
              marginTop: 24,
              margin: '24px 0 0',
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
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus {
          outline: none;
          border-color: ${ORANGE} !important;
          box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1) !important;
        }
        @media (max-width: 768px) {
          div { flex-direction: column !important; }
        }
      `}</style>
    </>
  );
}
