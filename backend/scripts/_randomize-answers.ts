import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// Realistic random pattern - like real exams with consecutive repeats
function generateRealisticPattern(count: number): string[] {
  const options = ['A', 'B', 'C', 'D'];
  const pattern: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Pick random option - allows consecutive repeats naturally
    pattern.push(options[Math.floor(Math.random() * 4)]);
  }
  return pattern;
}

async function main() {
  console.log('Randomizing answer patterns for all aptitude questions...\n');

  // Get all chapters with questions
  const chapters = await prisma.aptitudeChapter.findMany({
    where: { isActive: true },
    include: {
      questions: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
        include: { options: { orderBy: { order: 'asc' } } },
      },
      topic: { select: { name: true } },
    },
  });

  let totalUpdated = 0;

  for (const chapter of chapters) {
    if (chapter.questions.length === 0) continue;

    const newPattern = generateRealisticPattern(chapter.questions.length);
    
    console.log(`${chapter.topic.name} > ${chapter.name} (${chapter.questions.length} Q):`);
    console.log(`  New pattern: ${newPattern.join(', ')}`);

    for (let i = 0; i < chapter.questions.length; i++) {
      const q = chapter.questions[i];
      const newCorrect = newPattern[i];
      const currentCorrect = q.correctOption;

      if (currentCorrect === newCorrect) continue; // Already correct

      // Swap: move the correct answer text to the new position
      const correctOpt = q.options.find(o => o.optionKey === currentCorrect);
      const targetOpt = q.options.find(o => o.optionKey === newCorrect);

      if (!correctOpt || !targetOpt) continue;

      // Swap texts between current correct and target
      await prisma.aptitudeOption.update({
        where: { id: correctOpt.id },
        data: { text: targetOpt.text, isCorrect: false },
      });
      await prisma.aptitudeOption.update({
        where: { id: targetOpt.id },
        data: { text: correctOpt.text, isCorrect: true },
      });
      await prisma.aptitudeQuestion.update({
        where: { id: q.id },
        data: { correctOption: newCorrect },
      });
      totalUpdated++;
    }
    console.log('');
  }

  console.log(`Done! Updated ${totalUpdated} questions to realistic random pattern.`);

  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
