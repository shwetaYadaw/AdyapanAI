/**
 * Find Sliding Window Maximum problem
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

async function findProblem() {
  const pool = new Pool({ connectionString });

  try {
    console.log('🔍 Searching for Sliding Window Maximum problem...\n');

    // Search by title
    const result = await pool.query(`
      SELECT id, title, slug, topics 
      FROM "Problem" 
      WHERE LOWER(title) LIKE '%sliding%window%maximum%'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Found matching problem(s):\n');
      result.rows.forEach((row, idx) => {
        console.log(`${idx + 1}. Title: ${row.title}`);
        console.log(`   Slug: ${row.slug}`);
        console.log(`   Topics: ${row.topics}`);
        console.log(`   Correct URL: http://localhost:3000/student/challenges/${row.slug}\n`);
      });
    } else {
      console.log('❌ No problem found with "Sliding Window Maximum"');
    }

    // Also check in Question table
    const questionResult = await pool.query(`
      SELECT id, title, slug, topics 
      FROM "Question" 
      WHERE LOWER(title) LIKE '%sliding%window%maximum%'
    `);

    if (questionResult.rows.length > 0) {
      console.log('⚠️  Found in Question table (shouldn\'t be there):\n');
      questionResult.rows.forEach((row, idx) => {
        console.log(`${idx + 1}. Title: ${row.title}`);
        console.log(`   Slug: ${row.slug}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

findProblem();
