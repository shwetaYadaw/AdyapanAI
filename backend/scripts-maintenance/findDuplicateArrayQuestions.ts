import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function findDuplicates() {
  try {
    const questions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'arrays'
        }
      },
      select: { id: true, title: true, statement: true },
      orderBy: { title: 'asc' }
    });

    console.log(`\n📊 Total array questions: ${questions.length}\n`);
    
    // Group by title to find duplicates
    const titleMap = new Map<string, any[]>();
    questions.forEach(q => {
      if (!titleMap.has(q.title)) {
        titleMap.set(q.title, []);
      }
      titleMap.get(q.title)!.push(q);
    });

    // Find duplicates and old placeholders
    console.log('🔍 Checking for duplicates and old placeholders:\n');
    
    let oldPlaceholderCount = 0;
    let duplicateCount = 0;

    for (const [title, questions] of titleMap) {
      if (questions.length > 1) {
        console.log(`\n⚠️  DUPLICATE: "${title}" (${questions.length} versions)`);
        duplicateCount += questions.length - 1;
        questions.forEach((q, idx) => {
          const hasPlaceholder = q.statement.includes('Practice solving');
          console.log(`   ${idx + 1}. ID: ${q.id.substring(0, 8)}... - ${hasPlaceholder ? '❌ PLACEHOLDER' : '✅ DETAILED'}`);
        });
      }

      // Check for placeholder statements
      if (questions.some(q => q.statement.includes('Practice solving'))) {
        console.log(`\n❌ OLD PLACEHOLDER: "${title}"`);
        oldPlaceholderCount++;
      }
    }

    console.log(`\n\n📈 Summary:`);
    console.log(`   Total array questions: ${questions.length}`);
    console.log(`   Old placeholders: ${oldPlaceholderCount}`);
    console.log(`   Duplicate extra copies: ${duplicateCount}`);
    console.log(`   Should be: 26 updated questions`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findDuplicates();
