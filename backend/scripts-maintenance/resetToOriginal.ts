import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function resetToOriginal() {
  try {
    console.log('🔄 Resetting to original state...\n');

    // Delete ALL questions
    console.log('🗑️  Deleting all questions from database...');
    const deleteResult = await prisma.question.deleteMany({});
    console.log(`   ✅ Deleted ${deleteResult.count} questions\n`);

    console.log('✅ Database cleared!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: cd apps/backend');
    console.log('   2. Run: npm run seed:challenges');
    console.log('   3. This will restore the original 545 questions (with 46 duplicates)\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetToOriginal();
