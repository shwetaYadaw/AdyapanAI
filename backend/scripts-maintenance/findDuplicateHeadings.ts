import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function findDuplicateHeadings() {
  try {
    console.log('🔍 Finding problems with duplicate "Problem Statement" headings...\n');

    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        statement: true
      },
      take: 1000 // Get first 1000
    });

    let duplicateCount = 0;
    const problemsWithDuplicates: any[] = [];

    for (const question of allQuestions) {
      // Check if statement STARTS with ## Problem Statement or similar
      if (question.statement && question.statement.trim().startsWith('##')) {
        duplicateCount++;
        problemsWithDuplicates.push({
          slug: question.slug,
          title: question.title,
          startsWithHeading: true,
          preview: question.statement.substring(0, 100)
        });
      }
    }

    if (duplicateCount === 0) {
      console.log('✅ No problems with duplicate headings found!');
    } else {
      console.log(`❌ Found ${duplicateCount} problems with potential duplicate headings:\n`);
      problemsWithDuplicates.forEach((p) => {
        console.log(`- ${p.slug}`);
        console.log(`  Title: ${p.title}`);
        console.log(`  Starts with ##: ${p.startsWithHeading}`);
        console.log(`  Preview: ${p.preview}...\n`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findDuplicateHeadings();
