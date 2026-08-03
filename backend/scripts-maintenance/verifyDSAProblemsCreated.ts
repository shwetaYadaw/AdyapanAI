import { prisma } from '../config/prisma';

async function verifyProblemsCreated() {
  try {
    const problems = await prisma.question.findMany({
      where: {
        slug: {
          in: [
            'minimum-absolute-sum-difference',
            'minimum-number-of-arrows-to-burst-balloons',
            'max-equal-sum-of-three-stacks',
            'min-cost-to-get-all-coins-with-k-extra',
            'minimum-coins-specific-denominations',
            'maximum-height-by-stacking-cuboids'
          ]
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        xpReward: true,
        topics: true,
        statement: true,
        templates: true,
        testCases: true
      }
    });

    console.log('\n✅ VERIFICATION RESULTS FOR 6 NEW DSA PROBLEMS');
    console.log('='.repeat(90));
    
    let allComplete = true;
    
    problems.forEach((p, idx) => {
      const hasStatement = p.statement && p.statement.length > 800;
      const hasTemplates = Array.isArray(p.templates) && p.templates.length >= 2;
      const hasTestCases = Array.isArray(p.testCases) && p.testCases.length >= 10;
      const templateCount = Array.isArray(p.templates) ? p.templates.length : 0;
      const testCaseCount = Array.isArray(p.testCases) ? p.testCases.length : 0;
      const isComplete = hasStatement && hasTemplates && hasTestCases;
      
      if (!isComplete) allComplete = false;
      
      console.log(`\n${idx + 1}. ${p.title}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Difficulty: ${p.difficulty} | XP: ${p.xpReward}`);
      console.log(`   Topics: ${Array.isArray(p.topics) ? p.topics.join(', ') : 'N/A'}`);
      console.log(`   📝 Statement: ${p.statement?.length || 0} chars ${hasStatement ? '✅' : '❌ (needs 800+)'}`);
      console.log(`   📚 Templates: ${templateCount} languages ${hasTemplates ? '✅' : '❌ (needs 2+)'}`);
      console.log(`   🧪 Test Cases: ${testCaseCount} cases ${hasTestCases ? '✅' : '❌ (needs 10+)'}`);
      console.log(`   Status: ${isComplete ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
    });
    
    console.log(`\n${'-'.repeat(90)}`);
    console.log(`📊 Summary:`);
    console.log(`   Total Problems Created: ${problems.length}/6`);
    console.log(`   All Complete: ${allComplete ? '✅ YES' : '❌ NO'}`);
    console.log(`\n${allComplete ? '✅ ALL PROBLEMS SUCCESSFULLY CREATED WITH COMPREHENSIVE CONTENT!' : '❌ Some problems need completion'}\n`);
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyProblemsCreated();
