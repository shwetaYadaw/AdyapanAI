import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from './src/config/prisma';

async function cleanup() {
  try {
    console.log('🗑️  Cleaning up old problem...\n');

    // Check if old problem exists first
    const oldExists = await prisma.question.findUnique({
      where: { slug: 'find-all-non-repeating-elements-in-an-array-tcs-nqt' }
    });

    let deleteCount = 0;
    if (oldExists) {
      await prisma.question.delete({
        where: { slug: 'find-all-non-repeating-elements-in-an-array-tcs-nqt' }
      });
      deleteCount = 1;
    }

    console.log(`✅ Deleted ${deleteCount} old entries\n`);

    // Verify it's deleted
    const oldProblem = await prisma.question.findUnique({
      where: { slug: 'find-all-non-repeating-elements-in-an-array-tcs-nqt' }
    });

    if (!oldProblem) {
      console.log('✅ Old problem successfully removed from database');
    } else {
      console.log('❌ Old problem still exists');
    }

    // Verify new problem exists
    const newProblem = await prisma.question.findUnique({
      where: { slug: 'first-non-repeating-element-tcs-nqt' }
    });

    if (newProblem) {
      console.log('✅ New problem found in database');
      console.log(`   Title: ${newProblem.title}`);
      console.log(`   Difficulty: ${newProblem.difficulty}`);
    } else {
      console.log('❌ New problem NOT found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
