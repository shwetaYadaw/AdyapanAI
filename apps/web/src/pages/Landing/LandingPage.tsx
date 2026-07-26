import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

export default function LandingPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [terminalText, setTerminalText] = React.useState('');
  const fullText = 'Generate a React component for a responsive dashboard with dark mode and user authentication — include a top navigation bar and a sidebar that adapts on mobile |';

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTerminalText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: '👥', value: '50,000+', label: 'Active Students' },
    { icon: '💻', value: '1,000+', label: 'Practice Problems' },
    { icon: '📈', value: '95%', label: 'Placement Rate' },
    { icon: '🏢', value: '500+', label: 'Hiring Partners' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FFFFFF', display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Toaster position="top-right" />

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #FDF5F0 0%, #F5EAFF 50%, #EBD5FF 100%)',
        paddingTop: 80,
        paddingBottom: 80,
        overflow: 'hidden',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        flex: 1
      }}>
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(200, 150, 255, 0.1)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(100, 150, 255, 0.08)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1300px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '20px', paddingRight: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 60,
            alignItems: 'center',
            maxWidth: '100%',
            width: '100%'
          }}>

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 107, 53, 0.1)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: 999,
                padding: '8px 16px',
                marginBottom: 32,
                fontSize: 12,
                fontWeight: 600,
                color: '#FF6B35'
              }}>
                ✨ India's #1 AI-Powered Career Platform
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 900,
                fontSize: 64,
                lineHeight: 1.1,
                marginBottom: 24,
                color: '#1A0A2E'
              }}>
                From{' '}
                <span style={{ color: '#FF6B35' }}>Learning</span>
                {' '}to{' '}
                <span style={{ color: '#FF6B35' }}>Placement</span>
              </h1>

              {/* Description */}
              <p style={{
                fontSize: 16,
                color: '#4A3B5C',
                lineHeight: 1.8,
                marginBottom: 32,
                maxWidth: 480
              }}>
                ADYAPAN is an AI-powered DSA practice and placement preparation ecosystem. Aiming for top MNCs like TCS? Master your coding challenges, aptitude tests, and get hired.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 40 }}>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    padding: '14px 32px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    background: '#FF6B35',
                    color: '#fff',
                    borderRadius: 50,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Start for Free <ArrowRight size={18} />
                </Link>

                <Link
                  to="/student/challenges"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    padding: '14px 32px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    background: 'transparent',
                    color: '#FF6B35',
                    border: '2px solid #FF6B35',
                    borderRadius: 50,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF6B35';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#FF6B35';
                  }}
                >
                  <Code size={18} /> Solve DSA Problems
                </Link>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: '#4A3B5C' }}>
                {['No credit card required', '1,000+ DSA problems', '95% placement rate'].map((text) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={16} color="#22c55e" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative' }}
            >
              {/* Terminal Card */}
              <div style={{
                background: '#1E1B3F',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 107, 53, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Terminal Header */}
                <div style={{
                  background: '#16132A',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 107, 53, 0.1)'
                }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C940' }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>ADYAPAN Terminal</span>
                  <div />
                </div>

                {/* Terminal Tabs */}
                <div style={{
                  display: 'flex',
                  gap: 24,
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
                  background: '#1E1B3F'
                }}>
                  {['AI Writer', 'Templates', 'Shorten', 'Rephrase'].map((tab, i) => (
                    <span
                      key={tab}
                      style={{
                        fontSize: 13,
                        color: i === 0 ? '#FF6B35' : '#999',
                        borderBottom: i === 0 ? '2px solid #FF6B35' : 'none',
                        paddingBottom: 6,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: i === 0 ? 600 : 400
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>

                {/* Terminal Content */}
                <div style={{
                  padding: '20px 16px',
                  minHeight: 120,
                  fontFamily: 'Monaco, monospace',
                  fontSize: 13,
                  lineHeight: 1.6
                }}>
                  <span style={{ color: '#FF6B35' }}>{terminalText}</span>
                </div>

                {/* Language Selector */}
                <div style={{
                  display: 'flex',
                  gap: 12,
                  padding: '16px',
                  borderTop: '1px solid rgba(255, 107, 53, 0.1)',
                  background: '#16132A'
                }}>
                  {[
                    { label: '⚛️ React', active: true },
                    { label: '📝 Concise', active: false },
                    { label: '🔹 TypeScript', active: false }
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        border: btn.active ? '1px solid #FF6B35' : '1px solid rgba(255, 107, 53, 0.2)',
                        background: btn.active ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                        color: btn.active ? '#FF6B35' : '#999',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!btn.active) {
                          e.currentTarget.style.borderColor = '#FF6B35';
                          e.currentTarget.style.color = '#FF6B35';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!btn.active) {
                          e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
                          e.currentTarget.style.color = '#999';
                        }
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div style={{
                position: 'absolute',
                bottom: -40,
                right: -40,
                width: 200,
                height: 200,
                background: 'rgba(255, 107, 53, 0.05)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }} />
            </motion.div>

          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginTop: 80,
              width: '100%',
              maxWidth: '100%'
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: '28px 20px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  margin: '0 auto 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(100, 150, 255, 0.1))'
                }}>
                  {stat.icon}
                </div>
                <h3 style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#1A0A2E',
                  margin: '0 0 6px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: '#999',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{
        background: '#1A0A2E',
        color: 'rgba(255,255,255,0.7)',
        padding: '48px 0 24px'
      }}>
        <div className="page-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 40,
            marginBottom: 32
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#FF6B35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                  color: '#fff'
                }}>
                  ady.
                </div>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 16, color: '#fff' }}>
                  ADYAPAN
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>
                AI-Powered Career Development Ecosystem. From learning to placement.
              </p>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12
          }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} ADYAPAN. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
