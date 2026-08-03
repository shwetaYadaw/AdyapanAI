import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldKthSmallest() {
  try {
    console.log('🔍 Looking for old "Kth - Smallest Element" question...\n');

    // Find the old question
    const oldQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-kth---smallest-element' }
    });

    if (oldQuestion && oldQuestion.statement && oldQuestion.statement.includes('Practice solving')) {
      console.log(`❌ Found old question: "${oldQuestion.title}"`);
      console.log(`   Slug: ${oldQuestion.slug}`);
      console.log(`   ID: ${oldQuestion.id}\n`);

      // Delete it
      await prisma.question.delete({
        where: { slug: 'arrays-kth---smallest-element' }
      });

      console.log('✅ Old question deleted successfully!\n');
    } else if (oldQuestion) {
      console.log(`⚠️  Found question: "${oldQuestion.title}" but doesn't match old pattern\n`);
    } else {
      console.log('✅ No old "Kth - Smallest Element" found\n');
    }

    // Verify the new one exists
    const newQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-kth-smallest' }
    });

    if (newQuestion) {
      console.log(`✅ New question confirmed: "${newQuestion.title}"`);
      console.log(`   Slug: ${newQuestion.slug}`);
      console.log(`   Sample Output: ${newQuestion.sampleOutput}`);
    } else {
      console.log('⚠️  New question not found - checking alternative slug');
      
      // Try alternative slugs
      const questions = await prisma.question.findMany({
        where: {
          slug: { contains: 'kth' }
        },
        select: { slug: true, title: true }
      });
      
      if (questions.length > 0) {
        console.log('Found similar questions:');
        questions.forEach(q => console.log(`  - ${q.title} (${q.slug})`));
      }
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteOldKthSmallest();
