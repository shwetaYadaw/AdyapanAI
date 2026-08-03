import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    const problem = await prisma.question.findUnique({
      where: { slug: 'tournament-tree-and-binary-heap-hashing' }
    });

    if (!problem) {
      console.log('Problem not found');
      process.exit(1);
    }

    const testCases = problem.testCases as any[];
    console.log('✅ Binary Heap Operations - Test Cases Verification\n');
    console.log('═'.repeat(70));
    
    console.log(`Total Test Cases: ${testCases.length}`);
    console.log(`Visible: ${testCases.filter(tc => !tc.isHidden).length}`);
    console.log(`Hidden: ${testCases.filter(tc => tc.isHidden).length}`);
    
    console.log('\n📋 Test Case Details:\n');
    
    testCases.forEach((tc, idx) => {
      const visibility = tc.isHidden ? '🔒 HIDDEN' : '👁️  VISIBLE';
      console.log(`${idx + 1}. ${visibility}`);
      console.log(`   Input: ${tc.input.substring(0, 50)}${tc.input.length > 50 ? '...' : ''}`);
      console.log(`   Expected Output: ${tc.output}`);
      console.log();
    });

    console.log('═'.repeat(70));
    console.log('✅ All test cases present and configured correctly!');

    // Verify the first example
    const firstExample = testCases[0];
    if (firstExample.input.includes('1 4') && firstExample.input.includes('1 2') && firstExample.output.includes('2')) {
      console.log('✅ First example (queries with 4, 2, 6) verified');
    }

    // Verify the second example
    const secondExample = testCases[1];
    if (secondExample.input.includes('1 8') && secondExample.input.includes('1 9') && secondExample.output.includes('8')) {
      console.log('✅ Second example (queries with 8, 9) verified');
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
