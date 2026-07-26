import { prisma } from '../config/prisma';

async function identifyExtraProblems() {
  try {
    // Get all problems sorted by creation date (newest first)
    const allProblems = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Total problems:', allProblems.length);
    
    // Show the last 30 created problems (most likely the extras)
    console.log('\n\nMost recently created 40 problems (likely includes extra ones):');
    console.log('==================================================================\n');
    
    for (let i = 0; i < Math.min(40, allProblems.length); i++) {
      const p = allProblems[i];
      console.log(`${i + 1}. [${p.createdAt.toISOString()}] "${p.title}"`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Slug: ${p.slug}\n`);
    }

    // Count by creation date
    const dateGroups: { [key: string]: number } = {};
    for (const p of allProblems) {
      const date = p.createdAt.toISOString().split('T')[0];
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    }
    
    console.log('\n\nProblems created by date:');
    console.log('===========================');
    for (const [date, count] of Object.entries(dateGroups).sort().reverse()) {
      console.log(`${date}: ${count} problems`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

identifyExtraProblems();
