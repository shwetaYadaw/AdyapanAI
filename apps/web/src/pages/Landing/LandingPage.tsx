import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, BookOpen, Video, Trophy } from 'lucide-react';
import Navbar from '../../components/layout/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';

const ORANGE = '#E85D04';

export default function LandingPage() {
  const features = [
    { icon: Code2, label: 'DSA', color: '#2E7D32' },
    { icon: Code2, label: 'C++', color: '#1976D2' },
    { icon: Code2, label: 'Java', color: '#F57C00' },
    { icon: Code2, label: 'Python', color: '#455A64' },
    { icon: Code2, label: 'Web Dev', color: '#D32F2F' },
    { icon: Code2, label: 'Full Stack', color: '#7B1FA2' },
  ];

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#0F0F0F',
    }}>
      <Navbar />
      <Toaster position="top-right" />

      {/* Hero Section */}
      <section style={{
        flex: 1,
        backgroundImage: 'url(/mainpage-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 80px',
      }}>
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 15, 15, 0.3)',
          zIndex: 0,
        }} />

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '600px',
          }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(232, 93, 4, 0.15)',
            border: '1px solid rgba(232, 93, 4, 0.3)',
            borderRadius: 999,
            padding: '8px 16px',
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 600,
            color: ORANGE,
          }}>
            <span style={{ fontSize: 16 }}>●</span> Learn. Code. Succeed.
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 900,
            fontSize: 72,
            lineHeight: 1.1,
            marginBottom: 24,
            color: '#000',
            margin: '0 0 24px 0',
          }}>
            Master <span style={{ color: ORANGE }}>Coding.</span>
            <br />
            Build Your Future.
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 16,
            color: '#333',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 500,
            margin: '0 0 40px 0',
          }}>
            From DSA to Full Stack Development – everything you need to become a top developer.
          </p>

          {/* CTA Button */}
          <Link
            to="/get-started"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: `linear-gradient(135deg, ${ORANGE}, #F48C06)`,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 50,
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(232, 93, 4, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(232, 93, 4, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(232, 93, 4, 0.3)';
            }}
          >
            Start Learning Now <ArrowRight size={18} />
          </Link>

          {/* Feature Icons */}
          <div style={{
            display: 'flex',
            gap: 24,
            marginTop: 48,
            alignItems: 'center',
          }}>
            {[
              { icon: '🎓', label: 'Students Learning' },
              { icon: '</>', label: 'Coding Problems' },
              { icon: '🎥', label: 'Detailed Video Courses' },
              { icon: '🏆', label: 'Placement Success' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{
                  fontSize: 28,
                  marginBottom: 4,
                }}>
                  {item.icon}
                </div>
                <p style={{
                  fontSize: 12,
                  color: '#666',
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: 500,
                }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quote Section */}
          <div style={{
            marginTop: 48,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${ORANGE}, #F48C06)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#fff',
            }}>
              "
            </div>
            <div>
              <p style={{
                fontSize: 15,
                color: '#333',
                fontStyle: 'italic',
                margin: '0 0 8px 0',
              }}>
                Code today, conquer tomorrow.
              </p>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: ORANGE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <ArrowRight size={20} color="#fff" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bottom Feature Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(232, 93, 4, 0.2)',
          borderRadius: '16px 16px 0 0',
          padding: '24px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 0,
        }}
      >
        {/* Course Tags */}
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}>
          {['DSA', 'C++', 'Java', 'Python', 'Web Dev', 'Full Stack'].map((course, i) => (
            <div
              key={i}
              style={{
                padding: '8px 14px',
                background: 'rgba(232, 93, 4, 0.1)',
                border: `1px solid rgba(232, 93, 4, 0.3)`,
                borderRadius: 8,
                color: ORANGE,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {course}
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <Link
          to="/student/coding-arena"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            background: `linear-gradient(135deg, ${ORANGE}, #F48C06)`,
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Explore Courses <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* Additional Hero Section with Full Image */}
      <section style={{
        backgroundImage: 'url(/hero-section.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
      </section>
    </div>
  );
}
