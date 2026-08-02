import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verifyTcsNqt() {
  try {
    const topics = ['tcs-nqt-arrays', 'tcs-nqt-numbers', 'tcs-nqt-number-system', 'tcs-nqt-sorting', 'tcs-nqt-strings'];
    
    console.log('\n📊 TCS NQT Questions by Topic:\n');
    
    let total = 0;
    for (const topic of topics) {
      const count = await prisma.question.count({
        where: { slug: { startsWith: topic } }
      });
      const displayName = topic.replace('tcs-nqt-', '').toUpperCase();
      console.log(`  ✅ ${displayName}: ${count} questions`);
      total += count;
    }
    
    console.log(`\n  📈 TOTAL: ${total} TCS NQT questions\n`);
    
    if (total > 0) {
      console.log('✨ TCS NQT questions successfully seeded!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTcsNqt();
