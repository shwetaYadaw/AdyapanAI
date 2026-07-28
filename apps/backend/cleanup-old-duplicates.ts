import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { prisma } from './src/config/prisma';

async function cleanup() {
  try {
    console.log('🔧 Cleaning up old problems...');
    
    // Delete the old "Remove duplicates from unsorted array" entry
    const deleteResult = await prisma.question.deleteMany({
      where: {
        slug: 'remove-duplicates-from-unsorted-array-tcs-nqt'
      }
    });
    console.log(`✅ Deleted ${deleteResult.count} old "unsorted" entries`);
    
    // Verify the new problem exists
    const newProblem = await prisma.question.findUnique({
      where: { slug: 'remove-duplicates-from-sorted-array-tcs-nqt' }
    });
    
    if (newProblem) {
      console.log('\n✅ New problem exists:');
      console.log('📝 Title:', newProblem.title);
      console.log('📝 Slug:', newProblem.slug);
      console.log('🧪 Test Cases:', (newProblem.testCases as any[]).length);
    } else {
      console.log('❌ New problem not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
