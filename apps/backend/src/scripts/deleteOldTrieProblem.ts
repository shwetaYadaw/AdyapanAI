import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldTrieProblem() {
  try {
    // Delete the old generic version
    const result = await prisma.question.delete({
      where: { slug: 'implement-trie-trie' }
    });

    console.log('✅ Old Implement Trie problem deleted successfully!');
    console.log('Deleted problem:', result.title);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to delete problem:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteOldTrieProblem();
