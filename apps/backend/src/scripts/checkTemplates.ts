import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const q = await prisma.question.findFirst({
    where: { slug: { contains: 'rotate-array-by-k-elements' } }
  });
  console.log('Found question:', q?.title);
  console.log('Templates:', JSON.stringify(q?.templates, null, 2));
}

main().finally(() => prisma.$disconnect());
