import { prisma } from '../config/prisma';

interface TestCase {
  input: string;
  expectedOutput?: string;
  output?: string;
  isHidden?: boolean;
  type?: string;
}

interface QuestionAnalysis {
  slug: string;
  title: string;
  hasTestCases: boolean;
  testCaseCount: number;
  visibleTestCases: number;
  hiddenTestCases: number;
  hasProperFormat: boolean;
}

const TCS_NQT_TOPICS = [
  'arrays',
  'strings', 
  'searching-sorting',
  'hashing',
  'linked-list',
  'recursion-backtracking'
];

async function analyzeTcsNqtTestCases() {
  console.log('\n📊 TCS NQT Test Cases Analysis\n');
  console.log('='.repeat(80));

  const allQuestions = await prisma.question.findMany({
    select: {
      slug: true,
      title: true,
      topics: true,
      testCases: true,
    }
  });

  // Filter TCS NQT questions by topics
  const tcsNqtQuestions = allQuestions.filter(q => {
    const topics = Array.isArray(q.topics) ? q.topics : [];
    const topicsLower = topics.map((t: any) => String(t).toLowerCase());
    return topicsLower.some(topic => TCS_NQT_TOPICS.includes(topic));
  });

  // Analyze by topic
  const topicStats: Record<string, {
    total: number;
    withTestCases: number;
    withoutTestCases: number;
    withProperFormat: number;
    questions: QuestionAnalysis[];
  }> = {};

  // Initialize stats for each topic
  TCS_NQT_TOPICS.forEach(topic => {
    topicStats[topic] = {
      total: 0,
      withTestCases: 0,
      withoutTestCases: 0,
      withProperFormat: 0,
      questions: []
    };
  });

  // Analyze each question
  for (const question of tcsNqtQuestions) {
    const topics = Array.isArray(question.topics) ? question.topics : [];
    const topicsLower = topics.map((t: any) => String(t).toLowerCase());
    
    // Parse test cases
    let testCases: TestCase[] = [];
    try {
      testCases = Array.isArray(question.testCases) 
        ? (question.testCases as any[])
        : [];
    } catch (e) {
      testCases = [];
    }

    const visibleTestCases = testCases.filter(tc => !tc.isHidden);
    const hiddenTestCases = testCases.filter(tc => tc.isHidden);

    // Check if test cases have proper format
    const hasProperFormat = testCases.length > 0 && testCases.every(tc => 
      tc.input && 
      (tc.expectedOutput || tc.output) &&
      tc.input.trim().length > 0 &&
      ((tc.expectedOutput && tc.expectedOutput.trim().length > 0) || 
       (tc.output && tc.output.trim().length > 0))
    );

    const analysis: QuestionAnalysis = {
      slug: question.slug,
      title: question.title,
      hasTestCases: testCases.length > 0,
      testCaseCount: testCases.length,
      visibleTestCases: visibleTestCases.length,
      hiddenTestCases: hiddenTestCases.length,
      hasProperFormat
    };

    // Add to each matching topic
    topicsLower.forEach(topic => {
      if (TCS_NQT_TOPICS.includes(topic)) {
        topicStats[topic].total++;
        if (analysis.hasTestCases) {
          topicStats[topic].withTestCases++;
        } else {
          topicStats[topic].withoutTestCases++;
        }
        if (analysis.hasProperFormat) {
          topicStats[topic].withProperFormat++;
        }
        topicStats[topic].questions.push(analysis);
      }
    });
  }

  // Print summary
  console.log('\n📋 SUMMARY BY TOPIC\n');
  
  let grandTotal = 0;
  let grandWithTestCases = 0;
  let grandWithoutTestCases = 0;
  let grandWithProperFormat = 0;

  TCS_NQT_TOPICS.forEach(topic => {
    const stats = topicStats[topic];
    grandTotal += stats.total;
    grandWithTestCases += stats.withTestCases;
    grandWithoutTestCases += stats.withoutTestCases;
    grandWithProperFormat += stats.withProperFormat;

    const topicName = topic.replace('-', ' & ').toUpperCase();
    console.log(`\n${topicName}`);
    console.log('-'.repeat(80));
    console.log(`  Total Questions:              ${stats.total}`);
    console.log(`  ✅ With Test Cases:           ${stats.withTestCases} (${((stats.withTestCases/stats.total)*100).toFixed(1)}%)`);
    console.log(`  ❌ Without Test Cases:        ${stats.withoutTestCases} (${((stats.withoutTestCases/stats.total)*100).toFixed(1)}%)`);
    console.log(`  🎯 Proper Format (complete):  ${stats.withProperFormat} (${((stats.withProperFormat/stats.total)*100).toFixed(1)}%)`);
  });

  // Grand total
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 OVERALL STATISTICS\n');
  console.log(`  Total TCS NQT Questions:      ${grandTotal}`);
  console.log(`  ✅ With Test Cases:           ${grandWithTestCases} (${((grandWithTestCases/grandTotal)*100).toFixed(1)}%)`);
  console.log(`  ❌ Without Test Cases:        ${grandWithoutTestCases} (${((grandWithoutTestCases/grandTotal)*100).toFixed(1)}%)`);
  console.log(`  🎯 Proper Format (complete):  ${grandWithProperFormat} (${((grandWithProperFormat/grandTotal)*100).toFixed(1)}%)`);

  // Detailed breakdown by topic
  console.log('\n' + '='.repeat(80));
  console.log('\n📝 DETAILED BREAKDOWN\n');

  TCS_NQT_TOPICS.forEach(topic => {
    const stats = topicStats[topic];
    const topicName = topic.replace('-', ' & ').toUpperCase();
    
    console.log(`\n${topicName} - Questions WITHOUT Test Cases:`);
    console.log('-'.repeat(80));
    
    const questionsWithoutTestCases = stats.questions.filter(q => !q.hasTestCases);
    if (questionsWithoutTestCases.length === 0) {
      console.log('  ✅ All questions have test cases!');
    } else {
      questionsWithoutTestCases.forEach((q, index) => {
        console.log(`  ${index + 1}. ${q.title}`);
        console.log(`     Slug: ${q.slug}`);
      });
    }

    console.log(`\n${topicName} - Questions WITH Incomplete Test Cases:`);
    console.log('-'.repeat(80));
    
    const questionsWithIncompleteTestCases = stats.questions.filter(q => q.hasTestCases && !q.hasProperFormat);
    if (questionsWithIncompleteTestCases.length === 0) {
      console.log('  ✅ All questions with test cases have proper format!');
    } else {
      questionsWithIncompleteTestCases.forEach((q, index) => {
        console.log(`  ${index + 1}. ${q.title}`);
        console.log(`     Slug: ${q.slug}`);
        console.log(`     Test Cases: ${q.testCaseCount} (${q.visibleTestCases} visible, ${q.hiddenTestCases} hidden)`);
      });
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✨ Analysis Complete!\n');
}

analyzeTcsNqtTestCases()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
