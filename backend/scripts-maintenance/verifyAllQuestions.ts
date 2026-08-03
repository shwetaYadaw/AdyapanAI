import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    console.log('📊 Verifying all questions in database...\n');

    // Get total count
    const totalCount = await prisma.question.count();
    console.log(`✓ Total questions: ${totalCount}\n`);

    // Get all questions to check for issues
    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        statement: true,
        difficulty: true,
        topics: true,
        testCases: true,
        createdAt: true
      },
      take: 10000
    });

    console.log(`Retrieved ${allQuestions.length} questions from database\n`);

    // Check for issues
    let issuesFound = 0;

    // 1. Check for null/empty titles
    const noTitle = allQuestions.filter(q => !q.title || q.title.trim() === '');
    if (noTitle.length > 0) {
      console.log(`❌ Questions with missing title: ${noTitle.length}`);
      noTitle.forEach(q => console.log(`   - ${q.slug}`));
      issuesFound += noTitle.length;
    } else {
      console.log('✓ All questions have titles');
    }

    // 2. Check for null/empty statements
    const noStatement = allQuestions.filter(q => !q.statement || q.statement.trim() === '');
    if (noStatement.length > 0) {
      console.log(`\n❌ Questions with missing statement: ${noStatement.length}`);
      noStatement.forEach(q => console.log(`   - ${q.slug}`));
      issuesFound += noStatement.length;
    } else {
      console.log('✓ All questions have statements');
    }

    // 3. Check for null/empty testCases
    const noTestCases = allQuestions.filter(q => !q.testCases || (Array.isArray(q.testCases) && q.testCases.length === 0));
    if (noTestCases.length > 0) {
      console.log(`\n❌ Questions with missing test cases: ${noTestCases.length}`);
      noTestCases.slice(0, 5).forEach(q => console.log(`   - ${q.slug}`));
      if (noTestCases.length > 5) console.log(`   ... and ${noTestCases.length - 5} more`);
      issuesFound += noTestCases.length;
    } else {
      console.log('✓ All questions have test cases');
    }

    // 4. Check for duplicate slugs
    const slugMap: Record<string, number> = {};
    for (const q of allQuestions) {
      slugMap[q.slug] = (slugMap[q.slug] || 0) + 1;
    }
    const duplicates = Object.entries(slugMap).filter(([, count]) => count > 1);
    if (duplicates.length > 0) {
      console.log(`\n❌ Found ${duplicates.length} duplicate slugs:`);
      duplicates.forEach(([slug, count]) => console.log(`   - ${slug}: ${count} times`));
      issuesFound += duplicates.length;
    } else {
      console.log('✓ No duplicate slugs found');
    }

    // 5. Check for null/invalid difficulty
    const noDifficulty = allQuestions.filter(q => !q.difficulty || !['easy', 'medium', 'hard'].includes(q.difficulty));
    if (noDifficulty.length > 0) {
      console.log(`\n❌ Questions with invalid difficulty: ${noDifficulty.length}`);
      noDifficulty.slice(0, 5).forEach(q => console.log(`   - ${q.slug}: ${q.difficulty}`));
      issuesFound += noDifficulty.length;
    } else {
      console.log('✓ All questions have valid difficulty levels');
    }

    // 6. Check topics distribution
    console.log('\n📚 Questions by topic:');
    const topicCounts: Record<string, number> = {};
    for (const q of allQuestions) {
      for (const topic of q.topics) {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      }
    }

    Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([topic, count]) => {
        console.log(`   - ${topic}: ${count}`);
      });

    // 7. Sample problems to verify
    console.log('\n📋 Sample questions (first 3):');
    allQuestions.slice(0, 3).forEach((q) => {
      console.log(`\n   ✓ ${q.slug}`);
      console.log(`     Title: ${q.title}`);
      console.log(`     Difficulty: ${q.difficulty}`);
      console.log(`     Topics: ${q.topics.join(', ')}`);
      console.log(`     Test cases: ${(q.testCases as any)?.length || 0}`);
      console.log(`     Statement length: ${q.statement.length} chars`);
    });

    console.log('\n' + '='.repeat(60));
    if (issuesFound === 0) {
      console.log('✅ All questions are properly sorted and valid!');
    } else {
      console.log(`❌ Found ${issuesFound} issues that need to be fixed`);
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
