import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Chocolate Distribution Problem test cases...');

  const slug = 'chocolate-distribution-problem-arrays';
  const problem = await prisma.question.findUnique({
    where: { slug }
  });

  if (!problem) {
    console.error(`Question with slug "${slug}" not found in database.`);
    process.exit(1);
  }

  const sampleInput = `7 3 2 4 9 12 56\n3`;
  const sampleOutput = `2`;

  const testCases = [
    { input: `7 3 2 4 9 12 56\n3`, output: `2`, isHidden: false },
    { input: `3 4 1 9 56 7 9 12\n5`, output: `6`, isHidden: false },
    { input: `12 4 7 9 2 23 25 41 30 40 28 42 30 44 48 43 50\n7`, output: `10`, isHidden: true },
    { input: `10 20 30 100 101 102\n3`, output: `2`, isHidden: true },
    { input: `6 3 2 8 9 10\n4`, output: `6`, isHidden: true }
  ];

  await prisma.question.update({
    where: { slug },
    data: {
      sampleInput,
      sampleOutput,
      testCases
    }
  });

  console.log('✅ Successfully updated Chocolate Distribution Problem in MySQL!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
