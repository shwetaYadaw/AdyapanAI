import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function checkDatabase() {
  try {
    console.log('🔍 Checking database for questions...\n');

    // Count all questions
    const totalQuestions = await prisma.question.count();
    console.log(`📊 Total questions in database: ${totalQuestions}`);

    // Count by difficulty
    const byDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    console.log('\n📈 By Difficulty:');
    byDifficulty.forEach(item => {
      console.log(`   ${item.difficulty}: ${item._count}`);
    });

    // Get first 10 questions to verify format
    const sampleQuestions = await prisma.question.findMany({
      take: 10,
      select: {
        slug: true,
        title: true,
        difficulty: true,
        topics: true,
        companies: true,
        statement: true,
      }
    });

    console.log('\n📋 Sample Questions (first 10):');
    sampleQuestions.forEach((q, idx) => {
      console.log(`${idx + 1}. ${q.title}`);
      console.log(`   Slug: ${q.slug}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Topics: ${Array.isArray(q.topics) ? q.topics.join(', ') : q.topics}`);
      console.log(`   Companies: ${q.companies}`);
      console.log(`   Has statement: ${q.statement ? '✅' : '❌'}`);
      console.log('');
    });

    // Check questions by topic
    console.log('\n🏷️  Questions by Topic:');
    const topicCounts = await prisma.question.findMany({
      select: { topics: true }
    });

    const topicMap: { [key: string]: number } = {};
    topicCounts.forEach(q => {
      if (Array.isArray(q.topics)) {
        q.topics.forEach((topic: any) => {
          topicMap[topic] = (topicMap[topic] || 0) + 1;
        });
      }
    });

    Object.entries(topicMap).sort((a, b) => b[1] - a[1]).forEach(([topic, count]) => {
      console.log(`   ${topic}: ${count}`);
    });

    console.log('\n✅ Database check complete!');
  } catch (err) {
    console.error('❌ Error checking database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
