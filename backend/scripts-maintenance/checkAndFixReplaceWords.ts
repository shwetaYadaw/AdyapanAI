import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function checkAndFixReplaceWords() {
  try {
    // Find all Replace Words problems
    const allProblems = await prisma.question.findMany({
      where: {
        title: {
          contains: 'Replace Words'
        }
      }
    });

    console.log('Found problems with "Replace Words" in title:');
    allProblems.forEach(p => {
      console.log(`  - ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}, Difficulty: ${p.difficulty}`);
    });

    // Delete all old ones except the one we just created
    for (const problem of allProblems) {
      if (problem.slug !== 'replace-words' || problem.difficulty !== 'medium') {
        console.log(`\n🗑️  Deleting old problem: ${problem.slug} (${problem.difficulty})`);
        await prisma.question.delete({
          where: { id: problem.id }
        });
      }
    }

    // Now verify our new problem is there with correct content
    const newProblem = await prisma.question.findUnique({
      where: { slug: 'replace-words' }
    });

    if (newProblem) {
      console.log('\n✅ Current Replace Words problem:');
      console.log(`   Title: ${newProblem.title}`);
      console.log(`   Slug: ${newProblem.slug}`);
      console.log(`   Difficulty: ${newProblem.difficulty}`);
      console.log(`   Templates: ${(newProblem.templates as any[]).map((t: any) => t.language).join(', ')}`);
      console.log(`   Statement starts with: ${(newProblem.statement as string).substring(0, 50)}...`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkAndFixReplaceWords();
