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
      console.log('❌ Problem not found!');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log('\n✅ Binary Heap Operations Problem Found!\n');
    console.log('📋 Details:');
    console.log(`Title: ${problem.title}`);
    console.log(`Slug: ${problem.slug}`);
    console.log(`Difficulty: ${problem.difficulty}`);
    console.log(`Topics: ${(problem.topics as string[]).join(', ')}`);
    console.log(`XP Reward: ${problem.xpReward}`);
    
    // Check if statement contains the new content
    const statement = problem.statement as string;
    if (statement.includes('Binary Heap Operations') && statement.includes('insertKey') && statement.includes('extractMin')) {
      console.log(`✅ Statement updated correctly`);
      console.log(`✅ Contains Binary Heap Operations content`);
    } else {
      console.log(`❌ Statement may not be updated correctly`);
    }

    // Check test cases
    const testCases = problem.testCases as any[];
    if (testCases && testCases.length > 0) {
      console.log(`✅ Test Cases: ${testCases.length} total`);
      const visibleCount = testCases.filter(tc => !tc.isHidden).length;
      const hiddenCount = testCases.filter(tc => tc.isHidden).length;
      console.log(`   - Visible: ${visibleCount}`);
      console.log(`   - Hidden: ${hiddenCount}`);
    }

    console.log('\n✅ Problem successfully updated in database!');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
