import { prisma } from './src/config/prisma';

async function migrateQuestionsToProblem() {
  try {
    console.log('🔄 Starting migration: Questions → Problems...\n');

    // Get all Coding Arena questions (not TCS NQT)
    const codingArenaQuestions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'coding-arena'
        },
        NOT: {
          topics: {
            array_contains: 'tcs-nqt'
          }
        }
      }
    });

    console.log(`📊 Found ${codingArenaQuestions.length} Coding Arena questions to migrate\n`);

    let migrated = 0;
    let failed = 0;

    for (const question of codingArenaQuestions) {
      try {
        // Check if problem already exists
        const existingProblem = await prisma.problem.findUnique({
          where: { slug: question.slug }
        });

        if (existingProblem) {
          console.log(`⏭️  Skipping: ${question.title} (already exists)`);
          continue;
        }

        // Create problem from question
        await prisma.problem.create({
          data: {
            title: question.title,
            slug: question.slug,
            statement: question.statement || '',
            difficulty: question.difficulty,
            topics: question.topics,
            companies: question.companies || [],
            inputFormat: question.inputFormat || '',
            outputFormat: question.outputFormat || '',
            constraints: question.constraints || '',
            sampleInput: question.sampleInput || '',
            sampleOutput: question.sampleOutput || '',
            timeLimit: question.timeLimit || 1000,
            memoryLimit: question.memoryLimit || 256,
            xpReward: question.xpReward || 0,
          }
        });

        console.log(`✅ Migrated: ${question.title}`);
        migrated++;
      } catch (err: any) {
        console.log(`❌ Failed to migrate: ${question.title} - ${err.message}`);
        failed++;
      }
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${migrated + failed}`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

migrateQuestionsToProblem();
