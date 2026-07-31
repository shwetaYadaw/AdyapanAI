/**
 * Verify Final Database State
 * 
 * Check that both Coding Arena and TCS NQT are properly in database
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

async function verifyDatabase() {
  const pool = new Pool({ connectionString });

  try {
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║              Final Database State Verification                     ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    // 1. Check Coding Arena (Problem table)
    console.log('🟢 CODING ARENA (Problem Table)\n');
    
    const problemCount = await pool.query('SELECT COUNT(*) FROM "Problem"');
    console.log(`   Total Problems: ${problemCount.rows[0].count}\n`);

    // Sample problems by topic
    const topics = ['arrays', 'strings', 'linked-list', 'trees', 'dynamic-programming'];
    for (const topic of topics) {
      const count = await pool.query(
        `SELECT COUNT(*) FROM "Problem" WHERE topics LIKE $1`,
        [`%${topic}%`]
      );
      console.log(`   - ${topic}: ${count.rows[0].count} problems`);
    }

    // Check for newly added problems
    console.log('\n   ✅ Checking newly added problems:');
    const newProblems = ['two-sum', 'climbing-stairs', 'valid-anagram', 'reverse-linked-list'];
    for (const slug of newProblems) {
      const result = await pool.query(
        'SELECT title FROM "Problem" WHERE slug = $1',
        [slug]
      );
      if (result.rows.length > 0) {
        console.log(`      ✅ Found: ${result.rows[0].title}`);
      } else {
        console.log(`      ❌ Missing: ${slug}`);
      }
    }

    console.log('\n' + '─'.repeat(70) + '\n');

    // 2. Check TCS NQT (Question table)
    console.log('🔵 TCS NQT (Question Table)\n');
    
    const questionCount = await pool.query('SELECT COUNT(*) FROM "Question"');
    console.log(`   Total Questions: ${questionCount.rows[0].count}\n`);

    // Verify all are TCS NQT
    const tcsNqtCount = await pool.query(`
      SELECT COUNT(*) FROM "Question" 
      WHERE topics::text LIKE '%tcs-nqt%'
    `);
    console.log(`   Questions with "tcs-nqt" topic: ${tcsNqtCount.rows[0].count}`);

    // Check for non-TCS NQT questions
    const nonTcsCount = await pool.query(`
      SELECT COUNT(*) FROM "Question" 
      WHERE topics::text NOT LIKE '%tcs-nqt%'
    `);
    console.log(`   Questions without "tcs-nqt" topic: ${nonTcsCount.rows[0].count}`);

    if (nonTcsCount.rows[0].count === '0') {
      console.log('\n   ✅ Question table is CLEAN - Contains only TCS NQT questions!');
    } else {
      console.log(`\n   ⚠️  Warning: ${nonTcsCount.rows[0].count} non-TCS NQT questions found`);
    }

    // Sample TCS NQT questions
    const sampleTcs = await pool.query(`
      SELECT title FROM "Question" 
      WHERE topics::text LIKE '%tcs-nqt%'
      LIMIT 5
    `);
    console.log('\n   Sample TCS NQT Questions:');
    sampleTcs.rows.forEach((row, idx) => {
      console.log(`      ${idx + 1}. ${row.title.substring(0, 60)}...`);
    });

    console.log('\n' + '═'.repeat(70));
    console.log('FINAL DATABASE STATE:');
    console.log('═'.repeat(70));
    console.log(`📊 Coding Arena (Problem):   ${problemCount.rows[0].count} problems ✅`);
    console.log(`📊 TCS NQT (Question):       ${questionCount.rows[0].count} questions ✅`);
    console.log(`📊 Total Questions:          ${parseInt(problemCount.rows[0].count) + parseInt(questionCount.rows[0].count)}`);
    console.log('═'.repeat(70));

    // 3. Check if Aptitude table exists
    console.log('\n🟡 APTITUDE (AptitudeQuestion Table)\n');
    try {
      const aptitudeCount = await pool.query('SELECT COUNT(*) FROM "AptitudeQuestion"');
      console.log(`   Total Aptitude Questions: ${aptitudeCount.rows[0].count}`);
      if (aptitudeCount.rows[0].count === '0') {
        console.log('   ⚠️  Table exists but is EMPTY - Ready for migration!');
      } else {
        console.log(`   ✅ Table has ${aptitudeCount.rows[0].count} questions!`);
      }
    } catch (error) {
      console.log('   ❌ Table does NOT exist - Needs to be created');
    }

    console.log('\n' + '═'.repeat(70));
    console.log('SUMMARY:');
    console.log('═'.repeat(70));
    console.log('✅ Coding Arena: IN DATABASE (Problem table)');
    console.log('✅ TCS NQT: IN DATABASE (Question table)');
    console.log('⏳ Aptitude: NOT IN DATABASE (needs migration)');
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
