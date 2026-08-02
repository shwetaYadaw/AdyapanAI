import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Read DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function runMigration() {
  const pool = new Pool({
    connectionString: DATABASE_URL!,
    ssl: DATABASE_URL!.includes('supabase') ? { rejectUnauthorized: false } : undefined
  });

  try {
    console.log('🚀 Starting separated submission tables migration...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../migrations/create_separated_submission_tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('📄 Executing SQL migration file...');
    
    // Execute the SQL
    await pool.query(sqlContent);

    console.log('\n✅ Migration completed successfully!\n');

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');

    const verifyQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('QuestionSubmission', 'QuestionSubmissionResult', 'ProblemSubmission', 'ProblemSubmissionResult')
      ORDER BY table_name;
    `;

    const result = await pool.query(verifyQuery);

    if (result.rows.length === 4) {
      console.log('✅ All 4 tables created successfully:');
      result.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
    } else {
      console.log('⚠️  Warning: Expected 4 tables but found', result.rows.length);
      result.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }

    // Check indexes
    console.log('\n🔍 Checking indexes...\n');
    
    const indexQuery = `
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('QuestionSubmission', 'ProblemSubmission')
      ORDER BY tablename, indexname;
    `;

    const indexResult = await pool.query(indexQuery);
    console.log(`✅ Created ${indexResult.rows.length} indexes:`);
    indexResult.rows.forEach(row => {
      console.log(`   ✓ ${row.tablename}.${row.indexname}`);
    });

    console.log('\n📊 Summary:');
    console.log('   Tables: 4 (QuestionSubmission, QuestionSubmissionResult, ProblemSubmission, ProblemSubmissionResult)');
    console.log(`   Indexes: ${indexResult.rows.length}`);
    console.log('   Status: Ready for use ✅\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('✅ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
