import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function deleteDuplicates() {
  try {
    console.log('🔍 Searching for duplicate 3Sum questions...');
    
    // Find all 3Sum questions (sorted by creation date, keep the most recent)
    const questions = await prisma.question.findMany({
      where: { title: '3Sum' },
      orderBy: { createdAt: 'desc' }
    });

    if (questions.length > 1) {
      console.log(`Found ${questions.length} 3Sum questions. Keeping the most recent, deleting ${questions.length - 1} duplicates...`);
      
      // Delete all except the first (most recent)
      for (let i = 1; i < questions.length; i++) {
        const deleted = await prisma.question.delete({
          where: { id: questions[i].id }
        });
        console.log(`✅ Deleted old 3Sum question: ${deleted.id}`);
      }
    } else {
      console.log('✅ No duplicates found. Single 3Sum question exists.');
    }

    console.log('✅ Deletion process completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

deleteDuplicates();
