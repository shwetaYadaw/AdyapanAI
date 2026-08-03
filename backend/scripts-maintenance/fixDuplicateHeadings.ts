import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function fixDuplicateHeadings() {
  try {
    console.log('🔧 Fixing duplicate "Problem Statement" headings...\n');

    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        statement: true
      },
      take: 1000
    });

    let fixedCount = 0;

    for (const question of allQuestions) {
      if (!question.statement) continue;

      // Check if statement starts with ## 📝 Problem Statement or ## Problem Statement
      const startsWithHeading = 
        question.statement.trim().startsWith('## 📝 Problem Statement') ||
        question.statement.trim().startsWith('## Problem Statement');

      if (startsWithHeading) {
        // Remove the leading heading line
        let newStatement = question.statement
          .replace(/^##\s*📝?\s*Problem\s+Statement\s*\n\n?/i, '')
          .trim();

        // Update the database
        await prisma.question.update({
          where: { id: question.id },
          data: { statement: newStatement }
        });

        fixedCount++;
        console.log(`✅ Fixed: ${question.slug}`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} problems with duplicate headings!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateHeadings();
