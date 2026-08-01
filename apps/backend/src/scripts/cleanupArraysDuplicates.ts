import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting cleanup of duplicate array questions...\n');

    // List of duplicate question IDs/titles to delete
    const duplicatesToDelete = [
      'Given Sum Pair',
      'Kth - Smallest Element',
      'Merge Overlapping Intervals',
      'Repeat and Missing Number Array',
      'Pair Sum in a Sorted and Rotated Array',
      'Subarray Sum Divisible K'
    ];

    for (const title of duplicatesToDelete) {
      const deleted = await prisma.question.deleteMany({
        where: {
          title: title,
          topics: {
            array_contains: ['arrays']
          }
        }
      });

      if (deleted.count > 0) {
        console.log(`✅ Deleted: "${title}" (${deleted.count} record(s))`);
      } else {
        console.log(`⚠️  Not found: "${title}"`);
      }
    }

    console.log('\n✅ Cleanup completed!');

    // Verify final count
    const finalCount = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: ['arrays']
        }
      },
      select: { id: true }
    });

    console.log(`\n📊 Final count: ${finalCount.length} array questions`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
