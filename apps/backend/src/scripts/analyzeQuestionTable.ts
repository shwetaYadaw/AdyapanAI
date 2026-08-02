import { prisma } from '../config/prisma';

/**
 * Analyze the Question table to understand where the 418 questions come from
 */

async function analyzeQuestionTable() {
  try {
    console.log('📊 Analyzing Question table...\n');

    // Get total count
    const totalCount = await prisma.question.count();
    console.log(`Total questions in database: ${totalCount}\n`);

    // Get all questions with topics
    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true,
      },
    });

    // Analyze by topics
    const topicCounts: Record<string, number> = {};
    const questionsWithoutTopics: any[] = [];

    allQuestions.forEach((question) => {
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

      if (topics.length === 0) {
        questionsWithoutTopics.push(question);
      } else {
        topics.forEach((topic: string) => {
          const topicLower = topic.toLowerCase();
          topicCounts[topicLower] = (topicCounts[topicLower] || 0) + 1;
        });
      }
    });

    console.log('📊 Questions by Topic:\n');
    const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
    sortedTopics.forEach(([topic, count]) => {
      console.log(`   ${topic.padEnd(30)} : ${count} questions`);
    });

    console.log(`\n📋 Questions without topics: ${questionsWithoutTopics.length}`);
    if (questionsWithoutTopics.length > 0) {
      console.log('\nSample questions without topics:');
      questionsWithoutTopics.slice(0, 5).forEach((q, i) => {
        console.log(`   ${i + 1}. ${q.title}`);
      });
    }

    // Check for TCS NQT specific topics
    const TCS_NQT_TOPICS = [
      'arrays', 'array', '2d-arrays',
      'strings', 'string',
      'searching-sorting', 'sorting', 'binary-search',
      'hashing',
      'linked-list',
      'recursion-backtracking', 'recursion'
    ];

    let tcsNqtCount = 0;
    let nonTcsNqtCount = 0;

    allQuestions.forEach((question) => {
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

      const topicsLower = topics.map(t => t.toLowerCase());
      const hasTcsNqtTopic = topicsLower.some(t => TCS_NQT_TOPICS.includes(t));

      if (hasTcsNqtTopic) {
        tcsNqtCount++;
      } else {
        nonTcsNqtCount++;
      }
    });

    console.log(`\n🎯 TCS NQT Analysis:`);
    console.log(`   Questions with TCS NQT topics (will be KEPT): ${tcsNqtCount}`);
    console.log(`   Questions without TCS NQT topics (will be DELETED): ${nonTcsNqtCount}`);
    console.log(`   Total: ${tcsNqtCount + nonTcsNqtCount}`);

    // Check for duplicates by slug
    const slugCounts: Record<string, number> = {};
    allQuestions.forEach((q) => {
      slugCounts[q.slug] = (slugCounts[q.slug] || 0) + 1;
    });

    const duplicateSlugs = Object.entries(slugCounts).filter(([_, count]) => count > 1);
    if (duplicateSlugs.length > 0) {
      console.log(`\n⚠️  Found ${duplicateSlugs.length} duplicate slugs:`);
      duplicateSlugs.slice(0, 5).forEach(([slug, count]) => {
        console.log(`   ${slug}: ${count} times`);
      });
    }

    // Sample of questions that will be deleted
    console.log(`\n🗑️  Sample questions that will be DELETED (non-TCS NQT):\n`);
    let deletedSampleCount = 0;
    for (const question of allQuestions) {
      if (deletedSampleCount >= 10) break;

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

      const topicsLower = topics.map(t => t.toLowerCase());
      const hasTcsNqtTopic = topicsLower.some(t => TCS_NQT_TOPICS.includes(t));

      if (!hasTcsNqtTopic) {
        console.log(`   ${deletedSampleCount + 1}. ${question.title}`);
        console.log(`      Topics: ${topics.join(', ') || 'none'}\n`);
        deletedSampleCount++;
      }
    }

    console.log('\n✅ Analysis complete!\n');

  } catch (error) {
    console.error('❌ Error during analysis:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

analyzeQuestionTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
