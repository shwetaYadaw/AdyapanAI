import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check Container With Most Water question
    const containerQ = await prisma.question.findFirst({
      where: { title: { contains: 'Container' } }
    });
    
    // Count total questions
    const totalCount = await prisma.question.count();
    
    console.log('✅ Container Question Found:', !!containerQ);
    if (containerQ) {
      console.log('  - Title:', containerQ.title);
      console.log('  - Slug:', containerQ.slug);
      console.log('  - Test Cases:', JSON.parse(containerQ.testCases as any).length);
    }
    console.log('✅ Total Questions in DB:', totalCount);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => { console.error('Error:', e); process.exit(1); });
