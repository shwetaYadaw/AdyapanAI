/**
 * Find and Remove Duplicate TCS NQT Questions
 * 
 * This script identifies duplicate questions in the Question table
 * based on title or slug, and removes duplicates keeping the oldest entry.
 * 
 * Usage:
 *   npx ts-node src/scripts/findDuplicateTcsNqtQuestions.ts
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

async function findAndRemoveDuplicates() {
  try {
    console.log('🔍 Searching for duplicate TCS NQT questions...\n');

    // Get all questions
    const allQuestions = await prisma.question.findMany({
      orderBy: { createdAt: 'asc' }, // Keep oldest
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        topics: true,
      }
    });

    console.log(`📊 Total questions in database: ${allQuestions.length}\n`);

    // Find duplicates by slug
    const slugMap = new Map<string, typeof allQuestions>();
    const duplicateSlugs = new Map<string, typeof allQuestions>();

    allQuestions.forEach(q => {
      if (slugMap.has(q.slug)) {
        if (!duplicateSlugs.has(q.slug)) {
          duplicateSlugs.set(q.slug, [slugMap.get(q.slug)![0]]);
        }
        duplicateSlugs.get(q.slug)!.push(q);
      } else {
        slugMap.set(q.slug, [q]);
      }
    });

    // Find duplicates by title (normalized)
    const titleMap = new Map<string, typeof allQuestions>();
    const duplicateTitles = new Map<string, typeof allQuestions>();

    allQuestions.forEach(q => {
      const normalizedTitle = q.title.toLowerCase().trim().replace(/\s+/g, ' ');
      if (titleMap.has(normalizedTitle)) {
        if (!duplicateTitles.has(normalizedTitle)) {
          duplicateTitles.set(normalizedTitle, [titleMap.get(normalizedTitle)![0]]);
        }
        duplicateTitles.get(normalizedTitle)!.push(q);
      } else {
        titleMap.set(normalizedTitle, [q]);
      }
    });

    console.log('📋 DUPLICATE ANALYSIS:\n');
    console.log(`   Duplicate slugs found: ${duplicateSlugs.size}`);
    console.log(`   Duplicate titles found: ${duplicateTitles.size}\n`);

    if (duplicateSlugs.size === 0 && duplicateTitles.size === 0) {
      console.log('✅ No duplicates found! Database is clean.\n');
      return;
    }

    // Show duplicate details
    if (duplicateSlugs.size > 0) {
      console.log('🔴 DUPLICATE SLUGS:\n');
      let slugDupCount = 0;
      for (const [slug, questions] of duplicateSlugs.entries()) {
        slugDupCount++;
        console.log(`   ${slugDupCount}. Slug: "${slug}" (${questions.length} duplicates)`);
        questions.forEach((q, idx) => {
          const topics = Array.isArray(q.topics) ? q.topics : JSON.parse(q.topics as any);
          const keepMarker = idx === 0 ? '✅ KEEP' : '❌ DELETE';
          console.log(`      ${keepMarker} - ${q.title.substring(0, 60)}... (${q.createdAt.toISOString().split('T')[0]})`);
        });
        console.log();
      }
    }

    if (duplicateTitles.size > 0) {
      console.log('🔴 DUPLICATE TITLES:\n');
      let titleDupCount = 0;
      for (const [title, questions] of duplicateTitles.entries()) {
        // Skip if already shown in slug duplicates
        if (questions.length > 1 && questions.every(q1 => questions.every(q2 => q1.slug === q2.slug || q1.id === q2.id))) {
          continue;
        }
        titleDupCount++;
        console.log(`   ${titleDupCount}. Title: "${title.substring(0, 60)}..." (${questions.length} duplicates)`);
        questions.forEach((q, idx) => {
          const keepMarker = idx === 0 ? '✅ KEEP' : '❌ DELETE';
          console.log(`      ${keepMarker} - Slug: ${q.slug} (${q.createdAt.toISOString().split('T')[0]})`);
        });
        console.log();
      }
    }

    // Count total IDs to delete
    const idsToDeleteBySlug = new Set<string>();
    for (const questions of duplicateSlugs.values()) {
      questions.slice(1).forEach(q => idsToDeleteBySlug.add(q.id));
    }

    const idsToDeleteByTitle = new Set<string>();
    for (const questions of duplicateTitles.values()) {
      // Only add if not already in slug duplicates
      const slugDups = questions.every(q1 => questions.every(q2 => q1.slug === q2.slug || q1.id === q2.id));
      if (!slugDups) {
        questions.slice(1).forEach(q => idsToDeleteByTitle.add(q.id));
      }
    }

    // Combine all IDs to delete (avoid double-counting)
    const allIdsToDelete = new Set([...idsToDeleteBySlug, ...idsToDeleteByTitle]);

    console.log('=' .repeat(70));
    console.log('📊 SUMMARY:\n');
    console.log(`   Total questions in DB:           ${allQuestions.length}`);
    console.log(`   Duplicate entries found:         ${allIdsToDelete.size}`);
    console.log(`   Questions after cleanup:         ${allQuestions.length - allIdsToDelete.size}`);
    console.log('=' .repeat(70));

    if (allIdsToDelete.size === 0) {
      console.log('\n✅ No duplicates to remove!\n');
      return;
    }

    // Prompt for confirmation
    console.log('\n⚠️  DELETION PLAN:');
    console.log(`   ${allIdsToDelete.size} duplicate question(s) will be DELETED.`);
    console.log('   The OLDEST entry for each duplicate will be KEPT.\n');

    // Delete duplicates
    console.log('🗑️  Deleting duplicate questions...\n');
    
    const deleteResult = await prisma.question.deleteMany({
      where: {
        id: {
          in: Array.from(allIdsToDelete)
        }
      }
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} duplicate questions!\n`);

    // Verify final count
    const finalCount = await prisma.question.count();
    console.log('📊 FINAL RESULTS:');
    console.log(`   Questions before cleanup:  ${allQuestions.length}`);
    console.log(`   Duplicates removed:        ${deleteResult.count}`);
    console.log(`   Questions after cleanup:   ${finalCount}`);
    console.log(`   Expected:                  ${allQuestions.length - allIdsToDelete.size}`);
    
    if (finalCount === allQuestions.length - allIdsToDelete.size) {
      console.log('\n✅ Cleanup completed successfully!\n');
    } else {
      console.log('\n⚠️  Warning: Final count doesn\'t match expected.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// Run the script
console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║          TCS NQT Duplicate Question Removal Script                ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

findAndRemoveDuplicates()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
