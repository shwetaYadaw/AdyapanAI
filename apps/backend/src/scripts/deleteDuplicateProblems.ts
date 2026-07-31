import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteDuplicates() {
  try {
    console.log('🗑️  Deleting ALL duplicate problems from heap-priority-queue topic...\n');

    // Delete all questions with 'heap-priority-queue' in slug
    const deleted = await prisma.question.deleteMany({
      where: {
        slug: {
          contains: 'heap-priority-queue'
        }
      }
    });

    console.log(`✅ Deleted ${deleted.count} duplicate questions with 'heap-priority-queue' topic`);
    console.log('\n✅ Cleanup complete!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting duplicates:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteDuplicates();
