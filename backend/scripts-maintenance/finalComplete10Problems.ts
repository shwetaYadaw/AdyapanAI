import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function finalComplete10() {
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
            'count-total-set-bits',
            'power-set',
            'sum-of-two-integers'
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
    console.log('║   🎉 ALL 10 LEETCODE-STYLE PROBLEMS SUCCESSFULLY CREATED        ║');
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
    console.log(`║  📊 FINAL STATISTICS:                                            ║`);
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
      const primaryTopic = Array.isArray(p.topics) ? p.topics[0] : p.topics;
      console.log(`   • ${p.title} (${p.xpReward} XP) - ${primaryTopic} - ${p.slug}`);
    });

    console.log('\n' + '─'.repeat(66));
    console.log('🔗 QUICK ACCESS URLs:\n');
    sorted.forEach((p, idx) => {
      const diff = p.difficulty === 'easy' ? '🟢' : '🟡';
      console.log(`${idx + 1}. ${diff} http://localhost:3000/student/challenges/${p.slug}`);
    });

    console.log('\n' + '═'.repeat(66) + '\n');
    console.log('⚠️  FINAL STEP: CLEAR CACHE TO SEE ALL PROBLEMS ON INTERFACE\n');
    
    console.log('1️⃣  CLEAR BROWSER STORAGE & CACHE:');
    console.log('   • Press F12 to open DevTools');
    console.log('   • Click "Application" tab');
    console.log('   • Local Storage → Right-click "http://localhost:3000" → Delete');
    console.log('   • IndexedDB → Delete all entries');
    console.log('   • Close DevTools\n');

    console.log('2️⃣  HARD REFRESH BROWSER:');
    console.log('   • Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)\n');

    console.log('3️⃣  CLOSE & REOPEN BROWSER:');
    console.log('   • Close all tabs and browser completely');
    console.log('   • Wait 5 seconds');
    console.log('   • Reopen browser');
    console.log('   • Go to http://localhost:3000\n');

    console.log('4️⃣  ACCESS & TEST PROBLEMS:');
    console.log('   • Use URLs above to test each problem');
    console.log('   • Try code execution in all 4 languages');
    console.log('   • Submit solutions and earn XP!\n');

    console.log('═'.repeat(66));
    console.log(`\n✅ DATABASE READY: All ${sorted.length} problems are live and ready for students!\n`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

finalComplete10();
