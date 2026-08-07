import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 23 Advanced Vocabulary Synonyms - harder words
// Answer pattern: D, B, A, C, A, D, B, C, D, A, B, C, A, D, B, C, D, A, B, C, A, D, B
const QUESTIONS = [
  {
    statement: "OBSEQUIOUS",
    correctKey: 'D',
    options: ['Rebellious', 'Proud', 'Independent', 'Servile'],
    explanation: "Obsequious means excessively obedient or attentive; servile. Servile is the closest synonym.",
  },
  {
    statement: "PERSPICACIOUS",
    correctKey: 'B',
    options: ['Dull', 'Perceptive', 'Slow', 'Confused'],
    explanation: "Perspicacious means having a ready insight into things; perceptive. Perceptive is the closest synonym.",
  },
  {
    statement: "RECALCITRANT",
    correctKey: 'A',
    options: ['Defiant', 'Obedient', 'Cooperative', 'Agreeable'],
    explanation: "Recalcitrant means having an obstinately uncooperative attitude; defiant. Defiant is the closest synonym.",
  },
  {
    statement: "SANGUINE",
    correctKey: 'C',
    options: ['Pessimistic', 'Angry', 'Optimistic', 'Bloody'],
    explanation: "Sanguine means optimistic or positive, especially in a difficult situation. Optimistic is the closest synonym.",
  },
  {
    statement: "TACITURN",
    correctKey: 'A',
    options: ['Reserved', 'Talkative', 'Loud', 'Cheerful'],
    explanation: "Taciturn means reserved or uncommunicative in speech; saying little. Reserved is the closest synonym.",
  },
  {
    statement: "UMBRAGE",
    correctKey: 'D',
    options: ['Joy', 'Shade', 'Peace', 'Offense'],
    explanation: "Umbrage means offense or annoyance (as in 'take umbrage at'). Offense is the closest synonym.",
  },
  {
    statement: "VENERATE",
    correctKey: 'B',
    options: ['Despise', 'Revere', 'Ignore', 'Criticize'],
    explanation: "Venerate means to regard with great respect; to revere. Revere is the closest synonym.",
  },
  {
    statement: "ACRIMONIOUS",
    correctKey: 'C',
    options: ['Sweet', 'Friendly', 'Bitter', 'Mild'],
    explanation: "Acrimonious means angry and bitter in tone. Bitter is the closest synonym.",
  },
  {
    statement: "BELLICOSE",
    correctKey: 'D',
    options: ['Peaceful', 'Beautiful', 'Timid', 'Aggressive'],
    explanation: "Bellicose means demonstrating aggression and willingness to fight. Aggressive is the closest synonym.",
  },
  {
    statement: "CIRCUMSPECT",
    correctKey: 'A',
    options: ['Careful', 'Reckless', 'Quick', 'Bold'],
    explanation: "Circumspect means wary and unwilling to take risks; careful. Careful is the closest synonym.",
  },
  {
    statement: "DELETERIOUS",
    correctKey: 'B',
    options: ['Beneficial', 'Harmful', 'Helpful', 'Mild'],
    explanation: "Deleterious means causing harm or damage. Harmful is the closest synonym.",
  },
  {
    statement: "EFFERVESCENT",
    correctKey: 'C',
    options: ['Flat', 'Dull', 'Bubbly', 'Stale'],
    explanation: "Effervescent means vivacious and enthusiastic; bubbly. Bubbly is the closest synonym.",
  },
  {
    statement: "FASTIDIOUS",
    correctKey: 'A',
    options: ['Meticulous', 'Careless', 'Sloppy', 'Casual'],
    explanation: "Fastidious means very attentive to accuracy and detail; meticulous. Meticulous is the closest synonym.",
  },
  {
    statement: "GARRULOUS",
    correctKey: 'D',
    options: ['Quiet', 'Reserved', 'Shy', 'Talkative'],
    explanation: "Garrulous means excessively talkative, especially on trivial matters. Talkative is the closest synonym.",
  },
  {
    statement: "HAPLESS",
    correctKey: 'B',
    options: ['Lucky', 'Unfortunate', 'Happy', 'Skilled'],
    explanation: "Hapless means unfortunate; having no luck. Unfortunate is the closest synonym.",
  },
  {
    statement: "INEXORABLE",
    correctKey: 'C',
    options: ['Flexible', 'Avoidable', 'Unstoppable', 'Gentle'],
    explanation: "Inexorable means impossible to stop or prevent; unstoppable. Unstoppable is the closest synonym.",
  },
  {
    statement: "JUDICIOUSLY",
    correctKey: 'D',
    options: ['Carelessly', 'Hastily', 'Foolishly', 'Wisely'],
    explanation: "Judiciously means with good judgment or sense; wisely. Wisely is the closest synonym.",
  },
  {
    statement: "LACONIC",
    correctKey: 'A',
    options: ['Terse', 'Verbose', 'Wordy', 'Elaborate'],
    explanation: "Laconic means using very few words; terse. Terse is the closest synonym.",
  },
  {
    statement: "MELLIFLUOUS",
    correctKey: 'B',
    options: ['Harsh', 'Sweet-sounding', 'Loud', 'Grating'],
    explanation: "Mellifluous means sweet or musical; pleasant to hear. Sweet-sounding is the closest synonym.",
  },
  {
    statement: "NONCHALANT",
    correctKey: 'C',
    options: ['Anxious', 'Excited', 'Casual', 'Nervous'],
    explanation: "Nonchalant means feeling or appearing casually calm and relaxed. Casual is the closest synonym.",
  },
  {
    statement: "PANACEA",
    correctKey: 'A',
    options: ['Cure-all', 'Disease', 'Symptom', 'Problem'],
    explanation: "Panacea means a solution or remedy for all difficulties or diseases; a cure-all. Cure-all is the closest synonym.",
  },
  {
    statement: "QUOTIDIAN",
    correctKey: 'D',
    options: ['Rare', 'Special', 'Unusual', 'Daily'],
    explanation: "Quotidian means of or occurring every day; daily or ordinary. Daily is the closest synonym.",
  },
  {
    statement: "REPUDIATE",
    correctKey: 'B',
    options: ['Accept', 'Reject', 'Embrace', 'Welcome'],
    explanation: "Repudiate means to refuse to accept or be associated with; to reject. Reject is the closest synonym.",
  },
];

