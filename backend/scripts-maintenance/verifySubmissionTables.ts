import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DATABASE_URL = process.env.DATABASE_URL!;

async function verifyTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('supabase') ? { rejectUnauthorized: false } : undefined
  });

  try {
    console.log('🔍 Verifying Separated Submission Tables\n');
    console.log('='.repeat(60));

    // 1. Check table structures
    console.log('\n📋 Table Structures:\n');

    const tables = ['QuestionSubmission', 'QuestionSubmissionResult', 'ProblemSubmission', 'ProblemSubmissionResult'];

    for (const tableName of tables) {
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${tableName}'
        ORDER BY ordinal_position;
      `;

      const result = await pool.query(columnsQuery);
      
      console.log(`\n${tableName}:`);
      console.log(`  Columns: ${result.rows.length}`);
      result.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
        console.log(`    • ${col.column_name}: ${col.data_type} ${nullable}`);
      });
    }

    // 2. Check foreign key constraints
    console.log('\n\n🔗 Foreign Key Constraints:\n');

    const fkQuery = `
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name IN ('QuestionSubmission', 'ProblemSubmission', 'QuestionSubmissionResult', 'ProblemSubmissionResult')
      ORDER BY tc.table_name, tc.constraint_name;
    `;

    const fkResult = await pool.query(fkQuery);
    fkResult.rows.forEach(fk => {
      console.log(`  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    // 3. Check current data counts
    console.log('\n\n📊 Current Data Counts:\n');

    for (const tableName of tables) {
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      console.log(`  ${tableName}: ${countResult.rows[0].count} records`);
    }

    // 4. Compare with legacy Submission table
    console.log('\n\n🔄 Legacy vs New System:\n');

    try {
      const legacyCount = await pool.query(`SELECT COUNT(*) as count FROM "Submission"`);
      const legacyProblemCount = await pool.query(`SELECT COUNT(*) as count FROM "Submission" WHERE "problemId" IS NOT NULL`);
      const legacyQuestionCount = await pool.query(`SELECT COUNT(*) as count FROM "Submission" WHERE "questionId" IS NOT NULL`);

      console.log(`  Legacy Submission table: ${legacyCount.rows[0].count} total records`);
      console.log(`    - Problem submissions: ${legacyProblemCount.rows[0].count}`);
      console.log(`    - Question submissions: ${legacyQuestionCount.rows[0].count}`);
    } catch (error) {
      console.log(`  Legacy Submission table: Not found or inaccessible`);
    }

    const newProblemCount = await pool.query(`SELECT COUNT(*) as count FROM "ProblemSubmission"`);
    const newQuestionCount = await pool.query(`SELECT COUNT(*) as count FROM "QuestionSubmission"`);
    
    console.log(`\n  New separated tables:`);
    console.log(`    - ProblemSubmission: ${newProblemCount.rows[0].count}`);
    console.log(`    - QuestionSubmission: ${newQuestionCount.rows[0].count}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification Complete - All tables are ready!\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

verifyTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
