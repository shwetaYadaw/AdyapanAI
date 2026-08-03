import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function summarizeAllProblems() {
  try {
    const problems = await prisma.question.findMany({
      where: {
        slug: {
          in: [
            'maximum-xor-of-two-numbers',
            'implement-trie',
            'replace-words',
            'map-sum-pairs',
            'longest-word-in-dictionary'
          ]
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topics: true,
        statement: true,
        templates: true,
        testCases: true,
        xpReward: true
      }
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ ALL PROBLEMS SUCCESSFULLY CREATED IN DATABASE');
    console.log('═══════════════════════════════════════════════════════════════\n');

    problems.sort((a, b) => a.title.localeCompare(b.title)).forEach((p: any, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Difficulty: ${p.difficulty.toUpperCase()}`);
      console.log(`   Topics: ${p.topics.join(', ')}`);
      console.log(`   Templates: ${p.templates.map((t: any) => t.language).join(', ')}`);
      console.log(`   Test Cases: ${p.testCases.length} (${p.testCases.filter((t: any) => t.isHidden).length} hidden)`);
      console.log(`   XP Reward: ${p.xpReward}`);
      console.log(`   Statement: ${(p.statement as string).substring(0, 80)}...`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 NEXT STEPS:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('1. Clear browser cache and storage:');
    console.log('   - Open F12 → Application tab');
    console.log('   - Delete Local Storage for localhost:3000');
    console.log('   - Delete IndexedDB entries');
    console.log('');
    console.log('2. Hard refresh browser (Ctrl+Shift+R)');
    console.log('');
    console.log('3. Navigate to each problem:');
    problems.forEach(p => {
      console.log(`   - http://localhost:3000/student/challenges/${p.slug}`);
    });
    console.log('');
    console.log('4. Test code execution in different languages');
    console.log('═══════════════════════════════════════════════════════════════\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

summarizeAllProblems();
