/**
 * Check if the 26 "missing" problems exist with different slugs
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

// Common titles for the 26 problems
const PROBLEM_TITLES = [
  'Replace O',
  'Activity Selection',
  'Single Number',
  'Two Sum',
  'Valid Parentheses',
  'Generate Parentheses',
  'Reverse Level Order',
  'Smallest Number',
  'Jump Game',
  'Kth Smallest',
  'Kth Largest',
  'Two Stacks',
  'Maximum Depth',
  'Rat in a Maze',
  'Dijkstra',
  'Maximum Subarray',
  'Kadane',
  'Maximum and Minimum',
  'Delete without Head',
  'Valid Anagram',
  'Reverse Linked List',
  'BFS',
  'Prim',
  'Climbing Stairs',
  'Knapsack',
  'Count Set Bits',
];

async function checkMissing() {
  const pool = new Pool({ connectionString });

  try {
    console.log('🔍 Checking if the 26 problems exist with different names...\n');

    let foundCount = 0;
    const missing: string[] = [];

    for (const searchTerm of PROBLEM_TITLES) {
      const result = await pool.query(`
        SELECT title, slug FROM "Problem" 
        WHERE LOWER(title) LIKE LOWER($1)
        LIMIT 1
      `, [`%${searchTerm}%`]);

      if (result.rows.length > 0) {
        foundCount++;
        console.log(`✅ Found: "${result.rows[0].title}"`);
      } else {
        missing.push(searchTerm);
        console.log(`❌ Missing: "${searchTerm}"`);
      }
    }

    console.log('\n' + '═'.repeat(70));
    console.log(`📊 Results: ${foundCount}/${PROBLEM_TITLES.length} found`);
    console.log('═'.repeat(70));

    if (missing.length > 0) {
      console.log(`\n⚠️  ${missing.length} problems are truly missing:\n`);
      missing.forEach((title, idx) => {
        console.log(`   ${idx + 1}. ${title}`);
      });
      console.log('\n💡 Solution: These need to be created fresh with proper problem statements.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkMissing();
