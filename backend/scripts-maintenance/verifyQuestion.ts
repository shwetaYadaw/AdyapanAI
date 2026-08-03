import { prisma } from '../config/prisma';

async function verify() {
  const q = await prisma.question.findUnique({
    where: { slug: 'find-smallest-second-smallest-in-array' }
  });
  
  if (!q) {
    console.log('❌ Question not found!');
    return;
  }
  
  console.log('✅ Question found in database:');
  console.log('   Title:', q.title);
  console.log('   Difficulty:', q.difficulty);
  console.log('   Topics:', q.topics);
  console.log('   Companies:', q.companies);
  console.log('   XP Reward:', q.xpReward);
  
  const allQuestions = await prisma.question.count();
  console.log('\n📊 Total Questions in Database:', allQuestions);
  
  await prisma.$disconnect();
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
