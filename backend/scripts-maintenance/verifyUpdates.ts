import { prisma } from '../config/prisma';

async function verifyUpdates() {
  try {
    const ids = [
      'e484f9ef-cb3e-4aa2-8e4a-a2f463c8e9f4',
      'fb32e963-d583-4c1e-9e1a-76d61c27be28',
      '0e7c8db2-74cd-46c3-a991-dd18e6bbe29c',
      '0cccc1fa-4067-4845-aefa-019ffa56d613'
    ];

    console.log('Verifying updated problems:\n');
    
    for (const id of ids) {
      const problem = await prisma.question.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          slug: true,
          statement: true,
          templates: true,
          testCases: true
        }
      });

      if (problem) {
        console.log(`✅ ${problem.title}`);
        console.log(`   ID: ${problem.id}`);
        console.log(`   Slug: ${problem.slug}`);
        const statementLength = problem.statement?.length || 0;
        console.log(`   Statement length: ${statementLength} chars`);
        console.log(`   Templates: ${Array.isArray(problem.templates) ? problem.templates.length : 0}`);
        const testCasesArray = Array.isArray(problem.testCases) ? problem.testCases : [];
        console.log(`   Test cases: ${testCasesArray.length}\n`);
      } else {
        console.log(`❌ Problem not found: ${id}\n`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUpdates();
