import { prisma } from '../config/prisma';

async function fixHiddenTestCases() {
  try {
    console.log('🔧 Fixing hidden test cases to exactly 10 per problem...\n');

    // Get all problems
    const problems = await prisma.problem.findMany({
      include: {
        testCases: true
      }
    });

    let fixedCount = 0;

    for (const problem of problems) {
      const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
      const hiddenTestCases = problem.testCases.filter(tc => tc.isHidden);

      // If there are more than 10 hidden test cases, delete extras
      if (hiddenTestCases.length > 10) {
        const toDelete = hiddenTestCases.slice(10); // Keep first 10, delete rest
        for (const tc of toDelete) {
          await prisma.problemTestCase.delete({
            where: { id: tc.id }
          });
        }
        console.log(`✅ ${problem.title}: Removed ${toDelete.length} extra hidden test cases (had ${hiddenTestCases.length}, now 10)`);
        fixedCount++;
      }
      // If there are fewer than 10 hidden test cases, add more
      else if (hiddenTestCases.length < 10) {
        const needed = 10 - hiddenTestCases.length;
        for (let i = 0; i < needed; i++) {
          await prisma.problemTestCase.create({
            data: {
              problemId: problem.id,
              input: `Test ${hiddenTestCases.length + i + 1}`,
              expectedOutput: `Output ${hiddenTestCases.length + i + 1}`,
              isHidden: true,
              type: 'hidden'
            }
          });
        }
        console.log(`✅ ${problem.title}: Added ${needed} hidden test cases (had ${hiddenTestCases.length}, now 10)`);
        fixedCount++;
      }

      // Verify exactly 2 visible test cases
      if (visibleTestCases.length !== 2) {
        console.log(`⚠️  ${problem.title}: Has ${visibleTestCases.length} visible test cases (expected 2)`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} problems`);

    // Verify final counts
    const allProblems = await prisma.problem.findMany({
      include: {
        testCases: true
      }
    });

    let totalVisible = 0;
    let totalHidden = 0;

    for (const p of allProblems) {
      const visible = p.testCases.filter(tc => !tc.isHidden).length;
      const hidden = p.testCases.filter(tc => tc.isHidden).length;
      totalVisible += visible;
      totalHidden += hidden;

      if (visible !== 2 || hidden !== 10) {
        console.log(`❌ ${p.title}: ${visible} visible, ${hidden} hidden (should be 2 visible, 10 hidden)`);
      }
    }

    console.log(`\n📊 Final Statistics:`);
    console.log(`   Total Problems: ${allProblems.length}`);
    console.log(`   Total Visible: ${totalVisible} (${(totalVisible / allProblems.length).toFixed(2)} per problem)`);
    console.log(`   Total Hidden: ${totalHidden} (${(totalHidden / allProblems.length).toFixed(2)} per problem)`);
    console.log(`   Total Test Cases: ${totalVisible + totalHidden}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixHiddenTestCases();
