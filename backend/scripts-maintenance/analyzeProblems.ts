/**
 * Analyze Problems in Database
 * 
 * This script analyzes all problems in the database and shows:
 * - Total count
 * - Count by creation date ranges
 * - Newest and oldest problems
 * - Problems with/without submissions
 * 
 * Usage:
 *   npx ts-node src/scripts/analyzeProblems.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function analyzeProblems() {
  try {
    console.log('🔍 Analyzing problems in database...\n');

    // Get total count
    const totalCount = await prisma.problem.count();
    console.log(`📊 Total problems: ${totalCount}\n`);

    // Get oldest and newest problems
    const oldestProblems = await prisma.problem.findMany({
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        _count: {
          select: { submissions: true },
        },
      },
    });

    const newestProblems = await prisma.problem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        _count: {
          select: { submissions: true },
        },
      },
    });

    console.log('📅 OLDEST 5 Problems (First Created):');
    console.log('═'.repeat(70));
    oldestProblems.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Created: ${p.createdAt.toISOString()}`);
      console.log(`   Submissions: ${p._count.submissions}`);
      console.log('');
    });

    console.log('\n📅 NEWEST 5 Problems (Recently Created):');
    console.log('═'.repeat(70));
    newestProblems.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Created: ${p.createdAt.toISOString()}`);
      console.log(`   Submissions: ${p._count.submissions}`);
      console.log('');
    });

    // Check for date ranges
    const allProblems = await prisma.problem.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        _count: {
          select: { submissions: true },
        },
      },
    });

    const firstDate = allProblems[0]?.createdAt;
    const lastDate = allProblems[allProblems.length - 1]?.createdAt;

    console.log('\n📆 Date Range:');
    console.log('═'.repeat(70));
    console.log(`First problem created: ${firstDate?.toISOString()}`);
    console.log(`Last problem created:  ${lastDate?.toISOString()}`);

    // Count problems with submissions
    const withSubmissions = allProblems.filter((p) => p._count.submissions > 0).length;
    const withoutSubmissions = allProblems.filter((p) => p._count.submissions === 0).length;

    console.log('\n📈 Submission Statistics:');
    console.log('═'.repeat(70));
    console.log(`Problems with submissions:    ${withSubmissions}`);
    console.log(`Problems without submissions: ${withoutSubmissions}`);

    // Group by month
    const byMonth: Record<string, number> = {};
    allProblems.forEach((p) => {
      const month = p.createdAt.toISOString().substring(0, 7); // YYYY-MM
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    console.log('\n📅 Problems Created by Month:');
    console.log('═'.repeat(70));
    Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, count]) => {
        console.log(`${month}: ${count} problems`);
      });

    console.log('\n💡 Analysis Complete!');
    console.log('═'.repeat(70));
    console.log(`Current total: ${totalCount} problems`);
    console.log(`Expected total: 545 problems`);
    console.log(`Difference: ${545 - totalCount} problems ${545 - totalCount > 0 ? 'missing' : 'extra'}`);

    if (totalCount < 545) {
      console.log('\n⚠️  You have FEWER problems than expected (421 vs 545)');
      console.log('   This means you need to ADD more problems, not remove them.');
      console.log('   Missing: ' + (545 - totalCount) + ' problems');
    } else if (totalCount > 545) {
      console.log('\n⚠️  You have MORE problems than expected');
      console.log('   Extra: ' + (totalCount - 545) + ' problems');
      console.log('\n   To keep only the oldest 545 problems, run:');
      console.log('   npx ts-node src/scripts/keepOldest545Problems.ts');
    } else {
      console.log('\n✅ You have exactly the right number of problems!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

analyzeProblems();
