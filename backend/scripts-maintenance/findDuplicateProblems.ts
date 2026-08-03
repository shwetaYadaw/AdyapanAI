/**
 * Find and Remove Duplicate Problems
 * 
 * This script finds duplicate problems in the database (by slug or title)
 * and removes them, keeping only the oldest one.
 * 
 * Usage:
 *   npx ts-node src/scripts/findDuplicateProblems.ts
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

async function findDuplicates() {
  try {
    console.log('🔍 Scanning for duplicate problems...\n');

    // Find duplicate slugs
    const duplicateSlugs = await prisma.$queryRaw<Array<{ slug: string; count: bigint }>>`
      SELECT slug, COUNT(*) as count
      FROM "Problem"
      GROUP BY slug
      HAVING COUNT(*) > 1
    `;

    console.log(`📊 Found ${duplicateSlugs.length} duplicate slugs\n`);

    let totalRemoved = 0;

    for (const dup of duplicateSlugs) {
      const slug = dup.slug;
      const count = Number(dup.count);
      
      console.log(`\n📝 Slug: "${slug}" - Found ${count} duplicates`);

      // Get all problems with this slug, ordered by creation date (oldest first)
      const problems = await prisma.problem.findMany({
        where: { slug },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      });

      console.log(`   Found ${problems.length} problems with slug "${slug}":`);
      problems.forEach((p, idx) => {
        console.log(`   ${idx + 1}. ${p.title} (ID: ${p.id.substring(0, 8)}..., Created: ${p.createdAt.toISOString().split('T')[0]}, Submissions: ${p._count.submissions})`);
      });

      // Keep the first one (oldest), delete the rest
      const toKeep = problems[0];
      const toDelete = problems.slice(1);

      console.log(`   ✅ Keeping: ${toKeep.title} (ID: ${toKeep.id.substring(0, 8)}...)`);
      console.log(`   ❌ Deleting ${toDelete.length} duplicate(s):`);

      for (const problem of toDelete) {
        console.log(`      - ${problem.title} (ID: ${problem.id.substring(0, 8)}...)`);
        
        // Delete the duplicate problem (cascade will delete related test cases and submissions)
        await prisma.problem.delete({
          where: { id: problem.id },
        });
        
        totalRemoved++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ Cleanup Complete!`);
    console.log(`   🗑️  Removed: ${totalRemoved} duplicate problems`);
    console.log(`   ✅ Kept: ${duplicateSlugs.length} unique problems`);
    console.log('='.repeat(60));

    // Get final count
    const finalCount = await prisma.problem.count();
    console.log(`\n📊 Total problems in database: ${finalCount}`);

  } catch (error) {
    console.error('❌ Error finding duplicates:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
findDuplicates();
