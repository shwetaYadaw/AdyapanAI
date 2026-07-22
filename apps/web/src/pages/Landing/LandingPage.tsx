import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Brain, Target, Award, Users, Briefcase, TrendingUp, PlayCircle,
  CheckCircle2, ArrowRight, Sparkles, Code, BarChart, Star, Zap,
  BookOpen, GraduationCap, Building2, Shield
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';

// ── Brand colours ─────────────────────────────────────────────────────────
const ORANGE  = '#E85D04';
const AMBER   = '#F48C06';
const AMBER_L = '#FAA307';
const CREAM   = '#FFF8F3';

const STATS = [
  { value: '50,000+', label: 'Active Students',   icon: Users       },
  { value: '1,000+',  label: 'Practice Problems',  icon: Code        },
  { value: '95%',     label: 'Placement Rate',     icon: TrendingUp  },
  { value: '500+',    label: 'Hiring Partners',    icon: Building2   },
];

const FEATURES = [
  { icon: Brain,      title: 'AI-Powered Learning',      color: '#E85D04', desc: 'Personalised AI tutor, quiz generator, flashcards, mind maps and study plans.' },
  { icon: Target,     title: 'Placement Preparation',    color: '#F48C06', desc: 'Mock interviews, aptitude tests, resume builder with ATS scoring.' },
  { icon: Briefcase,  title: 'Job Portal',               color: '#FAA307', desc: 'Apply to 500+ curated jobs and internships matched by AI.' },
  { icon: Code,       title: 'DSA Practice Arena',       color: '#E85D04', desc: 'Solve topic-wise DSA problems to master algorithms and coding fundamentals.' },
  { icon: Award,      title: 'Verified Certificates',    color: '#F48C06', desc: 'Topic-wise and major DSA placement preparation certificates.' },
  { icon: GraduationCap, title: 'MNC Preparation Tracks',color: '#FAA307', desc: 'Focused test sheets and practice modules for TCS, Infosys, and top MNCs.' },
];

