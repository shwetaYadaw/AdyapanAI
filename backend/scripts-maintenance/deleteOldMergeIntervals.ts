import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldMergeIntervals() {
  try {
    console.log('🔍 Looking for old "Merge Overlapping Intervals" question...\n');

    // Find questions with similar slugs
    const oldQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-merge-overlapping-intervals' }
    });

    if (oldQuestion && oldQuestion.statement && oldQuestion.statement.includes('Practice solving')) {
      console.log(`❌ Found old question: "${oldQuestion.title}"`);
      console.log(`   Slug: ${oldQuestion.slug}`);
      console.log(`   ID: ${oldQuestion.id}\n`);

      // Delete it
      await prisma.question.delete({
        where: { slug: 'arrays-merge-overlapping-intervals' }
      });

      console.log('✅ Old question deleted successfully!\n');
    } else {
      console.log('✅ No old generic "Merge Overlapping Intervals" found\n');
    }

    // Verify the new one exists
    const newQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-overlapping-intervals' }
    });

    if (newQuestion) {
      console.log(`✅ New question confirmed: "${newQuestion.title}"`);
      console.log(`   Slug: ${newQuestion.slug}`);
      console.log(`   Statement preview: ${newQuestion.statement?.substring(0, 80)}...`);
    } else {
      console.log('⚠️  New question not found with expected slug');
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteOldMergeIntervals();
