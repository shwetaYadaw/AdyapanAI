import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function countAllQuestions() {
  try {
    const totalCount = await prisma.question.count();
    
    const questions = await prisma.question.findMany({
      select: { topics: true },
    });

    // Count by topic
    const topicCounts = new Map<string, number>();
    questions.forEach(q => {
      const topics = Array.isArray(q.topics) ? q.topics : (typeof q.topics === 'string' ? JSON.parse(q.topics) : []);
      topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    console.log('\n📊 TOTAL QUESTIONS IN DATABASE:\n');
    console.log(`🎯 Grand Total: ${totalCount} questions\n`);
    
    console.log('📂 Questions by Topic:');
    const sortedTopics = Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1]);
    sortedTopics.forEach(([topic, count]) => {
      console.log(`   • ${topic}: ${count} questions`);
    });

    console.log(`\n✅ All questions are stored in the database!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countAllQuestions();
