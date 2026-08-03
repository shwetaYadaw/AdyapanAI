import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function checkQuestionDetails() {
  try {
    // Get "Best Time to Buy and Sell Stock" question
    const question = await prisma.question.findFirst({
      where: {
        title: 'Best Time to Buy and Sell Stock'
      }
    });

    if (!question) {
      console.log('❌ Question not found');
      return;
    }

    console.log('✅ Question Found:');
    console.log(`\nTitle: ${question.title}`);
    console.log(`Difficulty: ${question.difficulty}`);
    console.log(`\nStatement (first 300 chars):\n${question.statement.substring(0, 300)}...`);
    console.log(`\nFull statement length: ${question.statement.length} characters`);
    
    // Check if it's the detailed statement or placeholder
    if (question.statement.includes('Practice solving')) {
      console.log('\n❌ STILL HAS PLACEHOLDER STATEMENT');
    } else if (question.statement.includes('Example 1:') || question.statement.includes('Input:')) {
      console.log('\n✅ HAS DETAILED STATEMENT WITH EXAMPLES');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestionDetails();
