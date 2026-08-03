import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteDuplicate() {
  try {
    console.log('🗑️  Deleting Binary Heap Operations duplicate from heap-priority-queue...\n');

    const deleted = await prisma.question.deleteMany({
      where: {
        slug: 'tournament-tree-and-binary-heap-heap-priority-queue'
      }
    });

    console.log(`✅ Deleted ${deleted.count} duplicate record(s)`);
    
    // Verify deletion
    const remaining = await prisma.question.findMany({
      where: {
        title: 'Binary Heap Operations'
      }
    });

    console.log(`\n✅ Remaining "Binary Heap Operations" problems: ${remaining.length}`);
    remaining.forEach(p => {
      console.log(`   • Slug: ${p.slug}, Topics: ${(p.topics as string[]).join(', ')}`);
    });

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteDuplicate();
