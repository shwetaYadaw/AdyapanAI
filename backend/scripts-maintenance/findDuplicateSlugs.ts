import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function findDuplicates() {
  try {
    console.log('🔍 Finding duplicate problems...\n');

    // Find all questions with heap-priority-queue topic
    const allQuestions = await prisma.question.findMany({
      where: {
        slug: { contains: 'heap-priority-queue' }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true
      }
    });

    console.log(`Found ${allQuestions.length} questions with 'heap-priority-queue' in slug:`);
    console.log('─'.repeat(70));
    
    for (const q of allQuestions) {
      console.log(`• ${q.slug}`);
      console.log(`  Title: ${q.title}`);
      console.log(`  Topics: ${(q.topics as string[]).join(', ')}`);
      console.log();
    }

    console.log('─'.repeat(70));
    console.log(`\nThese should be DELETED if they also exist in hashing topic.`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

findDuplicates();
