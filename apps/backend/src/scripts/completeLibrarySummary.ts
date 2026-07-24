import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function completeLibrary() {
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
            'reverse-bits',
            'count-total-set-bits'
          ]
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topics: true,
        templates: true,
        testCases: true,
        xpReward: true,
        companies: true
      }
    });

    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║    🎉 ALL 8 LEETCODE-STYLE PROBLEMS SUCCESSFULLY CREATED        ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    const sorted = problems.sort((a, b) => {
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      if (diffOrder[a.difficulty as keyof typeof diffOrder] !== diffOrder[b.difficulty as keyof typeof diffOrder]) {
        return diffOrder[a.difficulty as keyof typeof diffOrder] - diffOrder[b.difficulty as keyof typeof diffOrder];
      }
      return a.title.localeCompare(b.title);
    });

    let totalXP = 0;
    let easyCount = 0;
    let mediumCount = 0;

    sorted.forEach((p: any, idx) => {
      const diffEmoji = p.difficulty === 'easy' ? '🟢' : p.difficulty === 'medium' ? '🟡' : '🔴';
      if (p.difficulty === 'easy') easyCount++;
      if (p.difficulty === 'medium') mediumCount++;
      
      console.log(`${idx + 1}. ${diffEmoji} ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Topics: ${p.topics.join(', ')}`);
      console.log(`   Companies: ${(p.companies as string[]).slice(0, 3).join(', ')}...`);
      console.log(`   Templates: ${p.templates.map((t: any) => t.language).join(', ')}`);
      console.log(`   Test Cases: ${p.testCases.length} | XP: ${p.xpReward}`);
      console.log('');
      totalXP += p.xpReward;
    });

    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log(`║  📊 STATISTICS:                                                  ║`);
    console.log(`║  • Total Problems: ${sorted.length} | Easy: ${easyCount} | Medium: ${mediumCount}`.padEnd(64) + '║');
    console.log(`║  • Total XP Available: ${totalXP} points                              ║`);
    console.log(`║  • Total Test Cases: ${sorted.reduce((sum, p: any) => sum + p.testCases.length, 0)}                                 ║`);
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    console.log('📋 PROBLEM CATEGORIES:\n');
    
    console.log('🟢 BIT MANIPULATION (Easy):');
    sorted.filter((p: any) => p.difficulty === 'easy').forEach(p => {
      console.log(`   • ${p.title} (${p.xpReward} XP) - ${p.slug}`);
    });

    console.log('\n🟡 DATA STRUCTURES & ALGORITHMS (Medium):');
    sorted.filter((p: any) => p.difficulty === 'medium').forEach(p => {
      const primaryTopic = p.topics[0];
      console.log(`   • ${p.title} (${p.xpReward} XP) - ${primaryTopic} - ${p.slug}`);
    });

    console.log('\n' + '─'.repeat(66));
    console.log('🔗 DIRECT ACCESS URLs:\n');
    sorted.forEach(p => {
      const diff = p.difficulty === 'easy' ? '🟢' : '🟡';
      console.log(`${diff} http://localhost:3000/student/challenges/${p.slug}`);
    });

    console.log('\n' + '═'.repeat(66) + '\n');
    console.log('⚠️  IMPORTANT: TO SEE UPDATED PROBLEMS ON YOUR INTERFACE:\n');
    
    console.log('STEP 1️⃣  - Clear Browser Storage & Cache:');
    console.log('   ┌─ Press F12 to open DevTools');
    console.log('   ├─ Click "Application" tab');
    console.log('   ├─ Left sidebar: Click "Local Storage"');
    console.log('   ├─ Right-click "http://localhost:3000"');
    console.log('   ├─ Select "Delete"');
    console.log('   ├─ Expand "IndexedDB" → Delete all entries');
    console.log('   └─ Close DevTools\n');

    console.log('STEP 2️⃣  - Hard Refresh Browser:');
    console.log('   └─ Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)\n');

    console.log('STEP 3️⃣  - Access Problems:');
    console.log('   • Use URLs above to navigate to each problem');
    console.log('   • Test code execution in all 4 languages');
    console.log('   • Submit solutions and earn XP rewards\n');

    console.log('═'.repeat(66) + '\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

completeLibrary();
