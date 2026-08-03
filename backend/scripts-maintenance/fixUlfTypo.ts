import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing "ulf-8" typo in JavaScript/TypeScript templates across all questions...');

  const questions = await prisma.question.findMany();
  let updatedCount = 0;

  for (const question of questions) {
    let templatesStr = JSON.stringify(question.templates);
    if (templatesStr.includes('ulf-8')) {
      templatesStr = templatesStr.replace(/ulf-8/g, 'utf-8');
      const updatedTemplates = JSON.parse(templatesStr);

      await prisma.question.update({
        where: { id: question.id },
        data: {
          templates: updatedTemplates
        }
      });
      console.log(`Updated templates for: "${question.title}"`);
      updatedCount++;
    }
  }

  console.log(`✅ Successfully updated ${updatedCount} questions in MySQL database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
