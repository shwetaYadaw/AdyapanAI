import { prisma } from '../config/prisma';

async function checkTestCases() {
  try {
    console.log('🔍 Checking Problem and ProblemTestCase tables...\n');

    // Count total problems
    const totalProblems = await prisma.problem.count();
    console.log(`📊 Total Problems in database: ${totalProblems}`);

    // Count total test cases
    const totalTestCases = await prisma.problemTestCase.count();
    console.log(`📊 Total Test Cases in database: ${totalTestCases}\n`);

    // Get problems with their test case counts
    const problems = await prisma.problem.findMany({
      include: {
        _count: {
          select: { testCases: true }
        }
      },
      take: 10
    });

    console.log('📋 Sample of first 10 problems:\n');
    problems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title}`);
      console.log(`   Slug: ${problem.slug}`);
      console.log(`   Test Cases: ${problem._count.testCases}`);
      console.log(`   Difficulty: ${problem.difficulty}\n`);
    });

    // Count problems with NO test cases
    const problemsWithoutTestCases = await prisma.problem.findMany({
      where: {
        testCases: {
          none: {}
        }
      }
    });

    console.log(`\n⚠️  Problems WITHOUT test cases: ${problemsWithoutTestCases.length}/${totalProblems}`);

    // Count problems WITH test cases
    const problemsWithTestCases = await prisma.problem.findMany({
      where: {
        testCases: {
          some: {}
        }
      }
    });

    console.log(`✅ Problems WITH test cases: ${problemsWithTestCases.length}/${totalProblems}\n`);

    if (problemsWithTestCases.length > 0) {
      console.log('📝 Problems that have test cases:');
      problemsWithTestCases.forEach(p => {
        console.log(`   - ${p.title} (${p.slug})`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTestCases();
