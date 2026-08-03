import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function findAll() {
  try {
    console.log('🔍 Finding ALL Binary Heap related problems...\n');

    // Find all problems with similar slugs or titles
    const allProblems = await prisma.question.findMany({
      where: {
        OR: [
          { title: { contains: 'Binary' } },
          { title: { contains: 'Heap' } },
          { slug: { contains: 'tournament' } },
          { slug: { contains: 'binary-heap' } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true,
        statement: true
      }
    });

    console.log(`Found ${allProblems.length} problems:\n`);
    
    for (const p of allProblems) {
      const statementPreview = (p.statement as string).substring(0, 100);
      console.log(`ID: ${p.id}`);
      console.log(`Title: ${p.title}`);
      console.log(`Slug: ${p.slug}`);
      console.log(`Topics: ${(p.topics as string[]).join(', ')}`);
      console.log(`Statement (first 100 chars): ${statementPreview}...`);
      console.log('─'.repeat(70));
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

findAll();
