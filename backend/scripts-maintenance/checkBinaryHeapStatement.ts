import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  try {
    const problem = await prisma.question.findUnique({
      where: { slug: 'tournament-tree-and-binary-heap-hashing' }
    });

    if (!problem) {
      console.log('Problem not found');
      process.exit(1);
    }

    const statement = problem.statement as string;
    console.log('Statement length:', statement.length);
    console.log('\nFirst 500 characters:');
    console.log(statement.substring(0, 500));
    console.log('\n...\n');
    console.log('Last 300 characters:');
    console.log(statement.substring(statement.length - 300));

    console.log('\n\nChecking for key terms:');
    console.log('- "insertKey":', statement.includes('insertKey'));
    console.log('- "deleteKey":', statement.includes('deleteKey'));
    console.log('- "extractMin":', statement.includes('extractMin'));
    console.log('- "Binary Heap Operations":', statement.includes('Binary Heap Operations'));
    console.log('- "Binary Min Heap":', statement.includes('Binary Min Heap'));

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

check();