const COURSES_PREVIEW = [
  { title: 'TCS NQT Preparation Sheet',      students: '12.4K', rating: 4.9, price: 'Free', category: 'MNC Prep' },
  { title: 'Arrays & Matrix Problems',        students: '8.2K',  rating: 4.8, price: 'Free', category: 'DSA' },
  { title: 'Quantitative Aptitude Test',      students: '6.1K',  rating: 4.7, price: 'Free', category: 'Aptitude' },
  { title: 'Strings & Hashing Algorithms',    students: '15K',   rating: 4.9, price: 'Free', category: 'DSA' },
  { title: 'Logical Reasoning Challenge',     students: '4.5K',  rating: 4.6, price: 'Free', category: 'Aptitude' },
  { title: 'Dynamic Programming Masterlist',   students: '9.8K',  rating: 4.9, price: 'Free', category: 'DSA' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  role: 'SDE at Google',          text: "ADYAPAN's AI mock interviews and DSA roadmap got me placed at Google. The platform is genuinely different." },
  { name: 'Rahul Verma',   role: 'Sales Manager at HubSpot', text: 'The non-tech sales courses and LinkedIn optimizer completely transformed my career trajectory.'           },
  { name: 'Ananya Singh',  role: 'Data Analyst at Flipkart', text: 'The AI skill gap analysis showed me exactly what to learn. Got placed within 3 months of joining.'      },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay }}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: CREAM, color: '#1A0A00' }}>
      <Navbar />
      <Toaster position="top-right" />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 100%)', paddingTop: 72, paddingBottom: 96, overflow: 'hidden', position: 'relative' }}>
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, borderRadius:'50%', background:'rgba(232,93,4,0.07)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:300, height:300, borderRadius:'50%', background:'rgba(250,163,7,0.07)', filter:'blur(50px)', pointerEvents:'none' }} />

        <div className="page-container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', maxWidth:720, margin:'0 auto' }}>

            {/* Badge */}
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(232,93,4,0.1)', border:'1px solid rgba(232,93,4,0.25)', borderRadius:999, padding:'6px 18px', marginBottom:24 }}>
              <Sparkles size={14} color={ORANGE} />
              <span style={{ fontSize:13, fontWeight:600, color:ORANGE }}>India's #1 AI-Powered Career Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.6 }}
              style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'clamp(36px,6vw,64px)', lineHeight:1.15, marginBottom:20, color:'#1A0A00' }}>
              From{' '}
              <span style={{ background:'linear-gradient(135deg, #E85D04, #FAA307)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Learning
              </span>{' '}to{' '}
              <span style={{ background:'linear-gradient(135deg, #F48C06, #E85D04)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Placement
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.6 }}
              style={{ fontSize:'clamp(15px,2vw,18px)', color:'#7C4A1E', maxWidth:560, margin:'0 auto 36px', lineHeight:1.7 }}>
              ADYAPAN is an AI-powered DSA practice and placement preparation ecosystem. Aiming for top MNCs like TCS? Master your coding challenges, aptitude tests, and get hired.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:48 }}>
              <Link to="/register" className="btn-primary" style={{ fontSize:16, padding:'14px 36px', display:'inline-flex', alignItems:'center', gap:8 }}>
                Start for Free <ArrowRight size={18} />
              </Link>
              <Link to="/student/challenges" className="btn-secondary" style={{ fontSize:16, padding:'13px 36px', display:'inline-flex', alignItems:'center', gap:8 }}>
                <Code size={18} /> Solve DSA Problems
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              style={{ display:'flex', flexWrap:'wrap', gap:20, justifyContent:'center', fontSize:13, color:'#7C4A1E' }}>
              {['No credit card required','1,000+ DSA problems','95% placement rate'].map(t=>(
                <span key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <CheckCircle2 size={15} color="#22c55e" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginTop:64, maxWidth:760, margin:'64px auto 0' }}>
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4+i*0.08 }}
                style={{ background:'#fff', border:'1px solid #F5E4D4', borderRadius:16, padding:'20px 16px', textAlign:'center', boxShadow:'0 2px 12px rgba(232,93,4,0.08)' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#E85D04,#FAA307)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                  <s.icon size={18} color="#fff" />
                </div>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, color:'#1A0A00', margin:'0 0 2px' }}>{s.value}</p>
                <p style={{ fontSize:12, color:'#7C4A1E', margin:0 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ padding:'80px 0', backgroundColor:'#fff' }}>
        <div className="page-container">
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <span className="badge badge-orange" style={{ marginBottom:12 }}>Platform Features</span>
              <h2 className="section-title" style={{ marginBottom:12 }}>Everything you need to get hired</h2>
              <p style={{ color:'#7C4A1E', maxWidth:500, margin:'0 auto', fontSize:15 }}>
                One platform — 1,000+ DSA problems, MNC mock assessments, aptitude tests, and a live job portal.
              </p>
            </div>
          </FadeIn>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i*0.07}>
                <motion.div whileHover={{ y:-4, boxShadow:'0 12px 32px rgba(232,93,4,0.12)' }}
                  className="card" style={{ padding:24, cursor:'default' }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${f.color},${AMBER_L})`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <f.icon size={22} color="#fff" />
                  </div>
                  <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16, marginBottom:8, color:'#1A0A00' }}>{f.title}</h3>
                  <p style={{ fontSize:14, color:'#7C4A1E', lineHeight:1.6, margin:0 }}>{f.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES PREVIEW ───────────────────────────────────────────── */}
      <section style={{ padding:'80px 0', background:'linear-gradient(180deg,#FFF8F0 0%,#FFF0E0 100%)' }}>
        <div className="page-container">
          <FadeIn>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:48, flexWrap:'wrap', gap:12 }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom:10 }}>Popular Tracks</span>
                <h2 className="section-title">Top-rated practice modules</h2>
              </div>
              <Link to="/student/challenges" style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, fontWeight:600, color:ORANGE, textDecoration:'none' }}>
                View all <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:18 }}>
            {COURSES_PREVIEW.map((c, i) => (
              <FadeIn key={c.title} delay={i*0.06}>
                <motion.div whileHover={{ y:-4 }} className="card" style={{ overflow:'hidden', cursor:'pointer' }}>
                  {/* colored top bar */}
                  <div style={{ height:6, background:`linear-gradient(90deg,${ORANGE},${AMBER_L})` }} />
                  <div style={{ padding:18 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <span className="badge badge-orange">{c.category}</span>
                      <span style={{ fontWeight:700, fontSize:15, color:'#1A0A00' }}>{c.price}</span>
                    </div>
                    <h3 style={{ fontWeight:600, fontSize:14, lineHeight:1.4, marginBottom:12, color:'#1A0A00' }}>{c.title}</h3>
                    <div style={{ display:'flex', gap:14, fontSize:12, color:'#7C4A1E' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:3 }}><Star size={12} fill={AMBER} color={AMBER} /> {c.rating}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:3 }}><Users size={12} /> {c.students}</span>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI HIGHLIGHT ──────────────────────────────────────────────── */}
      <section style={{ padding:'88px 0', background:'linear-gradient(135deg,#E85D04 0%,#F48C06 60%,#FAA307 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundImage:'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)', pointerEvents:'none' }} />
        <div className="page-container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <FadeIn>
              <div>
                <span style={{ display:'inline-block', background:'rgba(255,255,255,0.2)', color:'#fff', padding:'4px 14px', borderRadius:999, fontSize:12, fontWeight:700, marginBottom:20, border:'1px solid rgba(255,255,255,0.3)' }}>
                  AI-Powered Features
                </span>
                <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'clamp(26px,3vw,38px)', color:'#fff', marginBottom:18, lineHeight:1.2 }}>
                  Your personal AI career coach — 24/7
                </h2>
                <p style={{ color:'rgba(255,255,255,0.85)', lineHeight:1.7, marginBottom:28, fontSize:15 }}>
                  From explaining concepts to analyzing your resume, generating interview questions, building study plans, and recommending the right career path.
                </p>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 32px', display:'flex', flexDirection:'column', gap:10 }}>
                  {['AI Tutor & Chatbot','PDF Chat & Notes Generator','Mock Interview Coach','Resume Analyzer & ATS Scorer','Skill Gap Analysis','Career Recommendation Engine'].map(item=>(
                    <li key={item} style={{ display:'flex', alignItems:'center', gap:10, color:'#fff', fontSize:14 }}>
                      <CheckCircle2 size={16} color="#FFF176" style={{ flexShrink:0 }} /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/student/ai" className="btn-white" style={{ fontSize:15, padding:'13px 32px', display:'inline-flex', alignItems:'center', gap:8 }}>
                  Try AI Features Free <ArrowRight size={16} />
                </Link>
              </div>
            </FadeIn>

            {/* AI Demo Card */}
            <FadeIn delay={0.15}>
              <div style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:20, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Brain size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ color:'#fff', fontWeight:700, fontSize:14, margin:0 }}>ADYAPAN AI</p>
                    <p style={{ color:'rgba(255,255,255,0.65)', fontSize:11, margin:0 }}>Career Intelligence Engine</p>
                  </div>
                  <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#90EE90' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#90EE90', display:'inline-block' }} /> Online
                  </span>
                </div>
                {[
                  { q:'What skills do I need for SDE at Amazon?', a:'Focus on DSA (LeetCode Medium+), System Design, OOP, and behavioral prep using STAR method...' },
                  { q:'Analyze my resume for ATS score',           a:'Resume Score: 72/100. Add quantified achievements and missing keywords: Docker, CI/CD...' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom:i===0?14:0 }}>
                    <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:12, padding:'10px 14px', fontSize:13, color:'rgba(255,255,255,0.85)', textAlign:'right', marginBottom:8 }}>{item.q}</div>
                    <div style={{ background:'rgba(255,255,255,0.22)', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#fff', lineHeight:1.5 }}>{item.a}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section style={{ padding:'80px 0', backgroundColor:'#fff' }}>
        <div className="page-container">
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <span className="badge badge-green" style={{ marginBottom:12 }}>Success Stories</span>
              <h2 className="section-title">Students who made it</h2>
            </div>
          </FadeIn>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:20 }}>
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i*0.08}>
                <div className="card" style={{ padding:24 }}>
                  <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                    {Array.from({length:5}).map((_,j)=><Star key={j} size={15} fill={AMBER} color={AMBER} />)}
                  </div>
                  <p style={{ fontSize:14, color:'#4A2800', lineHeight:1.7, marginBottom:20 }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${ORANGE},${AMBER_L})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:16 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:14, color:'#1A0A00', margin:'0 0 2px' }}>{t.name}</p>
                      <p style={{ fontSize:12, color:'#7C4A1E', margin:0 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section style={{ padding:'72px 0', background:'linear-gradient(135deg,#FFF8F0 0%,#FFE8CC 100%)' }}>
        <div className="page-container" style={{ textAlign:'center' }}>
          <FadeIn>
            <h2 className="section-title" style={{ marginBottom:16 }}>Ready to get placement-ready?</h2>
            <p style={{ color:'#7C4A1E', marginBottom:32, fontSize:16 }}>Join 50,000+ students building their careers with ADYAPAN. Start free today.</p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ fontSize:16, padding:'14px 36px' }}>Create Free Account</Link>
              <Link to="/courses" className="btn-secondary" style={{ fontSize:16, padding:'13px 36px' }}>Browse Courses</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ background:'#1A0A00', color:'rgba(255,255,255,0.7)', padding:'56px 0 28px' }}>
        <div className="page-container">
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#E85D04,#FAA307)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#fff', fontWeight:900, fontSize:12 }}>ady.</span>
                </div>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#fff' }}>ADYAPAN</span>
              </div>
              <p style={{ fontSize:13, lineHeight:1.6, color:'rgba(255,255,255,0.55)', maxWidth:220 }}>
                AI-Powered Career Development Ecosystem. From learning to placement.
              </p>
            </div>
            {[
              { title:'Platform', links:['Courses','Placement','Mentors','Jobs','Community'] },
              { title:'Company',  links:['About','Blog','Careers','Contact'] },
              { title:'Legal',    links:['Privacy','Terms','Refund Policy'] },
            ].map(col=>(
              <div key={col.title}>
                <h4 style={{ fontWeight:700, fontSize:13, color:'#fff', marginBottom:14, textTransform:'uppercase', letterSpacing:1 }}>{col.title}</h4>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
                  {col.links.map(l=>(
                    <li key={l}><a href="#" style={{ fontSize:13, color:'rgba(255,255,255,0.55)', textDecoration:'none', transition:'color 0.15s' }}
                      onMouseEnter={e=>(e.currentTarget.style.color='#FAA307')}
                      onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.55)')}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <p style={{ fontSize:12, margin:0 }}>© {new Date().getFullYear()} ADYAPAN. All rights reserved.</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(255,255,255,0.5)' }}>
              <Shield size={12} /> Secure &amp; GDPR Compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
