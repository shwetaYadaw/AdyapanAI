import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  try {
    console.log('🔍 Checking TCS NQT for duplicates...\n');

    // Get all TCS NQT questions
    const tcsQuestions = await prisma.question.findMany({
      where: {
        slug: {
          endsWith: '-tcs-nqt'
        }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true
      },
      orderBy: {
        slug: 'asc'
      }
    });

    console.log(`Total TCS NQT questions: ${tcsQuestions.length}\n`);

    // Find duplicates by slug
    const slugCount: Record<string, number> = {};
    const slugToQuestions: Record<string, any[]> = {};

    for (const q of tcsQuestions) {
      slugCount[q.slug] = (slugCount[q.slug] || 0) + 1;
      if (!slugToQuestions[q.slug]) {
        slugToQuestions[q.slug] = [];
      }
      slugToQuestions[q.slug].push(q);
    }

    // Show duplicates
    let duplicateCount = 0;
    for (const [slug, count] of Object.entries(slugCount)) {
      if (count > 1) {
        duplicateCount++;
        console.log(`❌ Duplicate: ${slug} (${count} copies)`);
        slugToQuestions[slug].forEach((q, idx) => {
          console.log(`   ${idx + 1}. ID: ${q.id}, Created: ${q.createdAt}`);
        });
      }
    }

    if (duplicateCount === 0) {
      console.log('✅ No duplicates found!');
    } else {
      console.log(`\n⚠️  Found ${duplicateCount} duplicate slugs`);
    }

    // Check "Sum of first N natural numbers"
    console.log('\n🔍 Checking "Sum of first N natural numbers" specifically:');
    const sumProblems = await prisma.question.findMany({
      where: {
        slug: {
          contains: 'sum-of-first'
        }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        testCases: true
      }
    });

    if (sumProblems.length === 0) {
      console.log('❌ "Sum of first N natural numbers" not found');
    } else {
      sumProblems.forEach((q) => {
        console.log(`\n✅ Found: ${q.slug}`);
        console.log(`   Title: ${q.title}`);
        console.log(`   Test cases: ${q.testCases?.length || 0}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
