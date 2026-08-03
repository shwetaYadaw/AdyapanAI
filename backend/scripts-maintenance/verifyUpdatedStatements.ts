import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verifyStatements() {
  try {
    const questions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'arrays'
        }
      },
      select: { title: true, statement: true },
      orderBy: { title: 'asc' }
    });

    console.log(`\n📊 Verifying ${questions.length} array questions:\n`);

    let placeholderCount = 0;
    let detailedCount = 0;

    questions.forEach((q, i) => {
      const hasPlaceholder = q.statement.includes('Practice solving');
      const hasExamples = q.statement.includes('Example') || q.statement.includes('Input:');
      
      if (hasPlaceholder) {
        console.log(`  ${i + 1}. ❌ ${q.title} - HAS PLACEHOLDER`);
        placeholderCount++;
      } else if (hasExamples) {
        console.log(`  ${i + 1}. ✅ ${q.title} - HAS DETAILED STATEMENT`);
        detailedCount++;
      } else {
        console.log(`  ${i + 1}. ⚠️  ${q.title} - UNKNOWN (${q.statement.length} chars)`);
      }
    });

    console.log(`\n📈 Summary:`);
    console.log(`   Total: ${questions.length}`);
    console.log(`   Detailed statements: ${detailedCount}`);
    console.log(`   Placeholder statements: ${placeholderCount}`);
    
    if (placeholderCount === 0 && detailedCount === 26) {
      console.log(`\n✅ SUCCESS! All 26 questions have detailed statements!`);
    } else {
      console.log(`\n❌ PROBLEM! Not all questions are updated!`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyStatements();
