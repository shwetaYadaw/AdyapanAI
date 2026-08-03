import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { toggleDarkMode } from '../../../features/ui/uiSlice';

const ORANGE = '#E85D04';
const AMBER  = '#F48C06';

export default function AuthNavbar() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      background: darkMode ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.5)',
    }}>
      <div style={{
        padding: '0 24px',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `linear-gradient(135deg,${ORANGE},${AMBER})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <span style={{
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 900,
                fontSize: 14,
                color: '#fff',
              }}>ady.</span>
            </motion.div>
            <span style={{
              fontFamily: 'Poppins,sans-serif',
              fontWeight: 800,
              fontSize: 18,
              color: darkMode ? '#fff' : '#1A0A00',
            }}>ADYAPAN</span>
          </Link>

          {/* Center Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 24,
          }} className="hidden-mobile">
            {[
              { label: 'About', href: '#about' },
              { label: 'Careers', href: '/careers' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(124,74,30,0.8)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = ORANGE}
                onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(124,74,30,0.8)'}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleDarkMode())}
              style={{
                padding: 8,
                borderRadius: 8,
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#FFE58A' : ORANGE,
                transition: 'all 0.2s',
              }}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Auth Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16 }}>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: darkMode ? '#fff' : '#1A0A00',
                  borderRadius: 8,
                  background: 'transparent',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.color = ORANGE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
                  e.currentTarget.style.color = darkMode ? '#fff' : '#1A0A00';
                }}
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                style={{
                  textDecoration: 'none',
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  borderRadius: 8,
                  background: `linear-gradient(135deg,${ORANGE},${AMBER})`,
                  border: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(232, 93, 4, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(232, 93, 4, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 93, 4, 0.3)';
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
