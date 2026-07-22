import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, CheckCircle2, GraduationCap, BookOpen, Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerThunk, selectAuthLoading, selectAuthError, clearError } from '../../features/auth/authSlice';
import { getPasswordStrength } from '@adyapan/shared';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  email:     z.string().email('Enter a valid email'),
  password:  z.string().min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Need an uppercase letter')
    .regex(/[a-z]/, 'Need a lowercase letter')
    .regex(/\d/,   'Need a number'),
  role:  z.enum(['student','teacher','recruiter']).default('student'),
  terms: z.boolean().refine(v => v, 'Please accept the terms'),
});
type FormData = z.infer<typeof schema>;

const ORANGE = '#E85D04';
const AMBER  = '#F48C06';

const ROLES = [
  { value:'student',   label:'Student',   desc:'I want to learn',      icon: GraduationCap },
  { value:'teacher',   label:'Teacher',   desc:'I want to teach',      icon: BookOpen      },
  { value:'recruiter', label:'Recruiter', desc:'I want to hire talent', icon: Briefcase     },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [registered,   setRegistered]   = useState(false);
  const dispatch  = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const navigate  = useNavigate();

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student', terms: false },
  });

  const password     = watch('password') ?? '';
  const selectedRole = watch('role');
  const strength     = getPasswordStrength(password);

  const strengthColor = ['#ef4444','#f97316','#eab308','#22c55e','#16a34a'][strength.score] ?? '#ef4444';

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerThunk({
      email: data.email, password: data.password,
      firstName: data.firstName, lastName: data.lastName, role: data.role,
    }));
    if (registerThunk.fulfilled.match(result)) {
      setRegistered(true);
      toast.success(import.meta.env.DEV ? 'Account created! You can now sign in.' : 'Account created! Check your email.');
    }
  };

  if (registered) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:'#FFFAF6', fontFamily:'Inter,sans-serif' }}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          style={{ background:'#fff', borderRadius:20, padding:48, maxWidth:420, width:'100%',
            textAlign:'center', border:'1px solid #F5E4D4', boxShadow:'0 8px 40px rgba(232,93,4,0.1)' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#22c55e,#16a34a)',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <CheckCircle2 size={36} color="#fff" />
          </div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:24, color:'#1A0A00', marginBottom:10 }}>
            {import.meta.env.DEV ? 'Account created!' : 'Check your email!'}
          </h2>
          <p style={{ color:'#7C4A1E', fontSize:14, lineHeight:1.6, marginBottom:28 }}>
            {import.meta.env.DEV
              ? 'Your account is ready. Sign in to start learning.'
              : "We've sent a verification link to your email address. Click it to activate your account and start learning."}
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ width:'100%', padding:14, fontSize:15 }}>
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'Inter,sans-serif' }}>

      {/* ── Left brand panel ── */}
      <div style={{ width:'38%', background:`linear-gradient(145deg,${ORANGE} 0%,${AMBER} 100%)`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:48, position:'relative', overflow:'hidden' }} className="hidden-mobile">
        <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,0.08)', top:-100, right:-80 }} />
        <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', bottom:-60, left:-60 }} />
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg,#FAA307,#FFCF5C)',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
            <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:20, color:'#7C2D00' }}>ady.</span>
          </div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:32, color:'#fff', letterSpacing:3, marginBottom:10 }}>ADYAPAN</h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:14, lineHeight:1.7, maxWidth:240, margin:'0 auto 32px' }}>
            Your AI-powered career development ecosystem. Join 50,000+ students.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {['Free to join','AI-powered learning','Placement support','Live mentorship'].map(t=>(
              <div key={t} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.9)', fontSize:13 }}>
                <CheckCircle2 size={14} color="#FFE58A" /> {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        backgroundColor:'#FFFAF6', padding:24, overflowY:'auto' }}>
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
          style={{ width:'100%', maxWidth:460, paddingTop:20, paddingBottom:20 }}>

          <div style={{ textAlign:'center', marginBottom:28 }}>
            <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${ORANGE},${AMBER})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:11, color:'#fff' }}>ady.</span>
              </div>
              <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#1A0A00' }}>ADYAPAN</span>
            </Link>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:22, color:'#1A0A00', margin:'14px 0 4px' }}>Create your free account</h2>
            <p style={{ color:'#7C4A1E', fontSize:13, margin:0 }}>Start your career journey today</p>
          </div>

          {authError && (
            <div style={{ background:'#FFF0E0', border:`1px solid ${ORANGE}`, borderRadius:12,
              padding:'12px 16px', marginBottom:18, color:ORANGE, fontSize:13 }}>
              ⚠️ {authError.includes('503') || authError.includes('Network') 
                ? 'Server is starting up. Please wait a moment and try again.' 
                : authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Name */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A2800', marginBottom:6 }}>First name <span style={{color:ORANGE}}>*</span></label>
                <input className="input-field" placeholder="Rahul" style={{width:'100%'}} {...register('firstName')} />
                {errors.firstName && <p style={{color:ORANGE,fontSize:11,marginTop:3}}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A2800', marginBottom:6 }}>Last name <span style={{color:ORANGE}}>*</span></label>
                <input className="input-field" placeholder="Sharma" style={{width:'100%'}} {...register('lastName')} />
                {errors.lastName && <p style={{color:ORANGE,fontSize:11,marginTop:3}}>{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A2800', marginBottom:6 }}>Email address <span style={{color:ORANGE}}>*</span></label>
              <input type="email" className="input-field" placeholder="you@example.com" style={{width:'100%'}} autoComplete="email" {...register('email')} />
              {errors.email && <p style={{color:ORANGE,fontSize:11,marginTop:3}}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A2800', marginBottom:6 }}>Password <span style={{color:ORANGE}}>*</span></label>
              <div style={{ position:'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="input-field"
                  placeholder="Min. 8 characters" style={{width:'100%', paddingRight:44}} autoComplete="new-password"
                  {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#B88A6A' }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop:6 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ flex:1, height:4, borderRadius:2,
                        background: i < strength.score ? strengthColor : '#F0D9C8', transition:'background 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize:11, color: strengthColor, margin:0 }}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p style={{color:ORANGE,fontSize:11,marginTop:3}}>{errors.password.message}</p>}
            </div>

            {/* Terms */}
            <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
              <input type="checkbox" style={{ marginTop:2, accentColor:ORANGE }} {...register('terms')} />
              <span style={{ fontSize:13, color:'#7C4A1E', lineHeight:1.5 }}>
                I agree to the{' '}
                <a href="#" style={{ color:ORANGE, fontWeight:600, textDecoration:'none' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color:ORANGE, fontWeight:600, textDecoration:'none' }}>Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p style={{color:ORANGE,fontSize:11,marginTop:-10}}>{errors.terms.message}</p>}

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary"
              style={{ width:'100%', padding:14, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {isLoading ? (
                <span style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block'}} />
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'#7C4A1E', marginTop:20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:ORANGE, fontWeight:700, textDecoration:'none' }}>Sign in</Link>
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
