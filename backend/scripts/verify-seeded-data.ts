import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

async function verify() {
  try {
    console.log('🔍 Verifying seeded data...\n');

    // List coding-arena topics
    console.log('🎯 Coding Arena Topics:');
    const codingTopics = await prisma.topic.findMany({
      where: { system: 'coding-arena' },
      orderBy: { order: 'asc' },
      take: 20
    });

    codingTopics.forEach((t, idx) => {
      console.log(`   ${idx + 1}. ${t.name} (ID: ${t.id})`);
    });

    console.log(`\n   Total Coding Topics: ${codingTopics.length}`);

    // Count problems by topic name
    const sampleTopicName = codingTopics[0]?.name;
    if (sampleTopicName) {
      const problemsForTopic = await prisma.problem.count({
        where: { topics: { contains: sampleTopicName } }
      });
      console.log(`\n   Problems for "${sampleTopicName}": ${problemsForTopic}`);
    }

    console.log('\n✅ Verification complete!');
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
