import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldSubarrayQuestion() {
  try {
    console.log('🔍 Looking for old "Subarray Sum Divisible K" question...\n');

    // Find the old question with the old slug (without "sums" and without "by")
    const oldQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-subarray-sum-divisible-k' }
    });

    if (oldQuestion && oldQuestion.title === 'Subarray Sum Divisible K') {
      console.log(`❌ Found old question: "${oldQuestion.title}"`);
      console.log(`   Slug: ${oldQuestion.slug}`);
      console.log(`   ID: ${oldQuestion.id}\n`);

      // Delete it
      await prisma.question.delete({
        where: { slug: 'arrays-subarray-sum-divisible-k' }
      });

      console.log('✅ Old question deleted successfully!\n');
    } else {
      console.log('✅ No old "Subarray Sum Divisible K" found - only new version exists\n');
    }

    // Verify the new one exists
    const newQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-subarray-sums-divisible-by-k' }
    });

    if (newQuestion) {
      console.log(`✅ New question confirmed: "${newQuestion.title}"`);
      console.log(`   Slug: ${newQuestion.slug}`);
    } else {
      console.log('⚠️  New question not found - reseeding may be needed');
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteOldSubarrayQuestion();
