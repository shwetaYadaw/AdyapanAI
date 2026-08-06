import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, BookOpen, Video, Trophy, Sparkles, Zap, ChevronDown, CheckCircle2, MessageSquare, Mail, Phone } from 'lucide-react';
import Navbar from '../../shared/components/Navbar/Navbar';
import Footer from '../../shared/components/Footer/Footer';
import { Toaster } from 'react-hot-toast';

// Reusable Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-brand-orange selection:text-white overflow-x-hidden">
      <Navbar />
      <Toaster position="top-center" />

      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Image with Parallax & Heavy Overlay for Contrast */}
        <div 
          className="absolute inset-0 z-0 bg-[url('/mainpage-bg.png')] bg-cover bg-center bg-fixed"
        />
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-950/90 via-gray-950/80 to-gray-950/95 dark:from-black/90 dark:via-black/80 dark:to-black/95 backdrop-blur-[2px]" />
        
        {/* Animated Glow Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-orange/30 rounded-full blur-[100px] z-0 pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-32 w-[30rem] h-[30rem] bg-brand-amber/20 rounded-full blur-[120px] z-0 pointer-events-none" 
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Copy */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="max-w-2xl text-center lg:text-left"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">The New Standard in Tech Ed</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 font-display tracking-tight">
              Master <span className="text-transparent bg-clip-text bg-gradient-brand">Coding.</span><br />
              Build Your Future.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              From foundational Data Structures to advanced Full Stack Development. Equip yourself with the skills that top tech companies are actively hiring for.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/get-started" 
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-brand hover:bg-gradient-brand-r text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-brand hover:shadow-brand-glow active:scale-95"
              >
                Start Learning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="#courses" 
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-md hover:border-white/20"
              >
                View Curriculum
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
              {[
                { label: 'Active Students', value: '10k+' },
                { label: 'Coding Problems', value: '500+' },
                { label: 'Placement Rate', value: '94%' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-black text-white">{stat.value}</span>
                  <span className="text-sm font-medium text-gray-400 mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Floating Interface Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", damping: 20 }}
            className="hidden lg:block relative perspective-1000"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900/50 backdrop-blur-xl transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
              {/* Mockup Header */}
              <div className="h-12 bg-gray-800/80 border-b border-gray-700/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              {/* Code Snippet */}
              <div className="p-6 font-mono text-sm leading-relaxed text-gray-300">
                <div className="text-blue-400">export default function</div> <span className="text-yellow-300">Developer</span>() {'{'}
                <div className="pl-4 mt-2">
                  <span className="text-purple-400">const</span> skills = <span className="text-blue-300">useAdyapan</span>();
                </div>
                <div className="pl-4 mt-4">
                  <span className="text-purple-400">if</span> (skills.isMastered) {'{'}
                  <div className="pl-4 text-green-400">return {'<DreamJob />'};</div>
                  {'}'}
                </div>
                <div className="pl-4 mt-4">
                  <span className="text-gray-500">// Start your journey today</span><br/>
                  <span className="text-blue-400">return</span> {'<KeepCoding />'};
                </div>
                {'}'}
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold">Code Passed!</p>
                <p className="text-gray-300 text-sm">All test cases successful</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────────── */}
      <section id="courses" className="py-24 bg-white dark:bg-gray-950 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 font-display">
              Everything you need to <span className="text-brand-orange">succeed</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-600 dark:text-gray-400">
              We've crafted a comprehensive ecosystem designed specifically to take you from a beginner to an industry-ready professional.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Code2, title: 'Interactive Coding', desc: 'Write, run, and test code directly in your browser with our integrated development environment.', color: 'from-blue-500 to-cyan-400' },
              { icon: BookOpen, title: 'Structured Curriculum', desc: 'Step-by-step learning paths covering DSA, web development, and system design.', color: 'from-brand-orange to-brand-amber' },
              { icon: Video, title: 'Video Lectures', desc: 'In-depth video tutorials explaining complex concepts with clear, visual examples.', color: 'from-purple-500 to-pink-500' },
              { icon: Trophy, title: 'Weekly Contests', desc: 'Compete with peers globally to improve your problem-solving speed and logic.', color: 'from-yellow-400 to-orange-500' },
              { icon: Zap, title: 'Instant Feedback', desc: 'Get immediate, detailed feedback on your code submissions to fix errors fast.', color: 'from-green-400 to-emerald-600' },
              { icon: CheckCircle2, title: 'Placement Prep', desc: 'Specialized modules for TCS NQT, aptitude tests, and top MNC interview preparation.', color: 'from-rose-400 to-red-500' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Glow behind icon */}
                <div className={`absolute top-8 left-8 w-12 h-12 rounded-full bg-gradient-to-tr ${feature.color} opacity-20 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
                
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARALLAX BANNER ───────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden bg-brand-950">
        <div className="absolute inset-0 bg-[url('/feature-section.png')] bg-cover bg-center bg-fixed opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/90 to-purple-900/90 mix-blend-multiply" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto backdrop-blur-md bg-white/5 border border-white/20 p-12 lg:p-16 rounded-3xl shadow-2xl"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">
              FROM IDEA TO SHIP IT!
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Stop watching tutorials passively. Start vibing with code. Build real-world projects that actually look good on your resume.
            </p>
            <Link 
              to="/get-started" 
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-brand-orange hover:bg-gray-50 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-brand-glow"
            >
              Enroll in Premium Course
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ & CONTACT SECTION ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 lg:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-display">Send Us a Message</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Have a question? We're here to help you out.</p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all dark:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all dark:text-white appearance-none">
                  <option>Select a topic...</option>
                  <option>Enrollment Query</option>
                  <option>Technical Support</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all dark:text-white resize-none" />
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-brand hover:bg-gradient-brand-r text-white rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-brand-glow active:scale-[0.98]">
                <Mail className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Right: FAQ */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 font-display">Quick Answers</h2>
              <p className="text-gray-600 dark:text-gray-400">Everything you need to know about the platform.</p>
            </div>

            <div className="space-y-4">
              {[
                { q: 'How do I enroll in a course?', a: 'Simply sign up for a free account, browse the curriculum, and click "Enroll" on any module. Most basic modules are free to start!' },
                { q: 'Are classes live or pre-recorded?', a: 'We offer a hybrid approach! Core concepts are pre-recorded in high quality, while weekly doubt sessions and contest discussions are conducted live.' },
                { q: 'Is there placement support?', a: 'Yes! Students who complete our advanced track get access to our dedicated placement portal, resume reviews, and mock interviews.' },
                { q: 'Can I access the platform on mobile?', a: 'Absolutely. Our platform is fully responsive. You can solve MCQs, watch videos, and read materials on your phone. For coding, we recommend a desktop.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-gray-900 dark:text-white select-none">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700/50 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
            
            <div className="mt-12 flex items-center gap-6 p-6 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
              <div className="w-12 h-12 bg-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Still have questions?</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">+91 (800) 123-4567</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
