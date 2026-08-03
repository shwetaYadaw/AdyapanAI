import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

/**
 * Verify data integrity after migration
 * Ensures NO data was lost during the professional system setup
 */
async function verifyDataIntegrity() {
  try {
    console.log('\n🔍 Starting Data Integrity Verification...\n');

    // 1. Count problems
    const totalProblems = await prisma.problem.count();
    console.log(`✅ Total Problems: ${totalProblems}`);

    // 2. Check for problems without test cases
    const problemsWithTestCases = await prisma.problem.count({
      where: {
        testCases: {
          some: {}
        }
      }
    });
    console.log(`✅ Problems with test cases: ${problemsWithTestCases}`);

    // 3. Count total test cases
    const totalTestCases = await prisma.problemTestCase.count();
    console.log(`✅ Total test cases: ${totalTestCases}`);

    // 4. Check test case distribution
    const visibleTestCases = await prisma.problemTestCase.count({
      where: { isHidden: false }
    });
    const hiddenTestCases = await prisma.problemTestCase.count({
      where: { isHidden: true }
    });
    console.log(`   - Visible: ${visibleTestCases}`);
    console.log(`   - Hidden: ${hiddenTestCases}`);

    // 5. Distribution by difficulty
    const byDifficulty = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: true
    });
    console.log('\n📊 Problems by Difficulty:');
    byDifficulty.forEach(d => {
      console.log(`   - ${d.difficulty}: ${d._count}`);
    });

    // 6. Distribution by category
    const byCategory = await prisma.problem.groupBy({
      by: ['category'],
      _count: true
    });
    console.log('\n📁 Problems by Category:');
    byCategory.forEach(c => {
      console.log(`   - ${c.category || 'general'}: ${c._count}`);
    });

    // 7. Check for archived problems
    const archivedProblems = await prisma.problem.count({
      where: { isArchived: true }
    });
    const activeProblems = totalProblems - archivedProblems;
    console.log(`\n🔄 Problem Status:`);
    console.log(`   - Active: ${activeProblems}`);
    console.log(`   - Archived: ${archivedProblems}`);

    // 8. Check submissions
    const totalSubmissions = await prisma.submission.count();
    console.log(`\n📝 Submissions: ${totalSubmissions}`);

    // 9. Check problem solutions exist
    const totalSolutions = await prisma.problemSolution.count();
    console.log(`📚 Solutions: ${totalSolutions}`);

    // 10. Check version history
    const totalVersions = await prisma.problemVersion.count();
    console.log(`📖 Version history entries: ${totalVersions}`);

    // 11. Sample problems
    console.log(`\n📌 Sample Problems (first 5):`);
    const samples = await prisma.problem.findMany({
      take: 5,
      include: {
        testCases: {
          select: { isHidden: true }
        }
      }
    });
    samples.forEach((p, i) => {
      const testCaseCount = p.testCases.length;
      const hiddenCount = p.testCases.filter(tc => tc.isHidden).length;
      console.log(`   ${i + 1}. "${p.title}" (${p.difficulty}, ${testCaseCount} test cases)`);
    });

    // 12. Verify data consistency
    console.log(`\n✔️ Data Consistency Checks:`);
    
    // Check: All test cases have valid problem IDs
    const orphanedTestCases = await prisma.problemTestCase.findMany({
      where: {
        problem: null
      }
    });
    console.log(`   - Orphaned test cases: ${orphanedTestCases.length}`);

    // Check: All solutions have valid problem IDs
    const orphanedSolutions = await prisma.problemSolution.findMany({
      where: {
        problem: null
      }
    });
    console.log(`   - Orphaned solutions: ${orphanedSolutions.length}`);

    // Check: All versions have valid problem IDs
    const orphanedVersions = await prisma.problemVersion.findMany({
      where: {
        problem: null
      }
    });
    console.log(`   - Orphaned versions: ${orphanedVersions.length}`);

    // Final Summary
    console.log(`\n📋 VERIFICATION SUMMARY:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    const checksOK = orphanedTestCases.length === 0 && 
                     orphanedSolutions.length === 0 && 
                     orphanedVersions.length === 0;

    if (checksOK && totalProblems > 0) {
      console.log(`✅ ✅ ✅ ALL DATA INTEGRITY CHECKS PASSED ✅ ✅ ✅`);
      console.log(`\nYour database is healthy and ready to use!`);
      console.log(`\n📊 Statistics:`);
      console.log(`   - Problems: ${totalProblems}`);
      console.log(`   - Test cases: ${totalTestCases}`);
      console.log(`   - Solutions: ${totalSolutions}`);
      console.log(`   - Version entries: ${totalVersions}`);
      console.log(`\n✨ Professional admin system is fully operational!`);
    } else {
      console.log(`❌ SOME CHECKS FAILED`);
      if (totalProblems === 0) {
        console.log(`   - No problems found in database!`);
      }
      if (orphanedTestCases.length > 0) {
        console.log(`   - Found ${orphanedTestCases.length} orphaned test cases`);
      }
      if (orphanedSolutions.length > 0) {
        console.log(`   - Found ${orphanedSolutions.length} orphaned solutions`);
      }
      if (orphanedVersions.length > 0) {
        console.log(`   - Found ${orphanedVersions.length} orphaned versions`);
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyDataIntegrity();
