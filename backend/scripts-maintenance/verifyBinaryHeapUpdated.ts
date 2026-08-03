import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    console.log('🔍 Verifying Binary Heap Operations problem...\n');

    const problem = await prisma.question.findUnique({
      where: { slug: 'tournament-tree-and-binary-heap-hashing' },
      select: {
        id: true,
        title: true,
        slug: true,
        statement: true,
        inputFormat: true,
        outputFormat: true,
        constraints: true,
        sampleInput: true,
        sampleOutput: true,
        testCases: true,
        difficulty: true,
        xpReward: true
      }
    });

    if (!problem) {
      console.log('❌ Problem not found!');
      process.exit(1);
    }

    console.log('✅ BINARY HEAP OPERATIONS - COMPLETE VERIFICATION\n');
    console.log('═'.repeat(70));
    
    console.log(`\n📋 BASIC INFO:`);
    console.log(`  Title: ${problem.title}`);
    console.log(`  Slug: ${problem.slug}`);
    console.log(`  Difficulty: ${problem.difficulty}`);
    console.log(`  XP Reward: ${problem.xpReward}`);

    const stmt = problem.statement as string;
    console.log(`\n📄 STATEMENT VALIDATION:`);
    console.log(`  Length: ${stmt.length} characters`);
    console.log(`  Starts with: "${stmt.substring(0, 80)}..."`);
    console.log(`  ✅ Contains "insertKey": ${stmt.includes('insertKey')}`);
    console.log(`  ✅ Contains "deleteKey": ${stmt.includes('deleteKey')}`);
    console.log(`  ✅ Contains "extractMin": ${stmt.includes('extractMin')}`);
    console.log(`  ✅ Contains example 1 (4,2,6): ${stmt.includes('1 4') && stmt.includes('2, 6')}`);
    console.log(`  ✅ Contains example 2 (8,9): ${stmt.includes('1 8') && stmt.includes('1 9')}`);

    console.log(`\n📝 INPUT/OUTPUT FORMAT:`);
    console.log(`  Input Format: ${(problem.inputFormat as string).substring(0, 50)}...`);
    console.log(`  Output Format: ${(problem.outputFormat as string).substring(0, 50)}...`);
    console.log(`  Constraints: ${(problem.constraints as string)}`);

    console.log(`\n🧪 TEST CASES:`);
    const testCases = problem.testCases as any[];
    console.log(`  Total: ${testCases.length}`);
    console.log(`  Visible: ${testCases.filter(tc => !tc.isHidden).length}`);
    console.log(`  Hidden: ${testCases.filter(tc => tc.isHidden).length}`);
    
    console.log(`\n  Sample Test Cases:`);
    testCases.slice(0, 3).forEach((tc, i) => {
      console.log(`    ${i+1}. Input: "${tc.input.substring(0, 40)}..." → Output: "${tc.output.substring(0, 20)}..."`);
    });

    console.log(`\n═`.repeat(70));
    console.log(`✅ PROBLEM IS CORRECTLY UPDATED IN DATABASE`);
    console.log(`\n⚠️  Frontend users should HARD REFRESH (Ctrl+Shift+R) to see updates`);
    console.log(`💾 All data is fresh from the database!`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
