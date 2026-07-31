/**
 * View Duplicate Problems (No Deletion)
 * 
 * This script shows duplicate problems in the database without deleting anything.
 * 
 * Usage:
 *   npx ts-node src/scripts/viewDuplicateProblems.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

async function viewDuplicates() {
  try {
    console.log('🔍 Scanning for duplicate problems...\n');

    // Get total count first
    const totalCount = await prisma.problem.count();
    console.log(`📊 Total problems in database: ${totalCount}\n`);

    // Find duplicate slugs
    const duplicateSlugs = await prisma.$queryRaw<Array<{ slug: string; count: bigint }>>`
      SELECT slug, COUNT(*) as count
      FROM "Problem"
      GROUP BY slug
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `;

    if (duplicateSlugs.length === 0) {
      console.log('✅ No duplicates found! All problems are unique.');
      return;
    }

    console.log(`⚠️  Found ${duplicateSlugs.length} duplicate slugs:\n`);

    let totalDuplicates = 0;

    for (const dup of duplicateSlugs) {
      const slug = dup.slug;
      const count = Number(dup.count);
      totalDuplicates += count - 1; // Count extras only
      
      console.log(`\n${'─'.repeat(70)}`);
      console.log(`📝 Slug: "${slug}"`);
      console.log(`   Duplicates: ${count} copies (${count - 1} extra)`);

      // Get all problems with this slug
      const problems = await prisma.problem.findMany({
        where: { slug },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          createdAt: true,
          _count: {
            select: {
              submissions: true,
              testCases: true,
            },
          },
        },
      });

      problems.forEach((p, idx) => {
        const marker = idx === 0 ? '✅ KEEP' : '❌ DELETE';
        console.log(`   ${marker} #${idx + 1}:`);
        console.log(`      Title: ${p.title}`);
        console.log(`      ID: ${p.id}`);
        console.log(`      Difficulty: ${p.difficulty}`);
        console.log(`      Created: ${p.createdAt.toISOString()}`);
        console.log(`      Submissions: ${p._count.submissions}, TestCases: ${p._count.testCases}`);
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`   Current total: ${totalCount} problems`);
    console.log(`   Unique problems: ${totalCount - totalDuplicates}`);
    console.log(`   Duplicate entries: ${totalDuplicates}`);
    console.log(`   After cleanup: ${totalCount - totalDuplicates} problems`);
    console.log('='.repeat(70));
    
    console.log('\n💡 To remove duplicates, run:');
    console.log('   npx ts-node src/scripts/findDuplicateProblems.ts');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
viewDuplicates();
