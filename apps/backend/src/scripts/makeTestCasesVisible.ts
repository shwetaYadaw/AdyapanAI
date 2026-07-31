import { prisma } from '../config/prisma';

async function makeTestCasesVisible() {
  try {
    console.log('Making first 2 test cases visible for each problem...\n');
    
    // Get all problems
    const problems = await prisma.problem.findMany({
      include: {
        testCases: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    console.log(`Found ${problems.length} problems\n`);

    let updated = 0;

    for (const problem of problems) {
      if (problem.testCases.length === 0) {
        console.log(`⚠️  ${problem.title} - No test cases found`);
        continue;
      }

      // Make first 2 test cases visible (or all if less than 2)
      const testCasesToUpdate = problem.testCases.slice(0, Math.min(2, problem.testCases.length));
      
      for (const tc of testCasesToUpdate) {
        if (tc.isHidden) {
          await prisma.problemTestCase.update({
            where: { id: tc.id },
            data: {
              isHidden: false,
              type: 'visible'
            }
          });
          updated++;
        }
      }

      const visibleCount = testCasesToUpdate.length;
      const hiddenCount = problem.testCases.length - visibleCount;
      
      console.log(`✅ ${problem.title}`);
      console.log(`   Total: ${problem.testCases.length} | Visible: ${visibleCount} | Hidden: ${hiddenCount}`);
    }

    console.log(`\n✅ Done! Updated ${updated} test cases to be visible`);
    console.log(`\nNow each Coding Arena problem will show 1-2 sample test cases!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeTestCasesVisible();
