import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteProblem() {
  try {
    const problemSlug = 'subarrays-with-distinct-elements-hashing';
    
    await prisma.question.delete({
      where: { slug: problemSlug },
    });
    
    console.log(`✅ Deleted extra problem: ${problemSlug}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteProblem();
