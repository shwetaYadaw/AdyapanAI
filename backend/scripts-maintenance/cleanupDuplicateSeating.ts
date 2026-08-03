import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function cleanup() {
  try {
    console.log('🧹 Cleaning up duplicate seating tests...\n');

    // Get all seating tests sorted by creation date
    const tests = await prisma.aptitudeTest.findMany({
      where: {
        title: { contains: 'Seating' },
        category: 'reasoning',
        company: 'TCS'
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`Found ${tests.length} seating tests\n`);

    if (tests.length > 1) {
      // Delete all but the latest one
      for (let i = 0; i < tests.length - 1; i++) {
        const deleted = await prisma.aptitudeTest.delete({
          where: { id: tests[i].id }
        });

        console.log(`✅ Deleted old test: ${deleted.id}`);
        console.log(`   Title: ${deleted.title}`);
      }
    }

    const remaining = await prisma.aptitudeTest.findMany({
      where: {
        title: { contains: 'Seating' },
        category: 'reasoning',
        company: 'TCS'
      }
    });

    console.log(`\n✨ Done! Remaining seating tests: ${remaining.length}`);
    if (remaining.length > 0) {
      console.log(`\nKept test:`);
      console.log(`  ID: ${remaining[0].id}`);
      console.log(`  Questions: ${(remaining[0].questions as any)?.length || 0}`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanup();
