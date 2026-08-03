import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    console.log('🔍 Verifying current database state...\n');

    // Count total questions
    const totalCount = await prisma.question.count();
    console.log(`📊 Total questions in database: ${totalCount}`);

    // Count TCS NQT questions
    const tcsCount = await prisma.question.count({
      where: {
        slug: {
          endsWith: '-tcs-nqt'
        }
      }
    });
    console.log(`📝 TCS NQT questions: ${tcsCount}`);

    // Count Coding Arena questions (everything else)
    const codingArenaCount = await prisma.question.count({
      where: {
        slug: {
          not: {
            endsWith: '-tcs-nqt'
          }
        }
      }
    });
    console.log(`🎯 Coding Arena questions: ${codingArenaCount}`);

    // Check specific problems
    console.log('\n🔎 Checking for updated problems:\n');

    // Check Sum of First N Natural Numbers
    const sumProblem = await prisma.question.findUnique({
      where: { slug: 'sum-of-first-n-natural-numbers-tcs-nqt' }
    });
    if (sumProblem) {
      console.log('✅ Sum of First N Natural Numbers (TCS NQT):');
      console.log(`   - Title: ${sumProblem.title}`);
      console.log(`   - Examples in statement: ${sumProblem.statement.includes('n=3') ? 'YES' : 'NO'}`);
      console.log(`   - Test cases: ${sumProblem.testCases?.length || 0}`);
    } else {
      console.log('❌ Sum of First N Natural Numbers not found');
    }

    // Check Binary Heap Operations
    const heapProblem = await prisma.question.findUnique({
      where: { slug: 'binary-heap-operations-hashing' }
    });
    if (heapProblem) {
      console.log('\n✅ Binary Heap Operations (Hashing):');
      console.log(`   - Title: ${heapProblem.title}`);
      console.log(`   - Examples in statement: ${heapProblem.statement.includes('[1, 4]') ? 'YES' : 'NO'}`);
      console.log(`   - Test cases: ${heapProblem.testCases?.length || 0}`);
    } else {
      console.log('\n❌ Binary Heap Operations not found');
    }

    // Count by topic
    console.log('\n📚 Questions by topic:');
    const allQuestions = await prisma.question.findMany({
      select: { topics: true }
    });

    const topicMap: Record<string, number> = {};
    for (const q of allQuestions) {
      for (const topic of q.topics) {
        topicMap[topic] = (topicMap[topic] || 0) + 1;
      }
    }

    Object.entries(topicMap).sort((a, b) => b[1] - a[1]).forEach(([topic, count]) => {
      console.log(`   - ${topic}: ${count}`);
    });

    console.log('\n✅ Verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
