import { prisma } from '../config/prisma';

/**
 * Script to delete all questions from the Question table EXCEPT
 * those that belong to the 6 TCS NQT topics:
 * - Arrays
 * - Strings
 * - Searching & Sorting
 * - Hashing
 * - Linked List
 * - Recursion & Backtracking
 */

// Define the allowed TCS NQT topics (same as frontend)
const ALLOWED_TOPICS = [
  'arrays',
  'array',
  '2d-arrays',
  'strings',
  'string',
  'searching-sorting',
  'sorting',
  'binary-search',
  'hashing',
  'linked-list',
  'recursion-backtracking',
  'recursion',
];

async function deleteNonTcsNqtQuestions() {
  try {
    console.log('🔍 Starting TCS NQT question cleanup...\n');

    // 1. Get all questions from database
    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true,
      },
    });

    console.log(`📊 Total questions in database: ${allQuestions.length}`);

    // 2. Filter to find questions that should be KEPT (have at least one allowed topic)
    const questionsToKeep = allQuestions.filter((question) => {
      // Parse topics (could be JSON string or array)
      let questionTopics: string[] = [];
      if (Array.isArray(question.topics)) {
        questionTopics = question.topics;
      } else if (typeof question.topics === 'string') {
        try {
          questionTopics = JSON.parse(question.topics);
        } catch {
          questionTopics = [];
        }
      }

      // Convert to lowercase for comparison
      const topicsLower = questionTopics.map((t: string) => t.toLowerCase());

      // Keep if has at least one allowed topic
      return topicsLower.some((topic) => ALLOWED_TOPICS.includes(topic));
    });

    console.log(`✅ Questions to KEEP (TCS NQT relevant): ${questionsToKeep.length}`);

    // 3. Find questions to DELETE
    const keepIds = new Set(questionsToKeep.map((q) => q.id));
    const questionsToDelete = allQuestions.filter((q) => !keepIds.has(q.id));

    console.log(`❌ Questions to DELETE (not TCS NQT): ${questionsToDelete.length}\n`);

    if (questionsToDelete.length === 0) {
      console.log('✅ No questions to delete. All questions are TCS NQT relevant!');
      return;
    }

    // 4. Show sample of questions that will be deleted
    console.log('📋 Sample of questions to be deleted:');
    questionsToDelete.slice(0, 10).forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.title} (${q.slug})`);
    });
    if (questionsToDelete.length > 10) {
      console.log(`   ... and ${questionsToDelete.length - 10} more\n`);
    }

    // 5. Show breakdown by topic for questions being kept
    console.log('\n📊 Breakdown of questions being KEPT by topic:');
    const topicCounts: Record<string, number> = {};
    questionsToKeep.forEach((question) => {
      let topics: string[] = [];
      if (Array.isArray(question.topics)) {
        topics = question.topics;
      } else if (typeof question.topics === 'string') {
        try {
          topics = JSON.parse(question.topics);
        } catch {
          topics = [];
        }
      }
      topics.forEach((topic: string) => {
        const topicLower = topic.toLowerCase();
        if (ALLOWED_TOPICS.includes(topicLower)) {
          topicCounts[topicLower] = (topicCounts[topicLower] || 0) + 1;
        }
      });
    });
    Object.entries(topicCounts).forEach(([topic, count]) => {
      console.log(`   - ${topic}: ${count} questions`);
    });

    // 6. Confirm deletion
    console.log('\n⚠️  WARNING: This will PERMANENTLY delete the questions from the database!');
    console.log(`   - Questions to DELETE: ${questionsToDelete.length}`);
    console.log(`   - Questions to KEEP: ${questionsToKeep.length}`);

    // For safety, require manual confirmation
    console.log('\n🛑 SAFETY CHECK: Please review the counts above.');
    console.log('   To proceed with deletion, run this script with --confirm flag:');
    console.log('   npm run script:delete-non-tcs-nqt -- --confirm\n');

    if (!process.argv.includes('--confirm')) {
      console.log('❌ Deletion cancelled. Run with --confirm to proceed.');
      return;
    }

    // 7. Delete questions
    console.log('\n🗑️  Deleting questions...');

    const deleteIds = questionsToDelete.map((q) => q.id);

    // Delete in batches of 50 to avoid query size limits
    const batchSize = 50;
    let deletedCount = 0;

    for (let i = 0; i < deleteIds.length; i += batchSize) {
      const batch = deleteIds.slice(i, i + batchSize);
      const result = await prisma.question.deleteMany({
        where: {
          id: {
            in: batch,
          },
        },
      });
      deletedCount += result.count;
      console.log(`   Deleted batch ${Math.floor(i / batchSize) + 1}: ${result.count} questions`);
    }

    console.log(`\n✅ Successfully deleted ${deletedCount} questions!`);
    console.log(`✅ Remaining questions in database: ${questionsToKeep.length} (TCS NQT only)`);

    // 8. Verify final count
    const finalCount = await prisma.question.count();
    console.log(`\n✅ Verification: Database now has ${finalCount} questions`);

    if (finalCount === questionsToKeep.length) {
      console.log('✅ Success! Database cleanup complete.\n');
    } else {
      console.log('⚠️  Warning: Final count does not match expected. Please verify manually.\n');
    }
  } catch (error) {
    console.error('❌ Error during deletion:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
deleteNonTcsNqtQuestions()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
