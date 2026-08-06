/**
 * Fix: Randomize correct option positions for Time & Distance and Problems on Train
 * Shuffles options so correct answer isn't always A
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function fix() {
  console.log('🔀 Randomizing correct option positions...\n');

  const topic = await prisma.aptitudeTopic.findUnique({
    where: { name: 'Arithmetic Aptitude' },
    include: { chapters: true },
  });
  if (!topic) { console.log('Topic not found'); return; }

  for (const chapter of topic.chapters) {
    console.log(`📂 ${chapter.name}:`);

    const questions = await prisma.aptitudeQuestion.findMany({
      where: { chapterId: chapter.id },
      include: { options: { orderBy: { order: 'asc' } } },
    });

    let changed = 0;
    const keys = ['A', 'B', 'C', 'D'];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.options.length !== 4) continue;

      // TRUE RANDOM - no pattern
      const newCorrectIdx = Math.floor(Math.random() * 4);
      const newCorrectKey = keys[newCorrectIdx];

      // Find current correct option
      const currentCorrectOpt = q.options.find(o => o.optionKey === q.correctOption);
      if (!currentCorrectOpt) continue;

      // If already in desired position, skip
      if (q.correctOption === newCorrectKey) continue;

      // Swap: put correct answer text at newCorrectKey position, move that text to old position
      const targetOpt = q.options.find(o => o.optionKey === newCorrectKey);
      if (!targetOpt) continue;

      // Swap texts
      const correctText = currentCorrectOpt.text;
      const targetText = targetOpt.text;

      // Update option texts in DB
      await prisma.aptitudeOption.update({
        where: { id: currentCorrectOpt.id },
        data: { text: targetText, isCorrect: false },
      });
      await prisma.aptitudeOption.update({
        where: { id: targetOpt.id },
        data: { text: correctText, isCorrect: true },
      });

      // Update question's correctOption
      await prisma.aptitudeQuestion.update({
        where: { id: q.id },
        data: { correctOption: newCorrectKey },
      });

      changed++;
    }

    console.log(`   ✅ Shuffled ${changed}/${questions.length} questions`);
  }

  console.log('\n🎉 Done! Options are now distributed across A, B, C, D');
}

fix().catch(e => { console.error('❌', e); process.exit(1); }).finally(() => prisma.$disconnect());
