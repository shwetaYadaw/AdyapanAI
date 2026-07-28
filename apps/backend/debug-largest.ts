import { prisma } from './src/config/prisma';

async function check() {
  try {
    const problem = await prisma.question.findUnique({
      where: { slug: 'largest-in-array-tcs-nqt' }
    });
    
    if (problem) {
      console.log('✅ Found problem:', problem.title);
      console.log('📝 Sample Input:', problem.sampleInput);
      console.log('📝 Sample Output:', problem.sampleOutput);
      console.log('🧪 Test Cases:', JSON.stringify(problem.testCases, null, 2));
    } else {
      console.log('❌ Problem not found!');
      
      // List all questions to debug
      const allQuestions = await prisma.question.findMany({
        where: { slug: { contains: 'largest' } }
      });
      console.log('Questions with "largest":', allQuestions.map(q => ({ title: q.title, slug: q.slug })));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
