import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verifyCount() {
  try {
    const totalQuestions = await prisma.question.count();

    console.log('\n📊 Total Questions:', totalQuestions);
    console.log('\nTarget: 549');
    console.log(`Current: ${totalQuestions}`);
    
    if (totalQuestions === 549) {
      console.log(`✅ CORRECT! Total matches target.`);
    } else {
      console.log(`❌ MISMATCH! Expected 549, got ${totalQuestions} (difference: ${totalQuestions - 549})`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyCount();
