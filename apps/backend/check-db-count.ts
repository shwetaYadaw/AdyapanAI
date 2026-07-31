import { prisma } from './src/config/prisma';

async function checkQuestions() {
  try {
    const total = await prisma.question.count();
    const codingArena = await prisma.question.count({ 
      where: { topics: { array_contains: 'coding-arena' } } 
    });
    const tcsNqt = await prisma.question.count({ 
      where: { topics: { array_contains: 'tcs-nqt' } } 
    });
    
    console.log('\n📊 DATABASE QUESTION COUNT:');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Total questions in DB: ${total}`);
    console.log(`✅ Coding Arena questions: ${codingArena}`);
    console.log(`✅ TCS NQT questions: ${tcsNqt}`);
    console.log('═══════════════════════════════════════\n');
    
    if (total > 0) {
      console.log('✅ YES - All questions are uploaded to the database!');
    } else {
      console.log('❌ NO - No questions found in database');
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkQuestions();
