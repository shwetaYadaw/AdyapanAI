import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function debugProblems() {
  try {
    console.log('🔍 Checking all problems in database...\n');

    const allProblems = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        statement: true,
        templates: true
      }
    });

    console.log(`Total problems in database: ${allProblems.length}\n`);

    // List all problems
    console.log('ALL PROBLEMS IN DATABASE:');
    console.log('─'.repeat(80));
    allProblems.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Statement length: ${(p.statement as string).length} chars`);
      console.log(`   Templates: ${(p.templates as any[]).length}`);
      console.log('');
    });

    console.log('─'.repeat(80) + '\n');

    // Check our specific problems
    const targetSlugs = [
      'maximum-xor-of-two-numbers',
      'implement-trie',
      'replace-words',
      'map-sum-pairs',
      'longest-word-in-dictionary',
      'power-of-two',
      'reverse-bits',
      'count-total-set-bits'
    ];

    console.log('CHECKING TARGET PROBLEMS:\n');
    for (const slug of targetSlugs) {
      const problem = await prisma.question.findUnique({
        where: { slug: slug }
      });

      if (problem) {
        console.log(`✅ ${slug}`);
        console.log(`   Title: ${problem.title}`);
      } else {
        console.log(`❌ ${slug} - NOT FOUND`);
      }
    }

    console.log('\n' + '─'.repeat(80) + '\n');

    // Try to fetch one problem directly to test API
    const testProblem = await prisma.question.findUnique({
      where: { slug: 'power-of-two' }
    });

    if (testProblem) {
      console.log('✅ TEST API CALL:');
      console.log(`   Problem: ${testProblem.title}`);
      console.log(`   Found by slug: power-of-two`);
      console.log(`   Statement starts: ${(testProblem.statement as string).substring(0, 50)}...`);
      console.log(`   Templates count: ${(testProblem.templates as any[]).length}`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

debugProblems();
