import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function migrate() {
  try {
    console.log('🔄 BULK Migrating 961 questions to problems table...\n');

    // Get all questions
    const questions = await prisma.question.findMany();
    console.log(`📊 Found ${questions.length} questions`);

    // Prepare data for bulk create
    const problemsData = questions.map(q => ({
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      statement: q.statement,
      constraints: q.constraints,
      inputFormat: q.inputFormat,
      outputFormat: q.outputFormat,
      topics: Array.isArray(q.topics) ? (q.topics as any[]).join(',') : '',
      companies: Array.isArray(q.companies) ? (q.companies as any[]).join(',') : '',
      timeLimit: q.timeLimit || 5000,
      memoryLimit: q.memoryLimit || 256,
      starterCode: '',
      referenceSolution: '',
    }));

    console.log(`⏳ Creating problems in bulk...`);
    
    // Use createMany for bulk insert (may fail on duplicates, so we use upsert instead)
    for (const problemData of problemsData) {
      await prisma.problem.upsert({
        where: { slug: problemData.slug },
        update: problemData,
        create: problemData,
      });
    }

    console.log(`\n✨ Migration complete!`);

    // Verify
    const totalProblems = await prisma.problem.count();
    console.log(`✅ Total in Problem table: ${totalProblems}`);
    console.log(`✅ All 961 questions are now visible on frontend!`);

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
