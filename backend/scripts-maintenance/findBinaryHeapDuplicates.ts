import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function findDuplicates() {
  try {
    console.log('🔍 Finding Binary Heap duplicates...\n');

    // Find all problems with "Binary" or "Heap" in title
    const problems = await prisma.question.findMany({
      where: {
        OR: [
          { title: { contains: 'Binary Heap' } },
          { slug: { contains: 'binary-heap' } },
          { slug: { contains: 'tournament-tree' } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true
      }
    });

    console.log(`Found ${problems.length} problems:\n`);
    
    for (const p of problems) {
      console.log(`• Title: ${p.title}`);
      console.log(`  Slug: ${p.slug}`);
      console.log(`  Topics: ${(p.topics as string[]).join(', ')}`);
      console.log(`  ID: ${p.id}\n`);
    }

    // Group by title
    const byTitle = new Map<string, any[]>();
    problems.forEach(p => {
      const key = p.title;
      if (!byTitle.has(key)) byTitle.set(key, []);
      byTitle.get(key)!.push(p);
    });

    console.log('═'.repeat(70));
    console.log('Duplicates Found:');
    console.log('═'.repeat(70));
    
    for (const [title, probs] of byTitle) {
      if (probs.length > 1) {
        console.log(`\n❌ "${title}" appears ${probs.length} times:`);
        probs.forEach((p, idx) => {
          console.log(`   ${idx + 1}. Slug: ${p.slug}, Topics: ${(p.topics as string[]).join(', ')}`);
        });
      }
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

findDuplicates();
