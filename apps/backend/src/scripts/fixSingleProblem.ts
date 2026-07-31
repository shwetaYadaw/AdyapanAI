import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function fixSingleProblem() {
  try {
    const problem = await prisma.question.findUnique({
      where: { slug: 'find-smallest-number-in-array' }
    });

    if (!problem) {
      console.log('Problem not found');
      return;
    }

    console.log('Current statement (first 300 chars):');
    console.log(problem.statement.substring(0, 300));
    console.log('\n---\n');

    // Remove the heading
    let newStatement = problem.statement
      .replace(/^##\s+Problem\s+Statement\s*\n\n?/i, '')
      .trim();

    console.log('New statement (first 300 chars):');
    console.log(newStatement.substring(0, 300));

    // Update
    await prisma.question.update({
      where: { slug: 'find-smallest-number-in-array' },
      data: { statement: newStatement }
    });

    console.log('\n✅ Fixed!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSingleProblem();
