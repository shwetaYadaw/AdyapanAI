import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verifyMapSumPairs() {
  try {
    // Find all Map Sum problems
    const allProblems = await prisma.question.findMany({
      where: {
        title: {
          contains: 'Map Sum'
        }
      }
    });

    console.log('Found problems with "Map Sum" in title:');
    allProblems.forEach(p => {
      console.log(`  - ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}, Difficulty: ${p.difficulty}`);
    });

    // Delete all old ones except map-sum-pairs
    for (const problem of allProblems) {
      if (problem.slug !== 'map-sum-pairs') {
        console.log(`\n🗑️  Deleting old problem: ${problem.slug} (${problem.difficulty})`);
        await prisma.question.delete({
          where: { id: problem.id }
        });
      }
    }

    // Verify the final problem
    const finalProblem = await prisma.question.findUnique({
      where: { slug: 'map-sum-pairs' }
    });

    if (finalProblem) {
      console.log('\n✅ Final Map Sum Pairs problem:');
      console.log(`   Title: ${finalProblem.title}`);
      console.log(`   Slug: ${finalProblem.slug}`);
      console.log(`   Difficulty: ${finalProblem.difficulty}`);
      console.log(`   Templates: ${(finalProblem.templates as any[]).map((t: any) => t.language).join(', ')}`);
      console.log(`   Statement starts with: ${(finalProblem.statement as string).substring(0, 60)}...`);
      console.log(`   Test cases: ${(finalProblem.testCases as any[]).length}`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyMapSumPairs();
