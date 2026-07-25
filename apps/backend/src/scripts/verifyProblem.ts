import { prisma } from '../config/prisma';

async function verify() {
  try {
    const problem = await prisma.problem.findUnique({
      where: { slug: 'find-smallest-second-smallest-in-array' },
      include: { testCases: true }
    });
    
    if (!problem) {
      console.log('❌ Problem not found!');
      return;
    }
    
    console.log('✅ Problem found!');
    console.log('   Title:', problem.title);
    console.log('   Difficulty:', problem.difficulty);
    console.log('   Topics:', problem.topics);
    console.log('   Companies:', problem.companies);
    console.log('   Test Cases:', problem.testCases.length);
    console.log('   Reference Solution Length:', problem.referenceSolution.length, 'chars');
    console.log('   Statement Length:', problem.statement.length, 'chars');
    
    console.log('\n📊 Starter Code Languages:');
    const starterCode = problem.starterCode as any;
    if (starterCode) {
      Object.keys(starterCode).forEach(lang => {
        const code = starterCode[lang] as string;
        console.log(`   ${lang}: ${code.length} chars`);
      });
    }
    
    console.log('\n📋 Test Cases:');
    problem.testCases.slice(0, 3).forEach((tc, i) => {
      console.log(`   Test ${i + 1}: Input: ${tc.input.substring(0, 30)}... -> Output: ${tc.expectedOutput}`);
    });
    if (problem.testCases.length > 3) {
      console.log(`   ... and ${problem.testCases.length - 3} more test cases`);
    }
    
    console.log('\n📈 Total Problems in Database:');
    const totalProblems = await prisma.problem.count();
    console.log('   Total:', totalProblems);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
