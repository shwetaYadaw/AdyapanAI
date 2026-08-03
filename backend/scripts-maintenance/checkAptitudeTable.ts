/**
 * Check if AptitudeQuestion table exists and has data
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

async function checkAptitudeTable() {
  try {
    console.log('🔍 Checking AptitudeQuestion table...\n');

    // Try to count aptitude questions
    try {
      const aptitudeCount = await prisma.aptitudeQuestion.count();
      console.log(`✅ AptitudeQuestion table EXISTS`);
      console.log(`📊 Total Aptitude Questions: ${aptitudeCount}\n`);

      if (aptitudeCount > 0) {
        // Show samples by module
        const modules = ['quantitative', 'verbal', 'logical'];
        
        for (const module of modules) {
          const count = await prisma.aptitudeQuestion.count({
            where: { module }
          });
          console.log(`   ${module.charAt(0).toUpperCase() + module.slice(1)}: ${count} questions`);
        }

        // Show sample questions
        const samples = await prisma.aptitudeQuestion.findMany({
          take: 3,
          select: {
            question: true,
            module: true,
            topic: true,
            difficulty: true,
          }
        });

        console.log('\n📋 Sample Questions:');
        samples.forEach((q, idx) => {
          console.log(`   ${idx + 1}. [${q.module}/${q.topic}] ${q.question.substring(0, 60)}...`);
        });
      } else {
        console.log('⚠️  AptitudeQuestion table is EMPTY');
        console.log('   Run seed script: npx ts-node src/scripts/seedAptitude.ts');
      }

    } catch (error: any) {
      if (error.code === 'P2021' || error.message.includes('does not exist')) {
        console.log('❌ AptitudeQuestion table DOES NOT EXIST');
        console.log('\n💡 To create it:');
        console.log('   1. Run SQL in Supabase dashboard (see QUICK_ACTION_CHECKLIST.md)');
        console.log('   OR');
        console.log('   2. Run: npx prisma migrate dev --name add-aptitude-questions');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkAptitudeTable();