async function main() {
  console.log('Seeding 23 Advanced Vocabulary questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Synonyms' } });
  if (!topic) { console.error('Synonyms topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Advanced Vocabulary' },
  });
  if (!chapter) { console.error('Advanced Vocabulary chapter not found!'); process.exit(1); }

  console.log(`Topic: ${topic.name} | Chapter: ${chapter.name}\n`);

  let created = 0, skipped = 0;

  for (const q of QUESTIONS) {
    const existing = await prisma.aptitudeQuestion.findFirst({
      where: { chapterId: chapter.id, statement: { equals: q.statement, mode: 'insensitive' } },
    });
    if (existing) { skipped++; continue; }

    const options = q.options.map((text, i) => {
      const key = ['A', 'B', 'C', 'D'][i];
      return { optionKey: key, text, isCorrect: key === q.correctKey, order: i };
    });

    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: chapter.id,
        statement: q.statement,
        difficulty: 'hard',
        correctOption: q.correctKey,
        explanation: q.explanation,
        xpReward: 20,
        timeLimit: 60,
        options: { create: options },
      },
    });
    created++;
    console.log(`  [+] Q${created}: ${q.statement}`);
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);

  const all = await prisma.aptitudeQuestion.findMany({
    where: { chapterId: chapter.id, isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { correctOption: true },
  });
  console.log(`Answer pattern: ${all.map(q => q.correctOption).join(', ')}`);

  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
