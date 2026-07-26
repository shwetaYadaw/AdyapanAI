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
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'Inter,sans-serif' }}>

      {/* ── Left panel — brand ── */}
      <div style={{
        width:'42%', background:`linear-gradient(145deg, ${ORANGE} 0%, ${AMBER} 100%)`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:48, position:'relative', overflow:'hidden',
      }} className="hidden-mobile">
        {/* decorative circles */}
        {[{size:300,x:-80,y:-80,op:0.1},{size:200,x:120,y:60,op:0.08},{size:150,x:-40,y:200,op:0.08}].map((c,i)=>(
          <div key={i} style={{ position:'absolute', width:c.size, height:c.size, borderRadius:'50%',
            background:'rgba(255,255,255,0.15)', left:c.x, top:c.y, opacity:c.op }} />
        ))}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          {/* Logo */}
          <img src="/logo.svg" alt="ADYAPAN" style={{ width:96, height:96, borderRadius:'50%', margin:'0 auto 24px', display:'block', boxShadow:'0 8px 32px rgba(0,0,0,0.2)', objectFit:'cover' }} />
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:36, color:'#fff',
            letterSpacing:4, marginBottom:12 }}>ADYAPAN</h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:15, lineHeight:1.6, maxWidth:260, margin:'0 auto' }}>
            Hub for Smarter Connections,<br/>Stronger Relationships, Better Results.
          </p>
          <div style={{ marginTop:40, display:'flex', flexDirection:'column', gap:12 }}>
            {['AI-Powered Career Development','200+ Expert-Led Courses','Placement Ready in 90 Days'].map(t=>(
              <div key={t} style={{ display:'flex', alignItems:'center', gap:10, color:'rgba(255,255,255,0.9)', fontSize:14 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#FFE58A', flexShrink:0 }} />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        backgroundColor:'#FFFAF6', padding:32 }}>
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}
          style={{ width:'100%', maxWidth:420 }}>

          {/* Mobile logo */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <Link to="/" style={{ textDecoration:'none', display:'inline-block' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
                <img src="/logo.svg" alt="ADYAPAN" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover' }} />
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
          {!gsiReady && (
            <button
              type="button"
              onClick={() => window.google?.accounts?.id ? window.google.accounts.id.prompt() : window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token&scope=email%20profile`)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '11px 16px', borderRadius: 999,
                border: '1.5px solid #dadce0', background: '#fff',
                fontSize: 14, fontWeight: 600, color: '#3c4043', cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          )}

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
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </div>
  );
}
