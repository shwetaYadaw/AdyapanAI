/**
 * Verify if questions are already in database
 * This script checks all question tables and reports counts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TableCount {
  table: string;
  count: number;
  status: 'empty' | 'has_data';
}

async function verifyDatabaseQuestions() {
  console.log('🔍 Verifying Database Questions...\n');
  console.log('=' .repeat(60));
  
  const results: TableCount[] = [];
  
  try {
    // 1. Check Coding Arena Problems
    console.log('\n1️⃣  Checking Coding Arena Problems...');
    const codingArenaCount = await prisma.codingArenaProblem.count();
    results.push({
      table: 'CodingArenaProblem',
      count: codingArenaCount,
      status: codingArenaCount > 0 ? 'has_data' : 'empty'
    });
    console.log(`   ✓ Found ${codingArenaCount} problems`);
    
    // 2. Check TCS NQT Questions
    console.log('\n2️⃣  Checking TCS NQT Questions...');
    const tcsNqtCount = await prisma.tcsNqtQuestion.count();
    results.push({
      table: 'TcsNqtQuestion',
      count: tcsNqtCount,
      status: tcsNqtCount > 0 ? 'has_data' : 'empty'
    });
    console.log(`   ✓ Found ${tcsNqtCount} questions`);
    
    // 3. Check Aptitude Questions
    console.log('\n3️⃣  Checking Aptitude Questions...');
    const aptitudeCount = await prisma.aptitudeAdminQuestion.count();
    results.push({
      table: 'AptitudeAdminQuestion',
      count: aptitudeCount,
      status: aptitudeCount > 0 ? 'has_data' : 'empty'
    });
    console.log(`   ✓ Found ${aptitudeCount} questions`);
    
    // 4. Check Problem table (enhanced)
    console.log('\n4️⃣  Checking Problem Table (Enhanced)...');
    const problemCount = await prisma.problem.count();
    results.push({
      table: 'Problem',
      count: problemCount,
      status: problemCount > 0 ? 'has_data' : 'empty'
    });
    console.log(`   ✓ Found ${problemCount} problems`);
    
    // 5. Check Legacy Question table
    console.log('\n5️⃣  Checking Legacy Question Table...');
    try {
      const legacyCount = await prisma.question.count();
      results.push({
        table: 'Question (Legacy)',
        count: legacyCount,
        status: legacyCount > 0 ? 'has_data' : 'empty'
      });
      console.log(`   ✓ Found ${legacyCount} questions`);
    } catch (error) {
      console.log(`   ⚠️  Legacy Question table doesn't exist (OK)`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    
    const totalQuestions = results.reduce((sum, r) => sum + r.count, 0);
    const tablesWithData = results.filter(r => r.status === 'has_data').length;
    const emptyTables = results.filter(r => r.status === 'empty').length;
    
    console.log(`\nTotal Questions: ${totalQuestions}`);
    console.log(`Tables with Data: ${tablesWithData}`);
    console.log(`Empty Tables: ${emptyTables}\n`);
    
    // Detailed table
    console.log('Table Details:');
    console.log('-'.repeat(60));
    console.log('Table Name'.padEnd(30), 'Count'.padEnd(10), 'Status');
    console.log('-'.repeat(60));
    
    results.forEach(r => {
      const statusIcon = r.status === 'has_data' ? '✅' : '❌';
      console.log(
        r.table.padEnd(30),
        r.count.toString().padEnd(10),
        `${statusIcon} ${r.status.toUpperCase()}`
      );
    });
    
    console.log('-'.repeat(60));
    
    // Recommendations
    console.log('\n📋 RECOMMENDATIONS');
    console.log('='.repeat(60));
    
    if (totalQuestions === 0) {
      console.log('❌ NO QUESTIONS FOUND IN DATABASE!');
      console.log('\n⚠️  Action Required:');
      console.log('   1. Run seed scripts to populate database');
      console.log('   2. Command: npm run seed:all-questions');
      console.log('   3. Do NOT delete JSON files yet!');
    } else if (totalQuestions > 0 && emptyTables > 0) {
      console.log('⚠️  PARTIAL DATA FOUND');
      console.log('\nSome tables have data, others are empty:');
      results.filter(r => r.status === 'empty').forEach(r => {
        console.log(`   - ${r.table} is empty`);
      });
      console.log('\n📝 Next Steps:');
      console.log('   1. Verify if empty tables are expected');
      console.log('   2. Seed missing data if needed');
      console.log('   3. Keep JSON files as backup');
    } else {
      console.log('✅ ALL TABLES HAVE DATA!');
      console.log('\n🎉 Great! Questions are already in database.');
      console.log('\n📝 Next Steps:');
      console.log('   1. JSON files can be safely archived');
      console.log('   2. Run: npm run archive:json-files');
      console.log('   3. Files will be moved to: apps/backend/archive/');
      console.log('\n⚠️  Important: Files will be archived, NOT deleted');
      console.log('   You can always restore from archive if needed.');
    }
    
    // Check for hardcoded JSON files
    console.log('\n📂 CHECKING HARDCODED FILES');
    console.log('='.repeat(60));
    
    const fs = require('fs');
    const path = require('path');
    
    const dataPath = path.join(__dirname, '../apps/backend/src/data');
    
    if (fs.existsSync(dataPath)) {
      console.log('✓ Found: apps/backend/src/data/');
      
      const questionsPath = path.join(dataPath, 'questions');
      if (fs.existsSync(questionsPath)) {
        const codingArenaPath = path.join(questionsPath, 'coding-arena');
        const tcsNqtPath = path.join(questionsPath, 'tcs-nqt');
        
        if (fs.existsSync(codingArenaPath)) {
          const codingFiles = fs.readdirSync(codingArenaPath).filter((f: string) => f.endsWith('.json'));
          console.log(`  └─ coding-arena/: ${codingFiles.length} JSON files`);
        }
        
        if (fs.existsSync(tcsNqtPath)) {
          const tcsFiles = fs.readdirSync(tcsNqtPath).filter((f: string) => f.endsWith('.json'));
          console.log(`  └─ tcs-nqt/: ${tcsFiles.length} JSON files`);
        }
      }
      
      const tcsLegacyPath = path.join(dataPath, 'tcs-nqt-questions.json');
      if (fs.existsSync(tcsLegacyPath)) {
        console.log('  └─ tcs-nqt-questions.json (legacy file)');
      }
      
      console.log('\n💡 These files can be archived if database has data.');
    } else {
      console.log('✓ No hardcoded data folder found (already cleaned!)');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification Complete!');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    console.error('\nPlease check:');
    console.error('  1. Database connection is working');
    console.error('  2. Prisma schema is up to date');
    console.error('  3. Migrations have been run');
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyDatabaseQuestions();
