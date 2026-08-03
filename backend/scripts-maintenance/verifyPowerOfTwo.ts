import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verifyPowerOfTwo() {
  try {
    // Find all Power of Two problems
    const allProblems = await prisma.question.findMany({
      where: {
        title: {
          contains: 'Power of Two'
        }
      }
    });

    console.log('Found problems with "Power of Two" in title:');
    allProblems.forEach(p => {
      console.log(`  - ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}, Difficulty: ${p.difficulty}`);
    });

    // Delete all old ones except power-of-two
    for (const problem of allProblems) {
      if (problem.slug !== 'power-of-two') {
        console.log(`\n🗑️  Deleting old problem: ${problem.slug} (${problem.difficulty})`);
        await prisma.question.delete({
          where: { id: problem.id }
        });
      }
    }

    // Verify the final problem
    const finalProblem = await prisma.question.findUnique({
      where: { slug: 'power-of-two' }
    });

    if (finalProblem) {
      console.log('\n✅ Final Power of Two problem:');
      console.log(`   Title: ${finalProblem.title}`);
      console.log(`   Slug: ${finalProblem.slug}`);
      console.log(`   Difficulty: ${finalProblem.difficulty}`);
      console.log(`   Topics: ${(finalProblem.topics as string[]).join(', ')}`);
      console.log(`   Templates: ${(finalProblem.templates as any[]).map((t: any) => t.language).join(', ')}`);
      console.log(`   Statement starts with: ${(finalProblem.statement as string).substring(0, 60)}...`);
      console.log(`   Test cases: ${(finalProblem.testCases as any[]).length}`);
      console.log(`   XP Reward: ${finalProblem.xpReward}`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyPowerOfTwo();
