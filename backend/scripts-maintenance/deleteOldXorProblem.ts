import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldXorProblem() {
  try {
    // Delete the old generic version
    const result = await prisma.question.delete({
      where: { slug: 'maximum-xor-of-two-numbers-trie' }
    });

    console.log('✅ Old Maximum XOR problem deleted successfully!');
    console.log('Deleted problem:', result.title);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to delete problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteOldXorProblem();
