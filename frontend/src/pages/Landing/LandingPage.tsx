import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, BookOpen, Video, Trophy } from 'lucide-react';
import Navbar from '../../shared/components/Navbar/Navbar';
import Footer from '../../shared/components/Footer/Footer';
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
      <Toaster position="top-center" />

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

      {/* Feature Section with New Image */}
      <section style={{
        width: '100%',
        backgroundImage: 'url(/feature-section.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px',
      }}>
        {/* Background Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }} />

        {/* Main Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
        }}>
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            style={{
              textAlign: 'center',
            }}
          >
            <h2 style={{
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 16px',
              letterSpacing: '-1px',
            }}>
              FROM IDEA TO SHIP IT! LEARNING MADE REAL.
            </h2>
          </motion.div>

          {/* Central Course Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 40px)',
              textAlign: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <h3 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 20px',
            }}>
              VIBE CODING: MASTER THE STACK
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, #7C3AED, #A855F7)`,
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Enroll in Course →
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            width: '100%',
          }}>
            {/* VS Code & Plugins */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: false }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                VS Code & Plugins
              </h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Python Debugger', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                  { label: 'Bash Shell', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg' },
                  { label: 'Terminal', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
                  { label: 'Git Lens', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
                  { label: 'Live Share', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: 14, height: 14 }} />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* React & State Management */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: false }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                React & State Management
              </h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'GraphQL Client', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
                  { label: 'SSR & Next.js', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
                  { label: 'React Hooks', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                  { label: 'Redux', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
                  { label: 'Components', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: 14, height: 14 }} />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Planning & Workflow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: false }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                Planning & Workflow
              </h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Jira Boards', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg' },
                  { label: 'Kanban Flow', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg' },
                  { label: 'PR Checklists', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
                  { label: 'Workspace Docs', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg' },
                  { label: 'Team Communication', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: 14, height: 14 }} />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Primary Languages & Frameworks */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: false }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                Primary Languages & Frameworks
              </h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Python', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                  { label: 'JavaScript', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
                  { label: 'TypeScript', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
                  { label: 'Kotlin', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
                  { label: 'Android Dev', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
                  { label: 'C++', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: 14, height: 14 }} />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Dev Tools & Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: false }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                Dev Tools & Architecture
              </h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Chrome DevTools', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' },
                  { label: 'Postman', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
                  { label: 'Architecture', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
                  { label: 'Cloud', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonaws/amazonaws-original.svg' },
                  { label: 'Docker', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: 14, height: 14 }} />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Error Handling */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: false }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                Error Handling Modules
              </h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {[
                  { label: 'Error Handling', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                  { label: 'Sentry', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sentry/sentry-original.svg' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: 14, height: 14 }} />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact & FAQ Section */}
      <section style={{
        width: '100%',
        padding: '60px 20px',
        backgroundImage: 'url(/contact-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(250, 250, 250, 0.85)',
          zIndex: 0,
        }} />
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 900,
              color: '#1a1a1a',
              margin: '0 0 12px',
            }}>
              Send Us a Message
            </h2>
            <p style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#666',
              marginBottom: '32px',
              margin: '0 0 32px',
            }}>
              Fill out the form and we'll get back to you shortly.
            </p>

            <form style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {/* Name and Email Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a4a4a',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a4a4a',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                    }}
                  />
                </div>
              </div>

              {/* Phone and Subject Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a4a4a',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#4a4a4a',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Subject *
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                    }}
                  >
                    <option>Select a topic</option>
                    <option>Enrollment</option>
                    <option>Technical Support</option>
                    <option>General Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#4a4a4a',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Message *
                </label>
                <textarea
                  placeholder="Tell us how we can help..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff',
                    color: '#1a1a1a',
                    minHeight: '120px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  padding: '14px 32px',
                  background: '#FFA500',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                }}
              >
                ✈️ Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Right: FAQ & Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
            }}
          >
            {/* Quick Answers */}
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontWeight: 900,
                color: '#1a1a1a',
                margin: '0 0 12px',
              }}>
                Quick Answers
              </h2>
              <p style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#666',
                margin: '0 0 24px',
              }}>
                Common questions from students
              </p>

              {/* FAQ Accordion */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {[
                  { q: 'How do I enroll in a course?', a: 'Click on any course and follow the enrollment process.' },
                  { q: 'Are classes live or recorded?', a: 'We offer both live and recorded sessions for flexibility.' },
                  { q: 'Do you provide placement support?', a: 'Yes, we have dedicated placement assistance.' },
                  { q: 'Can I get a refund?', a: 'Refunds are available within 7 days of enrollment.' },
                ].map((item, i) => (
                  <motion.details
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: false }}
                    style={{
                      cursor: 'pointer',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <summary style={{
                      padding: '16px',
                      background: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#1a1a1a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      listStyle: 'none',
                      userSelect: 'none',
                    }}>
                      <span>{item.q}</span>
                      <span style={{ fontSize: '18px' }}>▼</span>
                    </summary>
                    <div style={{
                      padding: '16px',
                      background: '#f5f5f5',
                      borderTop: '1px solid #e0e0e0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      lineHeight: '1.6',
                    }}>
                      {item.a}
                    </div>
                  </motion.details>
                ))}
              </div>
            </div>


          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
