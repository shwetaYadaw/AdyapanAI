import { prisma } from '../config/prisma';

async function checkDbCount() {
  try {
    const count = await prisma.question.count();
    console.log('Total problems in database:', count);
    
    // Find duplicates or extra problems
    const duplicateSlugs = await prisma.question.groupBy({
      by: ['slug'],
      _count: {
        id: true
      },
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      }
    });
    
    console.log('\nDuplicate slugs found:', duplicateSlugs.length);
    if (duplicateSlugs.length > 0) {
      for (const dup of duplicateSlugs) {
        console.log(`- Slug: "${dup.slug}" (${dup._count.id} copies)`);
      }
    }
    
    // List all problems with greedy/game in slug
    const problems = await prisma.question.findMany({
      where: {
        slug: {
          contains: 'greedy'
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true
      }
    });
    
    console.log('\n\nProblems with "greedy" in slug:');
    for (const p of problems) {
      console.log(`- ID: ${p.id}`);
      console.log(`  Title: ${p.title}`);
      console.log(`  Slug: ${p.slug}`);
      console.log(`  Created: ${p.createdAt}\n`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDbCount();
