import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 23 Intermediate Synonyms - "Choose the word closest in meaning"
// Answer pattern: C, A, D, B, D, A, C, B, A, D, C, B, D, A, C, B, D, C, A, B, D, A, C
const QUESTIONS = [
  {
    statement: "AMELIORATE",
    correctKey: 'C',
    options: ['Worsen', 'Destroy', 'Improve', 'Maintain'],
    explanation: "Ameliorate means to make something better; to improve. Improve is the closest synonym.",
  },
  {
    statement: "BRAZEN",
    correctKey: 'A',
    options: ['Bold', 'Timid', 'Quiet', 'Modest'],
    explanation: "Brazen means bold and without shame. Bold is the closest synonym.",
  },
  {
    statement: "CAPITULATE",
    correctKey: 'D',
    options: ['Fight', 'Resist', 'Attack', 'Surrender'],
    explanation: "Capitulate means to cease to resist; to surrender. Surrender is the closest synonym.",
  },
  {
    statement: "DEBILITATE",
    correctKey: 'B',
    options: ['Strengthen', 'Weaken', 'Destroy', 'Heal'],
    explanation: "Debilitate means to make someone weak and infirm. Weaken is the closest synonym.",
  },
  {
    statement: "ELUCIDATE",
    correctKey: 'D',
    options: ['Confuse', 'Hide', 'Complicate', 'Explain'],
    explanation: "Elucidate means to make something clear; to explain. Explain is the closest synonym.",
  },
  {
    statement: "FALLACIOUS",
    correctKey: 'A',
    options: ['Misleading', 'Truthful', 'Accurate', 'Reliable'],
    explanation: "Fallacious means based on a mistaken belief; misleading. Misleading is the closest synonym.",
  },
  {
    statement: "GRATUITOUS",
    correctKey: 'C',
    options: ['Necessary', 'Expensive', 'Unnecessary', 'Grateful'],
    explanation: "Gratuitous means done without good reason; uncalled for; unnecessary. Unnecessary is the closest synonym.",
  },
  {
    statement: "HEINOUS",
    correctKey: 'B',
    options: ['Minor', 'Wicked', 'Harmless', 'Gentle'],
    explanation: "Heinous means utterly odious or wicked. Wicked is the closest synonym.",
  },
  {
    statement: "INDELIBLE",
    correctKey: 'A',
    options: ['Permanent', 'Temporary', 'Erasable', 'Fading'],
    explanation: "Indelible means making marks that cannot be removed; permanent. Permanent is the closest synonym.",
  },
  {
    statement: "JUXTAPOSE",
    correctKey: 'D',
    options: ['Separate', 'Remove', 'Isolate', 'Place side by side'],
    explanation: "Juxtapose means to place close together for contrasting effect. 'Place side by side' is the closest meaning.",
  },
  {
    statement: "KNACK",
    correctKey: 'C',
    options: ['Weakness', 'Problem', 'Skill', 'Failure'],
    explanation: "Knack means an acquired or natural skill at performing a task. Skill is the closest synonym.",
  },
  {
    statement: "LANGUID",
    correctKey: 'B',
    options: ['Energetic', 'Sluggish', 'Quick', 'Active'],
    explanation: "Languid means displaying a lack of energy; sluggish. Sluggish is the closest synonym.",
  },
  {
    statement: "MAGNANIMOUS",
    correctKey: 'D',
    options: ['Selfish', 'Petty', 'Cruel', 'Generous'],
    explanation: "Magnanimous means generous or forgiving, especially toward a rival. Generous is the closest synonym.",
  },
  {
    statement: "NEFARIOUS",
    correctKey: 'A',
    options: ['Villainous', 'Noble', 'Honest', 'Kind'],
    explanation: "Nefarious means wicked or criminal. Villainous is the closest synonym.",
  },
  {
    statement: "OSTRACIZE",
    correctKey: 'C',
    options: ['Welcome', 'Include', 'Exclude', 'Praise'],
    explanation: "Ostracize means to exclude from a society or group. Exclude is the closest synonym.",
  },
  {
    statement: "PERNICIOUS",
    correctKey: 'B',
    options: ['Helpful', 'Harmful', 'Mild', 'Beneficial'],
    explanation: "Pernicious means having a harmful effect, especially in a gradual way. Harmful is the closest synonym.",
  },
  {
    statement: "QUERULOUS",
    correctKey: 'D',
    options: ['Content', 'Happy', 'Calm', 'Complaining'],
    explanation: "Querulous means complaining in a petulant or whining manner. Complaining is the closest synonym.",
  },
  {
    statement: "RAMPANT",
    correctKey: 'C',
    options: ['Controlled', 'Rare', 'Widespread', 'Limited'],
    explanation: "Rampant means flourishing or spreading unchecked. Widespread is the closest synonym.",
  },
  {
    statement: "SUCCINCT",
    correctKey: 'A',
    options: ['Brief', 'Lengthy', 'Detailed', 'Elaborate'],
    explanation: "Succinct means expressed in few words; brief and clearly expressed. Brief is the closest synonym.",
  },
  {
    statement: "TREPIDATION",
    correctKey: 'B',
    options: ['Courage', 'Fear', 'Joy', 'Anger'],
    explanation: "Trepidation means a feeling of fear or anxiety about something. Fear is the closest synonym.",
  },
  {
    statement: "USURP",
    correctKey: 'D',
    options: ['Give', 'Return', 'Share', 'Seize'],
    explanation: "Usurp means to take a position of power or importance illegally or by force. Seize is the closest synonym.",
  },
  {
    statement: "VINDICATE",
    correctKey: 'A',
    options: ['Justify', 'Blame', 'Accuse', 'Condemn'],
    explanation: "Vindicate means to clear of blame or suspicion; to justify. Justify is the closest synonym.",
  },
  {
    statement: "WHIMSICAL",
    correctKey: 'C',
    options: ['Serious', 'Boring', 'Playful', 'Strict'],
    explanation: "Whimsical means playfully quaint or fanciful. Playful is the closest synonym.",
  },
];

async function main() {
  console.log('Seeding 23 Intermediate Synonyms questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Synonyms' } });
  if (!topic) { console.error('Synonyms topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Intermediate Synonyms' },
  });
  if (!chapter) { console.error('Intermediate Synonyms chapter not found!'); process.exit(1); }

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
        difficulty: 'medium',
        correctOption: q.correctKey,
        explanation: q.explanation,
        xpReward: 15,
        timeLimit: 45,
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
