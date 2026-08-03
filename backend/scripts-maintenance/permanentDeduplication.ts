import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

/**
 * PERMANENT DEDUPLICATION SCRIPT
 * Removes ALL duplicate questions and keeps only the ones defined in JSON files
 * This is a one-time fix for the arrays topic
 */

async function permanentlyDeduplicateArrays() {
  try {
    console.log('🔍 Starting permanent deduplication for arrays...\n');

    // List of VALID question titles that should exist (from JSON)
    const validTitles = [
      'Best Time to Buy and Sell Stock',
      'Chocolate Distribution Problem',
      'Container With Most Water',
      'Contains Duplicate',
      'Find Minimum in Rotated Sorted Array',
      'Find Minimum Number of Merge Operations to Make an Array Palindrome',
      'Find Pair with Sum in Sorted & Rotated Array',
      'Given an Array of Numbers Arrange the Numbers to Form the Biggest Number',
      'Kth Smallest',
      'Kth-Largest Element in an Array',
      'Maximum Product Subarray',
      'Maximum Subarray (Kadane\'s Algorithm)',
      'Merge Intervals',
      'Missing And Repeating',
      'Next Permutation',
      'Overlapping Intervals',
      'Print all Possible Combinations of r Elements in a Given Array of Size n',
      'Product of Array Except Self',
      'Reverse the Array',
      'Rotate Array',
      'Search in Rotated Sorted Array',
      'Space Optimization Using Bit Manipulations',
      'Subarray Sums Divisible by K',
      'Trapping Rain Water',
      'Two Sum - Pair with given Sum',
      '3Sum'
    ];

    // Get all questions with 'arrays' topic
    const allArrayQuestions = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: ['arrays']
        }
      },
      select: {
        id: true,
        title: true,
        slug: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`📊 Found ${allArrayQuestions.length} total array questions\n`);

    // Find and delete duplicates
    const toDelete: { id: string; title: string }[] = [];
    const toKeep: { id: string; title: string }[] = [];

    for (const question of allArrayQuestions) {
      if (validTitles.includes(question.title)) {
        toKeep.push({ id: question.id, title: question.title });
      } else {
        toDelete.push({ id: question.id, title: question.title });
      }
    }

    console.log(`✅ Questions to keep: ${toKeep.length}`);
    console.log(`🗑️  Duplicates to delete: ${toDelete.length}\n`);

    // Delete duplicates
    for (const duplicate of toDelete) {
      try {
        await prisma.question.delete({
          where: { id: duplicate.id }
        });
        console.log(`   🗑️  Deleted: "${duplicate.title}"`);
      } catch (err) {
        console.error(`   ❌ Failed to delete: "${duplicate.title}"`);
      }
    }

    // Verify final count
    const finalCount = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: ['arrays']
        }
      }
    });

    console.log(`\n✨ Deduplication complete!`);
    console.log(`   📊 Final array questions count: ${finalCount.length} (should be 26)`);

    if (finalCount.length === 26) {
      console.log(`   ✅ SUCCESS! All duplicates removed.`);
    } else {
      console.log(`   ⚠️  WARNING: Expected 26 questions, found ${finalCount.length}`);
    }
  } catch (error) {
    console.error('❌ Deduplication failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

permanentlyDeduplicateArrays();
