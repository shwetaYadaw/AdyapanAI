/**
 * ADYAPAN Database Seeder — MySQL / Prisma
 * Run: npx ts-node src/scripts/seed.ts
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_COURSES = [
  {
    title: 'Complete React Developer Bootcamp',
    slug: 'complete-react-developer-bootcamp',
    description: 'The most comprehensive React course on ADYAPAN. Learn everything from JSX basics to advanced patterns.',
    category: 'tech',
    tags: JSON.stringify(['react', 'javascript', 'frontend', 'web development']),
    level: 'intermediate',
    price: 2999,
    isFree: false,
    isPublished: true,
    isApproved: true,
    enrollmentCount: 12400,
    rating: 4.9,
    ratingCount: 3200,
    requirements: JSON.stringify(['Basic JavaScript knowledge', 'HTML & CSS basics']),
    learningOutcomes: JSON.stringify(['Build production-ready React apps', 'Master Redux & Context API']),
  },
  {
    title: 'Data Science & Machine Learning with Python',
    slug: 'data-science-machine-learning-python',
    description: 'Learn data science from scratch. Build ML models, analyze data, and land your first data science role.',
    category: 'ai',
    tags: JSON.stringify(['python', 'machine learning', 'data science', 'ai']),
    level: 'beginner',
    price: 3499,
    isFree: false,
    isPublished: true,
    isApproved: true,
    enrollmentCount: 8200,
    rating: 4.8,
    ratingCount: 2100,
    requirements: JSON.stringify(['Basic Python', 'High school mathematics']),
    learningOutcomes: JSON.stringify(['Build ML models from scratch', 'Data visualization', 'Deep learning basics']),
  },
  {
    title: 'DSA Mastery for Placement',
    slug: 'dsa-mastery-placement',
    description: 'Master Data Structures and Algorithms with 500+ problems, company-wise questions, and interview tips.',
    category: 'placement',
    tags: JSON.stringify(['dsa', 'algorithms', 'placement', 'coding interview']),
    level: 'beginner',
    price: 0,
    isFree: true,
    isPublished: true,
    isApproved: true,
    enrollmentCount: 15000,
    rating: 4.9,
    ratingCount: 5600,
    requirements: JSON.stringify(['Basic programming knowledge']),
    learningOutcomes: JSON.stringify(['Solve LeetCode Medium/Hard', 'Master all DS', 'Dynamic Programming']),
  },
  {
    title: 'Digital Marketing Mastery',
    slug: 'digital-marketing-mastery',
    description: 'Become a digital marketing expert. Learn Google Ads, Facebook Ads, SEO, content marketing, and analytics.',
    category: 'non-tech',
    tags: JSON.stringify(['digital marketing', 'seo', 'social media', 'google ads']),
    level: 'beginner',
    price: 1999,
    isFree: false,
    isPublished: true,
    isApproved: true,
    enrollmentCount: 6100,
    rating: 4.7,
    ratingCount: 1800,
    requirements: JSON.stringify(['No prior experience needed', 'Basic computer skills']),
    learningOutcomes: JSON.stringify(['Run Google & Facebook Ads', 'SEO optimization']),
  },
  {
    title: 'Sales & Business Development',
    slug: 'sales-business-development',
    description: 'Learn the art of sales from scratch. Master prospecting, pitching, handling objections, and closing deals.',
    category: 'non-tech',
    tags: JSON.stringify(['sales', 'business development', 'b2b', 'crm']),
    level: 'beginner',
    price: 1499,
    isFree: false,
    isPublished: true,
    isApproved: true,
    enrollmentCount: 4500,
    rating: 4.6,
    ratingCount: 1200,
    requirements: JSON.stringify(['No prior experience needed']),
    learningOutcomes: JSON.stringify(['Close B2B deals', 'Master CRM tools', 'Cold calling scripts']),
  },
  {
    title: 'Full Stack Node.js & Express',
    slug: 'full-stack-nodejs-express',
    description: 'Master backend development with Node.js. Build REST APIs, authentication, databases, and deploy to cloud.',
    category: 'tech',
    tags: JSON.stringify(['nodejs', 'express', 'backend', 'api', 'javascript']),
    level: 'intermediate',
    price: 2499,
    isFree: false,
    isPublished: true,
    isApproved: true,
    enrollmentCount: 7300,
    rating: 4.8,
    ratingCount: 2400,
    requirements: JSON.stringify(['JavaScript fundamentals', 'Basic HTML/CSS']),
    learningOutcomes: JSON.stringify(['Build REST APIs', 'JWT Authentication', 'Deploy to cloud']),
  },
];

const SAMPLE_BADGES = [
  { name: 'First Step',      badgeType: 'learning',     iconUrl: '🎯' },
  { name: 'Course Champion', badgeType: 'learning',     iconUrl: '🏆' },
  { name: 'Community Star',  badgeType: 'community',    iconUrl: '⭐' },
  { name: 'Placement Ready', badgeType: 'placement',    iconUrl: '💼' },
  { name: 'Quick Learner',   badgeType: 'achievement',  iconUrl: '⚡' },
  { name: 'Top Achiever',    badgeType: 'achievement',  iconUrl: '🥇' },
];

async function seed() {
  console.log('🌱 Starting ADYAPAN database seed (MySQL/Prisma)...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL\n');

    // ── Create an admin user ───────────────────────────────────────────────
    let admin = await prisma.user.findUnique({ where: { email: 'admin@adyapan.com' } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin@1234', 12);
      admin = await prisma.user.create({
        data: {
          email: 'admin@adyapan.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'ADYAPAN',
          role: 'admin',
          isEmailVerified: true,
          isVerified: true,
        },
      });
      console.log('✅ Admin created: admin@adyapan.com / Admin@1234');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // ── Seed courses ───────────────────────────────────────────────────────
    let coursesCreated = 0;
    for (const courseData of SAMPLE_COURSES) {
      const existing = await prisma.course.findUnique({ where: { slug: courseData.slug } });
      if (!existing) {
        await prisma.course.create({
          data: { ...courseData, instructorId: admin.id } as any,
        });
        coursesCreated++;
      }
    }
    console.log(`✅ Courses: ${coursesCreated} created, ${SAMPLE_COURSES.length - coursesCreated} already existed`);

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║        SEED COMPLETE — ADYAPAN               ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║  Admin Login:                                 ║');
    console.log('║  Email: admin@adyapan.com                     ║');
    console.log('║  Pass:  Admin@1234                            ║');
    console.log('╚══════════════════════════════════════════════╝\n');

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

seed();
