/**
 * Migrate Legacy DSA Questions to Problem Table
 * 
 * This script:
 * 1. Identifies questions in Question table that are NOT TCS NQT
 * 2. Migrates them to Problem table (avoiding duplicates)
 * 3. Removes them from Question table
 * 4. Leaves only TCS NQT questions in Question table
 * 
 * Usage:
 *   npx ts-node src/scripts/migrateLegacyDsaToProblems.ts
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

interface QuestionData {
  id: string;
  title: string;
  slug: string;
  statement: string;
  difficulty: string;
  topics: any;
  companies: any;
  timeLimit: number;
  memoryLimit: number;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  templates: any;
  testCases: any;
  xpReward: number;
  createdAt: Date;
}

async function migrateLegacyDsa() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║        Migrate Legacy DSA Questions to Problem Table              ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    // Step 1: Get all questions from Question table
    console.log('📊 Step 1: Analyzing Question table...\n');
    const allQuestions = await prisma.question.findMany();
    console.log(`   Total questions in Question table: ${allQuestions.length}`);

    // Step 2: Identify TCS NQT vs Legacy DSA questions
    const tcsNqtQuestions: QuestionData[] = [];
    const legacyDsaQuestions: QuestionData[] = [];

    allQuestions.forEach((q: any) => {
      let topics: string[] = [];
      
      try {
        topics = Array.isArray(q.topics) ? q.topics : JSON.parse(q.topics);
      } catch (e) {
        topics = [];
      }

      // Check if question has 'tcs-nqt' topic
      const isTcsNqt = topics.some(t => 
        t.toLowerCase().includes('tcs-nqt') || 
        t.toLowerCase().includes('tcs_nqt') ||
        t.toLowerCase() === 'tcs'
      );

      if (isTcsNqt) {
        tcsNqtQuestions.push(q);
      } else {
        legacyDsaQuestions.push(q);
      }
    });

    console.log(`   ✅ TCS NQT questions:        ${tcsNqtQuestions.length}`);
    console.log(`   🔄 Legacy DSA questions:     ${legacyDsaQuestions.length}\n`);

    if (legacyDsaQuestions.length === 0) {
      console.log('✅ No legacy DSA questions found! Question table already clean.\n');
      return;
    }

    // Step 3: Check existing problems to avoid duplicates
    console.log('📊 Step 2: Checking for duplicates in Problem table...\n');
    const existingProblems = await prisma.problem.findMany({
      select: { slug: true, title: true }
    });

    const existingSlugs = new Set(existingProblems.map(p => p.slug));
    const existingTitles = new Set(existingProblems.map(p => p.title.toLowerCase().trim()));

    const questionsToMigrate: QuestionData[] = [];
    const duplicateQuestions: QuestionData[] = [];

    legacyDsaQuestions.forEach(q => {
      const isDuplicate = existingSlugs.has(q.slug) || existingTitles.has(q.title.toLowerCase().trim());
      
      if (isDuplicate) {
        duplicateQuestions.push(q);
      } else {
        questionsToMigrate.push(q);
      }
    });

    console.log(`   Questions to migrate:        ${questionsToMigrate.length}`);
    console.log(`   Duplicates (skip):           ${duplicateQuestions.length}\n`);

    // Show sample of questions to migrate
    if (questionsToMigrate.length > 0) {
      console.log('📋 Sample questions to migrate:\n');
      questionsToMigrate.slice(0, 10).forEach((q, idx) => {
        let topics: string[] = [];
        try {
          topics = Array.isArray(q.topics) ? q.topics : JSON.parse(q.topics);
        } catch (e) {
          topics = [];
        }
        console.log(`   ${idx + 1}. ${q.title.substring(0, 60)}...`);
        console.log(`      Topics: ${topics.slice(0, 3).join(', ')}`);
      });
      if (questionsToMigrate.length > 10) {
        console.log(`   ... and ${questionsToMigrate.length - 10} more\n`);
      } else {
        console.log();
      }
    }

    // Show sample of duplicates
    if (duplicateQuestions.length > 0) {
      console.log('⚠️  Sample duplicate questions (will be removed from Question table):\n');
      duplicateQuestions.slice(0, 5).forEach((q, idx) => {
        console.log(`   ${idx + 1}. ${q.title.substring(0, 60)}...`);
        console.log(`      Slug: ${q.slug} (already exists in Problem table)`);
      });
      if (duplicateQuestions.length > 5) {
        console.log(`   ... and ${duplicateQuestions.length - 5} more\n`);
      } else {
        console.log();
      }
    }

    console.log('═'.repeat(70));
    console.log('MIGRATION PLAN:');
    console.log('═'.repeat(70));
    console.log(`1. Migrate ${questionsToMigrate.length} new DSA questions to Problem table`);
    console.log(`2. Delete ${legacyDsaQuestions.length} legacy DSA questions from Question table`);
    console.log(`3. Keep ${tcsNqtQuestions.length} TCS NQT questions in Question table`);
    console.log('═'.repeat(70) + '\n');

    // Step 4: Migrate questions to Problem table
    if (questionsToMigrate.length > 0) {
      console.log('🔄 Step 3: Migrating questions to Problem table...\n');
      
      let migratedCount = 0;
      let errorCount = 0;

      for (const question of questionsToMigrate) {
        try {
          // Parse topics and companies
          let topics: string[] = [];
          let companies: string[] = [];
          
          try {
            topics = Array.isArray(question.topics) ? question.topics : JSON.parse(question.topics);
            companies = Array.isArray(question.companies) ? question.companies : JSON.parse(question.companies);
          } catch (e) {
            topics = [];
            companies = [];
          }

          // Convert Question format to Problem format
          const problemData: any = {
            title: question.title,
            slug: question.slug,
            difficulty: question.difficulty || 'medium',
            statement: question.statement,
            constraints: question.constraints,
            inputFormat: question.inputFormat,
            outputFormat: question.outputFormat,
            timeLimit: question.timeLimit || 2000,
            memoryLimit: question.memoryLimit || 256,
            starterCode: question.templates || {},
            referenceSolution: '', // Legacy questions may not have reference solution
            topics: topics.join(', '), // Problem table stores as comma-separated string
            companies: companies.join(', '),
            executionMode: 'fullProgram' as const, // Default mode
            createdAt: question.createdAt,
          };

          // Create in Problem table
          await prisma.problem.create({
            data: problemData
          });

          // Migrate test cases if they exist
          if (question.testCases) {
            try {
              const testCases = Array.isArray(question.testCases) 
                ? question.testCases 
                : JSON.parse(question.testCases);

              if (Array.isArray(testCases) && testCases.length > 0) {
                const problem = await prisma.problem.findUnique({
                  where: { slug: question.slug }
                });

                if (problem) {
                  for (const tc of testCases) {
                    await prisma.problemTestCase.create({
                      data: {
                        problemId: problem.id,
                        input: tc.input || '',
                        expectedOutput: tc.output || tc.expectedOutput || '',
                        isHidden: tc.isHidden !== false, // Default to hidden
                        type: tc.isHidden === false ? 'sample' : 'hidden',
                      }
                    });
                  }
                }
              }
            } catch (e) {
              // Test case migration failed, but problem created successfully
            }
          }

          migratedCount++;
          if (migratedCount % 10 === 0) {
            console.log(`   Migrated ${migratedCount}/${questionsToMigrate.length}...`);
          }

        } catch (error: any) {
          errorCount++;
          console.error(`   ❌ Failed to migrate: ${question.title}`);
          console.error(`      Error: ${error.message}`);
        }
      }

      console.log(`\n   ✅ Successfully migrated: ${migratedCount}/${questionsToMigrate.length}`);
      if (errorCount > 0) {
        console.log(`   ❌ Failed to migrate: ${errorCount}`);
      }
      console.log();
    }

    // Step 5: Remove all legacy DSA questions from Question table
    console.log('🗑️  Step 4: Removing legacy DSA questions from Question table...\n');
    
    const idsToDelete = legacyDsaQuestions.map(q => q.id);
    
    const deleteResult = await prisma.question.deleteMany({
      where: {
        id: { in: idsToDelete }
      }
    });

    console.log(`   ✅ Deleted ${deleteResult.count} legacy DSA questions from Question table\n`);

    // Step 6: Verify final state
    console.log('📊 Step 5: Verifying final state...\n');
    
    const finalQuestionCount = await prisma.question.count();
    const finalProblemCount = await prisma.problem.count();

    // Sample remaining questions
    const remainingQuestions = await prisma.question.findMany({
      take: 5,
      select: {
        title: true,
        topics: true,
      }
    });

    console.log('   Remaining questions in Question table:');
    remainingQuestions.forEach((q, idx) => {
      let topics: string[] = [];
      try {
        if (q.topics) {
          topics = Array.isArray(q.topics) ? q.topics : JSON.parse(q.topics as string);
        }
      } catch (e) {
        topics = [];
      }
      console.log(`   ${idx + 1}. ${q.title.substring(0, 60)}...`);
      console.log(`      Topics: ${topics.join(', ')}`);
    });

    console.log('\n' + '═'.repeat(70));
    console.log('FINAL RESULTS:');
    console.log('═'.repeat(70));
    console.log(`📊 Question table (TCS NQT only):    ${finalQuestionCount}`);
    console.log(`📊 Problem table (DSA Coding Arena): ${finalProblemCount}`);
    console.log('═'.repeat(70));

    console.log('\n✅ Migration completed successfully!\n');
    console.log('💡 Next steps:');
    console.log('   1. Verify TCS NQT page shows only TCS NQT questions');
    console.log('   2. Verify Coding Arena shows all DSA problems');
    console.log('   3. Test that no questions are missing\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// Run the migration
migrateLegacyDsa()
  .then(() => {
    console.log('🎉 Migration script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
