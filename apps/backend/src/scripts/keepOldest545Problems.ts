/**
 * Keep Only Oldest 545 Problems
 * 
 * This script keeps the oldest 545 problems (by createdAt date)
 * and deletes all newer problems.
 * 
 * Usage:
 *   npx ts-node src/scripts/keepOldest545Problems.ts
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

const TARGET_COUNT = 545;

async function keepOldest545() {
  try {
    console.log('🔍 Analyzing database...\n');

    // Get total count
    const totalCount = await prisma.problem.count();
    console.log(`📊 Current total: ${totalCount} problems`);
    console.log(`🎯 Target: ${TARGET_COUNT} problems\n`);

    if (totalCount <= TARGET_COUNT) {
      console.log(`✅ You already have ${totalCount} problems, which is ${TARGET_COUNT - totalCount} less than the target.`);
      console.log('   No need to remove any problems!');
      return;
    }

    const toRemove = totalCount - TARGET_COUNT;
    console.log(`⚠️  Need to remove ${toRemove} newer problems\n`);

    // Get all problems sorted by creation date
    const allProblems = await prisma.problem.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true,
            testCases: true,
          },
        },
      },
    });

    // Split into keep and delete
    const problemsToKeep = allProblems.slice(0, TARGET_COUNT);
    const problemsToDelete = allProblems.slice(TARGET_COUNT);

    console.log('📋 PROBLEMS TO KEEP (Oldest 545):');
    console.log('═'.repeat(70));
    console.log(`First: ${problemsToKeep[0].title} (${problemsToKeep[0].createdAt.toISOString()})`);
    console.log(`Last:  ${problemsToKeep[problemsToKeep.length - 1].title} (${problemsToKeep[problemsToKeep.length - 1].createdAt.toISOString()})`);

    console.log('\n🗑️  PROBLEMS TO DELETE (Newer):');
    console.log('═'.repeat(70));
    problemsToDelete.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Created: ${p.createdAt.toISOString()}`);
      console.log(`   Submissions: ${p._count.submissions}, TestCases: ${p._count.testCases}`);
    });

    // Count total submissions that will be lost
    const totalSubmissionsLost = problemsToDelete.reduce(
      (sum, p) => sum + p._count.submissions,
      0
    );

    console.log('\n⚠️  WARNING:');
    console.log('═'.repeat(70));
    console.log(`This will delete ${toRemove} problems`);
    console.log(`${totalSubmissionsLost} submissions will also be deleted (cascade)`);
    
    // Ask for confirmation (simulated - in real use, you'd use readline)
    console.log('\n❓ Type "yes" to confirm deletion, or press Ctrl+C to cancel');
    console.log('   (Note: This is a dry run. Uncomment the deletion code to actually delete)\n');

    // Uncomment below to actually delete
    /*
    console.log('🗑️  Deleting problems...\n');
    
    let deleted = 0;
    for (const problem of problemsToDelete) {
      await prisma.problem.delete({
        where: { id: problem.id },
      });
      deleted++;
      
      if (deleted % 10 === 0) {
        console.log(`   Deleted ${deleted}/${toRemove} problems...`);
      }
    }

    console.log('\n✅ Deletion complete!');
    */

    console.log('🔒 DRY RUN MODE - No problems were actually deleted');
    console.log('   To actually delete, edit the script and uncomment the deletion code');

    // Verify final count
    const finalCount = await prisma.problem.count();
    console.log(`\n📊 Final count: ${finalCount} problems`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

keepOldest545();
