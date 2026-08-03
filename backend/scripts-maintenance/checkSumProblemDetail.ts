import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  try {
    console.log('🔍 Checking Sum of first N natural numbers in database...\n');

    const problem = await prisma.question.findUnique({
      where: { slug: 'sum-of-first-n-natural-numbers-tcs-nqt' }
    });

    if (!problem) {
      console.log('❌ Problem not found');
      return;
    }

    console.log(`✅ Found: ${problem.slug}`);
    console.log(`Title: ${problem.title}`);
    console.log(`\nStatement (first 200 chars):`);
    console.log(problem.statement.substring(0, 200) + '...\n');
    console.log(`\nTest Cases (${problem.testCases?.length || 0} total):`);
    if (problem.testCases && Array.isArray(problem.testCases)) {
      problem.testCases.forEach((tc: any, idx: number) => {
        console.log(`  ${idx + 1}. Input: "${tc.input}", Output: "${tc.output}", Hidden: ${tc.isHidden}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
