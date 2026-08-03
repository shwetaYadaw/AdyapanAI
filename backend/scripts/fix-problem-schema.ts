import { prisma } from '../src/config/prisma';

async function fixProblemSchema() {
  try {
    console.log('🔧 Fixing Problem table schema...\n');

    // Add missing columns to Problem table if they don't exist
    const missingColumns = [
      { name: 'tags', type: 'TEXT', default: "''" },
      { name: 'category', type: 'VARCHAR(255)', default: "'general'" },
      { name: 'successRate', type: 'DOUBLE PRECISION', default: '0' },
      { name: 'totalAttempts', type: 'INTEGER', default: '0' },
      { name: 'totalAccepted', type: 'INTEGER', default: '0' },
      { name: 'averageRuntime', type: 'INTEGER', default: '0' },
      { name: 'isArchived', type: 'BOOLEAN', default: 'false' },
      { name: 'metadata', type: 'JSONB', default: null }
    ];

    for (const col of missingColumns) {
      try {
        const defaultValue = col.default ? `DEFAULT ${col.default}` : '';
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Problem" 
          ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} ${defaultValue}
        `);
        console.log(`✅ Added column: ${col.name}`);
      } catch (err: any) {
        if (err.message.includes('already exists')) {
          console.log(`⏭️  Column already exists: ${col.name}`);
        } else {
          console.error(`❌ Error adding ${col.name}:`, err.message);
        }
      }
    }

    console.log('\n✨ Schema fix complete!\n');
    
    // Verify the fix
    const testProblem = await prisma.problem.findFirst({
      select: {
        id: true,
        title: true,
        slug: true,
        tags: true,
        category: true
      }
    });
    
    if (testProblem) {
      console.log('✅ Verification successful:');
      console.log(`   Problem: ${testProblem.title}`);
      console.log(`   Slug: ${testProblem.slug}`);
      console.log(`   Tags: ${testProblem.tags || '(empty)'}`);
      console.log(`   Category: ${testProblem.category || '(empty)'}\n`);
    }

  } catch (error) {
    console.error('❌ Schema fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProblemSchema();
