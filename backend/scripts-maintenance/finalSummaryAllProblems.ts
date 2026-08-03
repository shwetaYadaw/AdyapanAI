import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function finalSummary() {
  try {
    const problems = await prisma.question.findMany({
      where: {
        slug: {
          in: [
            'maximum-xor-of-two-numbers',
            'implement-trie',
            'replace-words',
            'map-sum-pairs',
            'longest-word-in-dictionary',
            'power-of-two'
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

    console.log('\n╔═════════════════════════════════════════════════════════════════╗');
    console.log('║     ✅ ALL LEETCODE-STYLE PROBLEMS SUCCESSFULLY CREATED      ║');
    console.log('╚═════════════════════════════════════════════════════════════════╝\n');

    const sorted = problems.sort((a, b) => {
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      if (diffOrder[a.difficulty as keyof typeof diffOrder] !== diffOrder[b.difficulty as keyof typeof diffOrder]) {
        return diffOrder[a.difficulty as keyof typeof diffOrder] - diffOrder[b.difficulty as keyof typeof diffOrder];
      }
      return a.title.localeCompare(b.title);
    });

    sorted.forEach((p: any, idx) => {
      const diffEmoji = p.difficulty === 'easy' ? '🟢' : p.difficulty === 'medium' ? '🟡' : '🔴';
      console.log(`${idx + 1}. ${diffEmoji} ${p.title}`);
      console.log(`   └─ Slug: ${p.slug}`);
      console.log(`   └─ Topics: ${p.topics.join(', ')}`);
      console.log(`   └─ Templates: ${p.templates.map((t: any) => t.language).join(', ')}`);
      console.log(`   └─ Test Cases: ${p.testCases.length} | XP: ${p.xpReward}`);
      console.log('');
    });

    console.log('╔═════════════════════════════════════════════════════════════════╗');
    console.log('║  PROBLEM ACCESS URLS (After cache clear & hard refresh)       ║');
    console.log('╠═════════════════════════════════════════════════════════════════╣');
    sorted.forEach(p => {
      console.log(`║  http://localhost:3000/student/challenges/${p.slug.padEnd(50)}║`);
    });
    console.log('╚═════════════════════════════════════════════════════════════════╝\n');

    console.log('📋 FINAL STEPS TO VIEW ON INTERFACE:');
    console.log('───────────────────────────────────────────────────────────────────');
    console.log('1️⃣  CLEAR BROWSER CACHE & STORAGE:');
    console.log('   Press F12 → Application tab');
    console.log('   Delete Local Storage: localhost:3000');
    console.log('   Delete IndexedDB entries');
    console.log('   Close F12');
    console.log('');
    console.log('2️⃣  HARD REFRESH:');
    console.log('   Press Ctrl+Shift+R');
    console.log('');
    console.log('3️⃣  TEST EACH PROBLEM:');
    sorted.forEach(p => {
      console.log(`   • ${p.title} (${p.difficulty})`);
    });
    console.log('');
    console.log('4️⃣  TEST CODE EXECUTION:');
    console.log('   • Run sample test cases');
    console.log('   • Try different languages (Python, JS, C++, Java)');
    console.log('   • Submit solutions for XP rewards');
    console.log('───────────────────────────────────────────────────────────────────\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

finalSummary();
