/**
 * View All Questions in Database
 * 
 * This script displays all questions from both Question and Problem tables
 * with filtering options.
 * 
 * Usage:
 *   npx ts-node src/scripts/viewAllQuestions.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function viewQuestions() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                    DATABASE QUESTIONS VIEWER                       ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    // TCS NQT Questions (Question table)
    console.log('🔵 TCS NQT QUESTIONS (Question Table)\n');
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // Show first 20
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topics: true,
        xpReward: true,
        createdAt: true,
      }
    });

    const totalQuestions = await prisma.question.count();
    console.log(`Total TCS NQT Questions: ${totalQuestions}\n`);
    console.log('Showing first 20 questions:\n');

    questions.forEach((q, idx) => {
      const topics = Array.isArray(q.topics) ? q.topics : JSON.parse(q.topics as any);
      console.log(`${idx + 1}. ${q.title}`);
      console.log(`   Slug: ${q.slug}`);
      console.log(`   Difficulty: ${q.difficulty} | XP: ${q.xpReward}`);
      console.log(`   Topics: ${topics.slice(0, 3).join(', ')}`);
      console.log(`   Created: ${q.createdAt.toISOString().split('T')[0]}`);
      console.log();
    });

    console.log('─'.repeat(70) + '\n');

    // Coding Arena Problems (Problem table)
    console.log('🟢 CODING ARENA PROBLEMS (Problem Table)\n');
    const problems = await prisma.problem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // Show first 20
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topics: true,
        executionMode: true,
        createdAt: true,
      }
    });

    const totalProblems = await prisma.problem.count();
    console.log(`Total Coding Arena Problems: ${totalProblems}\n`);
    console.log('Showing first 20 problems:\n');

    problems.forEach((p, idx) => {
      const topics = p.topics.split(',').map(t => t.trim()).slice(0, 3);
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Difficulty: ${p.difficulty} | Mode: ${p.executionMode}`);
      console.log(`   Topics: ${topics.join(', ')}`);
      console.log(`   Created: ${p.createdAt.toISOString().split('T')[0]}`);
      console.log();
    });

    console.log('═'.repeat(70));
    console.log('SUMMARY:');
    console.log('═'.repeat(70));
    console.log(`📊 TCS NQT Questions:        ${totalQuestions}`);
    console.log(`📊 Coding Arena Problems:    ${totalProblems}`);
    console.log(`📊 Total Questions:          ${totalQuestions + totalProblems}`);
    console.log('═'.repeat(70));

    console.log('\n💡 TIP: To view all questions visually, run:');
    console.log('   npx prisma studio');
    console.log('   Then open http://localhost:5555\n');

    console.log('💡 Or visit Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

viewQuestions();
