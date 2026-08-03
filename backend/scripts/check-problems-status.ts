import { prisma } from '../src/config/prisma';

async function checkProblemsStatus() {
  try {
    console.log('🔍 Checking Problems table status...\n');

    const problemCount = await prisma.problem.count();
    const questionCount = await prisma.question.count();

    console.log(`📊 Database Status:`);
    console.log(`   Problem table (Coding Arena): ${problemCount} problems`);
    console.log(`   Question table (TCS NQT/Legacy): ${questionCount} questions\n`);

    if (problemCount > 0) {
      const recentProblems = await prisma.problem.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          slug: true,
          difficulty: true,
          topics: true
        }
      });

      console.log('📝 Recent Problems:');
      recentProblems.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.title} (${p.difficulty}) - Topic: ${p.topics}`);
        console.log(`      Slug: ${p.slug}`);
      });
      console.log('');
    } else {
      console.log('⚠️  No problems found in database. Run "npm run seed:coding-arena" to seed problems.\n');
    }

  } catch (error) {
    console.error('❌ Error checking status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProblemsStatus();
