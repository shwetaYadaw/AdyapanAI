import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { prisma } from './src/config/prisma';

async function verify() {
  try {
    console.log('✅ Verifying Reverse a given array problem...');
    
    // Check the new entry
    const problem = await prisma.question.findUnique({
      where: { slug: 'reverse-a-given-array-tcs-nqt' }
    });
    
    if (problem) {
      console.log('✅ Problem found!');
      console.log('📝 Title:', problem.title);
      console.log('📝 Difficulty:', problem.difficulty);
      console.log('📝 Sample Input:', problem.sampleInput);
      console.log('📝 Sample Output:', problem.sampleOutput);
      console.log('🧪 Test Cases Count:', (problem.testCases as any[]).length);
      console.log('\n📋 Test Cases:');
      (problem.testCases as any[]).forEach((tc, idx) => {
        console.log(`  ${idx + 1}. Input: "${tc.input.replace(/\n/g, ' | ')}" → Output: "${tc.output}" ${tc.isHidden ? '(hidden)' : '(visible)'}`);
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
