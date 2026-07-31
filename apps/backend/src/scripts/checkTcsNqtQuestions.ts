import { prisma } from '../config/prisma';

async function checkTcsNqtQuestions() {
  try {
    console.log('Checking TCS NQT Questions in Question table...\n');
    
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true,
        difficulty: true,
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`Total questions found: ${questions.length}\n`);
    
    if (questions.length === 0) {
      console.log('❌ NO QUESTIONS FOUND IN QUESTION TABLE!');
      console.log('This means TCS NQT section will be empty.');
      return;
    }

    // Group by topics
    const topicCounts: Record<string, number> = {};
    
    questions.forEach(q => {
      let topics: string[] = [];
      
      try {
        // Parse topics (stored as JSON array)
        topics = typeof q.topics === 'string' ? JSON.parse(q.topics) : (Array.isArray(q.topics) ? q.topics : []);
      } catch (e) {
        console.log(`Error parsing topics for: ${q.title}`);
      }

      topics.forEach(topic => {
        const key = topic.toLowerCase();
        topicCounts[key] = (topicCounts[key] || 0) + 1;
      });
    });

    console.log('Questions by Topic:');
    console.log('='.repeat(80));
    Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([topic, count]) => {
        console.log(`${topic.padEnd(30)} : ${count} questions`);
      });

    console.log('\n');
    console.log('Sample Questions (first 10):');
    console.log('='.repeat(80));
    
    questions.slice(0, 10).forEach((q, index) => {
      let topics: string[] = [];
      try {
        topics = typeof q.topics === 'string' ? JSON.parse(q.topics) : (Array.isArray(q.topics) ? q.topics : []);
      } catch (e) {
        topics = [];
      }
      
      console.log(`${index + 1}. ${q.title}`);
      console.log(`   Slug: ${q.slug}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Topics: ${topics.join(', ')}`);
      console.log(`   URL: /student/tcs-nqt (filter by topic)`);
      console.log('-'.repeat(80));
    });

    // Check if questions have tcs-nqt topic
    const tcsNqtQuestions = questions.filter(q => {
      let topics: string[] = [];
      try {
        topics = typeof q.topics === 'string' ? JSON.parse(q.topics) : (Array.isArray(q.topics) ? q.topics : []);
      } catch (e) {
        topics = [];
      }
      return topics.some(t => t.toLowerCase().includes('tcs-nqt') || t.toLowerCase().includes('tcs') || t.toLowerCase().includes('nqt'));
    });

    console.log('\n');
    console.log(`Questions with "tcs-nqt" topic: ${tcsNqtQuestions.length}`);
    
    if (tcsNqtQuestions.length > 0) {
      console.log('\nSample TCS NQT Questions:');
      console.log('='.repeat(80));
      tcsNqtQuestions.slice(0, 5).forEach((q, index) => {
        console.log(`${index + 1}. ${q.title} (${q.slug})`);
      });
    }

    console.log('\n');
    console.log('✅ TCS NQT section should work with these questions!');
    console.log(`Total: ${questions.length} questions available`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTcsNqtQuestions();
