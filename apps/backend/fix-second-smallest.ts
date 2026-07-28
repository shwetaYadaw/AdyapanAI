import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { prisma } from './src/config/prisma';

async function fix() {
  try {
    console.log('🔧 Fixing Second Smallest and Second Largest problem...');
    
    // First delete the old entry
    const deleteResult = await prisma.question.deleteMany({
      where: {
        slug: 'second-smallest-and-second-largest-element-in-an-array-tcs-nqt'
      }
    });
    console.log(`✅ Deleted ${deleteResult.count} old entries`);
    
    // Check if new entry exists
    const existing = await prisma.question.findUnique({
      where: { slug: 'second-smallest-and-second-largest-tcs-nqt' }
    });
    
    if (existing) {
      console.log('✅ New problem already exists');
      console.log('📝 Title:', existing.title);
      console.log('📝 Sample Input:', existing.sampleInput);
      console.log('📝 Sample Output:', existing.sampleOutput);
      console.log('🧪 Test Cases Count:', (existing.testCases as any[]).length);
    } else {
      console.log('❌ New problem not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
