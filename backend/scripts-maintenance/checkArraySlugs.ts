import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function checkArraySlugs() {
  try {
    const questions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'arrays'
        }
      },
      select: { title: true, slug: true }
    });

    console.log('Array Questions with Slugs:\n');
    questions.forEach((q, i) => {
      console.log(`${i + 1}. "${q.title}" → slug: "${q.slug}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArraySlugs();
