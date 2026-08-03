import { prisma } from '../src/config/prisma';

async function listProblemSlugs() {
  try {
    console.log('🔍 Listing all problem slugs in database...\n');

    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true,
        difficulty: true
      },
      orderBy: { title: 'asc' }
    });

    console.log(`Total problems: ${problems.length}\n`);
    
    // Search for problems with "maximum" and "minimum" in title
    const searchTerm = 'maximum';
    const matching = problems.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matching.length > 0) {
      console.log(`\n📝 Problems containing "${searchTerm}":`);
      matching.forEach(p => {
        console.log(`  - ${p.title}`);
        console.log(`    Slug: ${p.slug}`);
        console.log(`    Topics: ${p.topics}`);
        console.log(`    URL: /student/challenges/${p.slug}\n`);
      });
    }

    // Show first 20 problems
    console.log('\n📋 First 20 problems:');
    problems.slice(0, 20).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Topics: ${p.topics}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listProblemSlugs();
