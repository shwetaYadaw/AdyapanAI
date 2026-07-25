import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function countQuestions() {
  try {
    console.log('📊 Counting questions in database...\n');

    // Total count
    const totalCount = await prisma.question.count();
    console.log(`Total Questions: ${totalCount}`);

    // Find recently added questions (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentQuestions = await prisma.question.findMany({
      where: {
        createdAt: {
          gte: today
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📅 Questions added today: ${recentQuestions.length}`);
    if (recentQuestions.length > 0) {
      console.log('\nRecent questions:');
      recentQuestions.forEach((q, i) => {
        console.log(`${i + 1}. ${q.title}`);
        console.log(`   Slug: ${q.slug}`);
        console.log(`   ID: ${q.id}`);
        console.log(`   Created: ${q.createdAt}`);
        console.log('');
      });
    }

    // Check for duplicate problems
    const allQuestions = await prisma.question.findMany({
      select: {
        title: true,
        slug: true
      }
    });

    const titleCounts: Record<string, number> = {};
    const slugCounts: Record<string, number> = {};

    allQuestions.forEach(q => {
      titleCounts[q.title] = (titleCounts[q.title] || 0) + 1;
      slugCounts[q.slug] = (slugCounts[q.slug] || 0) + 1;
    });

    const duplicateTitles = Object.entries(titleCounts).filter(([_, count]) => count > 1);
    const duplicateSlugs = Object.entries(slugCounts).filter(([_, count]) => count > 1);

    if (duplicateTitles.length > 0) {
      console.log('\n⚠️  Duplicate titles found:');
      duplicateTitles.forEach(([title, count]) => {
        console.log(`   "${title}" - ${count} times`);
      });
    }

    if (duplicateSlugs.length > 0) {
      console.log('\n⚠️  Duplicate slugs found:');
      duplicateSlugs.forEach(([slug, count]) => {
        console.log(`   "${slug}" - ${count} times`);
      });
    }

    if (duplicateTitles.length === 0 && duplicateSlugs.length === 0) {
      console.log('\n✅ No duplicates found');
    }

    // Expected count
    const expectedCount = 545;
    const difference = totalCount - expectedCount;
    
    console.log(`\n📈 Analysis:`);
    console.log(`Expected: ${expectedCount} questions`);
    console.log(`Actual: ${totalCount} questions`);
    console.log(`Difference: ${difference > 0 ? '+' : ''}${difference} questions`);

    if (difference > 0) {
      console.log(`\n💡 Reason: ${difference} additional questions were added (likely the problems we updated today)`);
    }

  } catch (error) {
    console.error('❌ Error counting questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countQuestions();
