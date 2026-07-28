import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { prisma } from './src/config/prisma';

async function check() {
  try {
    console.log('🔍 Checking for all duplicate-related problems...');
    
    const problems = await prisma.question.findMany({
      where: {
        slug: {
          contains: 'duplicates'
        }
      },
      select: {
        slug: true,
        title: true,
        difficulty: true
      }
    });
    
    console.log(`\n📋 Found ${problems.length} problems with "duplicates":`);
    problems.forEach(p => {
      console.log(`  • ${p.title} (${p.slug})`);
    });
    
    // Check specifically for the old and new slugs
    console.log('\n🔎 Checking specific slugs:');
    
    const oldSlug = await prisma.question.findUnique({
      where: { slug: 'remove-duplicates-from-unsorted-array-tcs-nqt' }
    });
    
    const newSlug = await prisma.question.findUnique({
      where: { slug: 'remove-duplicates-from-sorted-array-tcs-nqt' }
    });
    
    console.log(`  Old slug (unsorted): ${oldSlug ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    console.log(`  New slug (sorted): ${newSlug ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
