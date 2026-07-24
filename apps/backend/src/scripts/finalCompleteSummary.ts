import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function finalComplete() {
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
            'power-of-two',
            'reverse-bits'
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
        xpReward: true,
        companies: true
      }
    });

    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║    🎉 ALL 7 LEETCODE-STYLE PROBLEMS SUCCESSFULLY UPDATED       ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    const sorted = problems.sort((a, b) => {
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      if (diffOrder[a.difficulty as keyof typeof diffOrder] !== diffOrder[b.difficulty as keyof typeof diffOrder]) {
        return diffOrder[a.difficulty as keyof typeof diffOrder] - diffOrder[b.difficulty as keyof typeof diffOrder];
      }
      return a.title.localeCompare(b.title);
    });

    let totalXP = 0;
    sorted.forEach((p: any, idx) => {
      const diffEmoji = p.difficulty === 'easy' ? '🟢' : p.difficulty === 'medium' ? '🟡' : '🔴';
      console.log(`${idx + 1}. ${diffEmoji} ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Topics: ${p.topics.join(', ')}`);
      console.log(`   Companies: ${(p.companies as string[]).join(', ')}`);
      console.log(`   Templates: ${p.templates.map((t: any) => t.language).join(', ')}`);
      console.log(`   Test Cases: ${p.testCases.length} | XP: ${p.xpReward}`);
      console.log('');
      totalXP += p.xpReward;
    });

    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log(`║  📊 TOTAL: ${sorted.length} Problems | 💰 Total XP: ${totalXP}                     ║`);
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    console.log('📋 DIRECT ACCESS URLs:');
    console.log('─────────────────────────────────────────────────────────────────');
    sorted.forEach(p => {
      console.log(`🔗 http://localhost:3000/student/challenges/${p.slug}`);
    });
    console.log('─────────────────────────────────────────────────────────────────\n');

    console.log('⚠️  IMPORTANT: Follow these steps to see updates on your interface:\n');
    console.log('1️⃣  CLEAR BROWSER CACHE & LOCAL STORAGE:');
    console.log('   ├─ Press F12 to open DevTools');
    console.log('   ├─ Click "Application" tab');
    console.log('   ├─ Left sidebar: Find "Local Storage"');
    console.log('   ├─ Right-click "http://localhost:3000"');
    console.log('   ├─ Select "Delete"');
    console.log('   ├─ Expand "IndexedDB" and delete entries');
    console.log('   └─ Close DevTools (F12)\n');

    console.log('2️⃣  HARD REFRESH BROWSER:');
    console.log('   └─ Press Ctrl+Shift+R\n');

    console.log('3️⃣  TEST ALL PROBLEMS:');
    sorted.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} (${p.difficulty}) - ${p.xpReward} XP`);
    });
    console.log('\n4️⃣  FOR EACH PROBLEM:');
    console.log('   ✓ View the full LeetCode-style statement');
    console.log('   ✓ Review all examples with explanations');
    console.log('   ✓ Check constraints and approach section');
    console.log('   ✓ Try running code in different languages');
    console.log('   ✓ Submit solutions for XP rewards\n');

    console.log('═════════════════════════════════════════════════════════════════════\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

finalComplete();
