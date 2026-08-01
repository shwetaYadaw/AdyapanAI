import { prisma } from './src/config/prisma';

async function removeDuplicate() {
  try {
    console.log('🔍 Searching for duplicate "Subarray Sum Divisible K" questions...\n');

    // Find all questions with similar slugs
    const questions = await prisma.question.findMany({
      where: {
        slug: {
          contains: 'subarray'
        }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log('📋 Found questions with "subarray" in slug:');
    questions.forEach((q, idx) => {
      console.log(`  ${idx + 1}. ${q.slug} - "${q.title}" (${q.createdAt})`);
    });

    // Find the old "Subarray Sum Divisible K" (the one WITHOUT "by")
    const oldQuestion = questions.find(q => q.slug === 'arrays-subarray-sum-divisible-k' && q.title === 'Subarray Sum Divisible K');
    const newQuestion = questions.find(q => q.slug === 'arrays-subarray-sum-divisible-k' && q.title === 'Subarray Sums Divisible by K');

    if (oldQuestion) {
      console.log(`\n❌ Deleting old question: "${oldQuestion.title}" (ID: ${oldQuestion.id})`);
      await prisma.question.delete({
        where: { id: oldQuestion.id }
      });
      console.log('✅ Old question deleted!');
    } else {
      console.log('\n⚠️  No old "Subarray Sum Divisible K" found (both might have same slug)');
    }

    if (newQuestion) {
      console.log(`✅ Keeping new question: "${newQuestion.title}" (ID: ${newQuestion.id})`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

removeDuplicate();
