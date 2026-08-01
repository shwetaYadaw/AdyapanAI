import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function deleteOldGivenSumPair() {
  try {
    console.log('🔍 Looking for old "Given Sum Pair" question...\n');

    // Find the old question with generic statement
    const oldQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-given-sum-pair' }
    });

    if (oldQuestion && oldQuestion.statement && oldQuestion.statement.includes('Practice solving')) {
      console.log(`❌ Found old question: "${oldQuestion.title}"`);
      console.log(`   Slug: ${oldQuestion.slug}`);
      console.log(`   ID: ${oldQuestion.id}\n`);

      // Delete it
      await prisma.question.delete({
        where: { slug: 'arrays-given-sum-pair' }
      });

      console.log('✅ Old question deleted successfully!\n');
    } else {
      console.log('✅ No old "Given Sum Pair" found\n');
    }

    // Verify the new one exists
    const newQuestion = await prisma.question.findUnique({
      where: { slug: 'arrays-two-sum---pair-with-given-sum' }
    });

    if (newQuestion) {
      console.log(`✅ New question confirmed: "${newQuestion.title}"`);
      console.log(`   Slug: ${newQuestion.slug}`);
      console.log(`   Sample Output: ${newQuestion.sampleOutput}`);
    } else {
      // Try alternative slug
      const altQuestion = await prisma.question.findMany({
        where: {
          slug: { contains: 'two-sum' }
        },
        select: { slug: true, title: true }
      });
      
      if (altQuestion.length > 0) {
        console.log(`✅ New question found with alternative slug:`);
        altQuestion.forEach(q => console.log(`   - ${q.title} (${q.slug})`));
      } else {
        console.log('⚠️  New question not found');
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

deleteOldGivenSumPair();
