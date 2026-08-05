import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

async function addExperienceLevelColumn() {
  console.log('🔧 Adding experienceLevel column to TcsNqtQuestion table...\n');

  try {
    // Check if column already exists
    const result = await prisma.$queryRaw<any[]>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'TcsNqtQuestion' 
        AND column_name = 'experienceLevel';
    `;

    if (result.length > 0) {
      console.log('✅ Column "experienceLevel" already exists. Skipping.\n');
      return;
    }

    // Add the column with default value
    await prisma.$executeRaw`
      ALTER TABLE "TcsNqtQuestion" 
      ADD COLUMN "experienceLevel" TEXT NOT NULL DEFAULT 'freshers';
    `;

    // Create index for faster filtering
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "TcsNqtQuestion_experienceLevel_idx" 
      ON "TcsNqtQuestion"("experienceLevel");
    `;

    console.log('✅ Column "experienceLevel" added successfully!');
    console.log('✅ Index created on "experienceLevel"\n');

    // Verify
    const count = await prisma.tcsNqtQuestion.count();
    console.log(`📊 Total TCS NQT questions: ${count}`);
    console.log('   All existing questions defaulted to "freshers" level.\n');

  } catch (err: any) {
    console.error('❌ Error:', err.message);
    throw err;
  }
}

addExperienceLevelColumn()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
