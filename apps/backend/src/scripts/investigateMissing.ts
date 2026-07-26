import { prisma } from '../config/prisma';

async function investigateMissing() {
  try {
    const count = await prisma.question.count();
    console.log('Current count:', count);

    // Find all problems created on 2026-07-20
    const july20 = await prisma.question.findMany({
      where: {
        createdAt: {
          gte: new Date('2026-07-20T00:00:00Z'),
          lt: new Date('2026-07-21T00:00:00Z')
        }
      },
      select: { id: true, title: true, slug: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\nProblems from 2026-07-20:', july20.length);
    
    // Also check for any with titles matching the ones we deleted
    const toCheck = [
      'Minimum Absolute Sum Difference',
      'Minimize Cash Flow',
      'Gas Station',
      'Minimum Arrows to Burst Balloons',
      'Max Equal Sum',
      'Min Cost Coins',
      'Jump Game',
      'Maximum Height',
      'Jump Game II',
      'Minimum Coins'
    ];

    for (const title of toCheck) {
      const found = await prisma.question.findMany({
        where: {
          title: { contains: title }
        },
        select: { id: true, title: true, slug: true }
      });
      if (found.length > 0) {
        console.log(`\nFound "${title}":`);
        found.forEach(f => console.log(`  - ${f.title} (${f.slug})`));
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

investigateMissing();
