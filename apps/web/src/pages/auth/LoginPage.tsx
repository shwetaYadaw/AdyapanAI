import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';
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
    
    // Initialize Google Identity Services
    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: env.GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn-container'),
          { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'signin_with', width: '356' }
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
        alignItems:'center',
        justifyContent:'center',
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
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 0,
      }} />

      {/* ── Decorative circles */}
      {[{size:400,x:-100,y:-100,op:0.08},{size:300,x:'calc(100% - 150px)',y:'calc(100% - 150px)',op:0.08},{size:200,x:'50%',y:'30%',op:0.06}].map((c,i)=>(
        <div key={i} style={{
          position:'absolute',
          width:c.size,
          height:c.size,
          borderRadius:'50%',
          background:'rgba(255,255,255,0.05)',
          left:c.x,
          top:c.y,
          opacity:c.op,
          zIndex:1,
        }} />
      ))}

      {/* ── Center form container ── */}
      <div style={{
        position:'relative',
        zIndex:2,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:32,
        width:'100%',
      }}>
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}
          style={{
            width:'100%',
            maxWidth:420,
            background:'rgba(255, 250, 246, 0.75)',
            backdropFilter:'blur(10px)',
            borderRadius:20,
            padding:40,
            boxShadow:'0 20px 60px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1) inset',
            border:'1px solid rgba(255,255,255,0.2)',
          }}>

          {/* Mobile logo */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <Link to="/" style={{ textDecoration:'none', display:'inline-block' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${ORANGE},${AMBER})`,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:12, color:'#fff' }}>ady.</span>
                </div>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20, color:'#1A0A00' }}>ADYAPAN</span>
              </div>
            </Link>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:24, color:'#1A0A00', margin:'16px 0 4px' }}>
              Welcome Back
            </h2>
            <p style={{ color:'#7C4A1E', fontSize:14, margin:0 }}>Sign in to continue your journey</p>
          </div>

          {/* Error */}
          {authError && (
            <div style={{ background:'#FFF0E0', border:`1px solid ${ORANGE}`, borderRadius:12,
              padding:'12px 16px', marginBottom:20, color:ORANGE, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A2800', marginBottom:6 }}>
                Email address <span style={{ color:ORANGE }}>*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="input-field"
                style={{ width:'100%' }}
                {...register('email')}
              />
              {errors.email && <p style={{ color:ORANGE, fontSize:12, marginTop:4 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A2800', marginBottom:6 }}>
                Password <span style={{ color:ORANGE }}>*</span>
              </label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="input-field"
                  style={{ width:'100%', paddingRight:44 }}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'#B88A6A', padding:4 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ color:ORANGE, fontSize:12, marginTop:4 }}>{errors.password.message}</p>}
            </div>

            {/* Forgot */}
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:-8 }}>
              <Link to="/forgot-password" style={{ fontSize:13, color:ORANGE, fontWeight:600, textDecoration:'none' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary"
              style={{ width:'100%', padding:'14px', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {isLoading ? (
                <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'#F0D9C8' }} />
            <span style={{ fontSize:12, color:'#B88A6A' }}>or continue with</span>
            <div style={{ flex:1, height:1, background:'#F0D9C8' }} />
          </div>

          {/* Google GSI Button Container */}
          <div id="google-signin-btn-container" style={{ display:'flex', justifyContent:'center', minHeight: 44 }}></div>

          <p style={{ textAlign:'center', fontSize:14, color:'#7C4A1E', marginTop:24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:ORANGE, fontWeight:700, textDecoration:'none' }}>
              Sign up free →
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="maxWidth:420"] {
            margin: 0 auto;
          }
        }
      `}</style>
      </div>
    </>
  );
}
