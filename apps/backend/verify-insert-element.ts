import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { prisma } from './src/config/prisma';

async function verify() {
  try {
    console.log('🔧 Verifying Insert Element at a Given Position in an Array problem...');
    
    // Delete the old entry
    const deleteResult = await prisma.question.deleteMany({
      where: {
        slug: 'adding-element-in-an-array-tcs-nqt'
      }
    });
    console.log(`✅ Deleted ${deleteResult.count} old entries`);
    
    // Check the new entry
    const problem = await prisma.question.findUnique({
      where: { slug: 'insert-element-at-a-given-position-in-an-array-tcs-nqt' }
    });
    
    if (problem) {
      console.log('\n✅ Problem found!');
      console.log('📝 Title:', problem.title);
      console.log('📝 Difficulty:', problem.difficulty);
      console.log('📝 Sample Input:', problem.sampleInput);
      console.log('📝 Sample Output:', problem.sampleOutput);
      console.log('🧪 Test Cases Count:', (problem.testCases as any[]).length);
      console.log('\n📋 Test Cases:');
      (problem.testCases as any[]).forEach((tc, idx) => {
        const lines = tc.input.split('\n');
        const arr = lines[1] || '(empty)';
        const pos = lines[2];
        const ele = lines[3];
        console.log(`  ${idx + 1}. Input: [${arr}], pos=${pos}, ele=${ele} → Output: [${tc.output}] ${tc.isHidden ? '(hidden)' : '(visible)'}`);
      });
    } else {
      console.log('❌ Problem not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
