import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 30 Basic Synonyms - "Choose the word closest in meaning"
// Answer pattern: B, D, A, C, B, D, A, C, D, B, A, C, D, A, B, C, D, B, A, C, B, D, A, C, D, B, A, C, A, D
const QUESTIONS = [
  {
    statement: "BENIGN",
    correctKey: 'B',
    options: ['Hostile', 'Harmless', 'Dangerous', 'Painful'],
    explanation: "Benign means gentle, kindly, or not harmful. Harmless is the closest synonym.",
  },
  {
    statement: "ARDUOUS",
    correctKey: 'D',
    options: ['Simple', 'Pleasant', 'Quick', 'Difficult'],
    explanation: "Arduous means requiring great effort or difficult. Difficult is the closest synonym.",
  },
  {
    statement: "CANDID",
    correctKey: 'A',
    options: ['Frank', 'Secretive', 'Polite', 'Cunning'],
    explanation: "Candid means truthful and straightforward. Frank is the closest synonym.",
  },
  {
    statement: "COGENT",
    correctKey: 'C',
    options: ['Weak', 'Unclear', 'Convincing', 'Boring'],
    explanation: "Cogent means clear, logical, and convincing. Convincing is the closest synonym.",
  },
  {
    statement: "DILIGENT",
    correctKey: 'B',
    options: ['Lazy', 'Hardworking', 'Intelligent', 'Careless'],
    explanation: "Diligent means having or showing care and effort in one's work. Hardworking is the closest synonym.",
  },
  {
    statement: "ELOQUENT",
    correctKey: 'D',
    options: ['Silent', 'Rude', 'Boring', 'Expressive'],
    explanation: "Eloquent means fluent or persuasive in speaking or writing. Expressive is the closest synonym.",
  },
  {
    statement: "FRUGAL",
    correctKey: 'A',
    options: ['Thrifty', 'Wasteful', 'Generous', 'Expensive'],
    explanation: "Frugal means sparing or economical with money or resources. Thrifty is the closest synonym.",
  },
  {
    statement: "GREGARIOUS",
    correctKey: 'C',
    options: ['Shy', 'Angry', 'Sociable', 'Lonely'],
    explanation: "Gregarious means fond of company; sociable. Sociable is the closest synonym.",
  },
  {
    statement: "IMPECCABLE",
    correctKey: 'D',
    options: ['Faulty', 'Average', 'Ordinary', 'Flawless'],
    explanation: "Impeccable means without fault or error; flawless. Flawless is the closest synonym.",
  },
  {
    statement: "JUBILANT",
    correctKey: 'B',
    options: ['Sad', 'Joyful', 'Angry', 'Nervous'],
    explanation: "Jubilant means feeling or expressing great happiness and triumph. Joyful is the closest synonym.",
  },
  {
    statement: "KINDLE",
    correctKey: 'A',
    options: ['Ignite', 'Extinguish', 'Cool', 'Freeze'],
    explanation: "Kindle means to light or set on fire; to ignite. Ignite is the closest synonym.",
  },
  {
    statement: "LUCID",
    correctKey: 'C',
    options: ['Confusing', 'Dark', 'Clear', 'Dull'],
    explanation: "Lucid means expressed clearly; easy to understand. Clear is the closest synonym.",
  },
  {
    statement: "MUNDANE",
    correctKey: 'D',
    options: ['Exciting', 'Unusual', 'Sacred', 'Ordinary'],
    explanation: "Mundane means lacking interest or excitement; dull; ordinary. Ordinary is the closest synonym.",
  },
  {
    statement: "NIMBLE",
    correctKey: 'A',
    options: ['Agile', 'Slow', 'Heavy', 'Clumsy'],
    explanation: "Nimble means quick and light in movement or action; agile. Agile is the closest synonym.",
  },
  {
    statement: "OBSCURE",
    correctKey: 'B',
    options: ['Famous', 'Unclear', 'Bright', 'Obvious'],
    explanation: "Obscure means not clearly expressed or easily understood; unclear. Unclear is the closest synonym.",
  },
  {
    statement: "PRUDENT",
    correctKey: 'C',
    options: ['Reckless', 'Foolish', 'Cautious', 'Hasty'],
    explanation: "Prudent means acting with or showing care and thought for the future. Cautious is the closest synonym.",
  },
  {
    statement: "QUENCH",
    correctKey: 'D',
    options: ['Start', 'Increase', 'Ignite', 'Satisfy'],
    explanation: "Quench means to satisfy (thirst) or extinguish (fire). Satisfy is the closest synonym in common usage.",
  },
  {
    statement: "RESILIENT",
    correctKey: 'B',
    options: ['Fragile', 'Tough', 'Weak', 'Brittle'],
    explanation: "Resilient means able to recover quickly from difficulties; tough. Tough is the closest synonym.",
  },
  {
    statement: "SERENE",
    correctKey: 'A',
    options: ['Peaceful', 'Chaotic', 'Noisy', 'Restless'],
    explanation: "Serene means calm, peaceful, and untroubled. Peaceful is the closest synonym.",
  },
  {
    statement: "TENACIOUS",
    correctKey: 'C',
    options: ['Weak', 'Lazy', 'Persistent', 'Flexible'],
    explanation: "Tenacious means holding firmly to something; persistent. Persistent is the closest synonym.",
  },
  {
    statement: "UBIQUITOUS",
    correctKey: 'B',
    options: ['Rare', 'Everywhere', 'Hidden', 'Unique'],
    explanation: "Ubiquitous means present, appearing, or found everywhere. Everywhere is the closest meaning.",
  },
  {
    statement: "VIVACIOUS",
    correctKey: 'D',
    options: ['Dull', 'Quiet', 'Sad', 'Lively'],
    explanation: "Vivacious means attractively lively and animated. Lively is the closest synonym.",
  },
  {
    statement: "WARY",
    correctKey: 'A',
    options: ['Cautious', 'Bold', 'Careless', 'Trusting'],
    explanation: "Wary means feeling or showing caution about possible dangers. Cautious is the closest synonym.",
  },
  {
    statement: "ZEALOUS",
    correctKey: 'C',
    options: ['Lazy', 'Calm', 'Enthusiastic', 'Indifferent'],
    explanation: "Zealous means having great energy or enthusiasm. Enthusiastic is the closest synonym.",
  },
  {
    statement: "ABATE",
    correctKey: 'D',
    options: ['Increase', 'Worsen', 'Intensify', 'Reduce'],
    explanation: "Abate means to become less intense or widespread; to reduce. Reduce is the closest synonym.",
  },
  {
    statement: "BREVITY",
    correctKey: 'B',
    options: ['Length', 'Shortness', 'Complexity', 'Depth'],
    explanation: "Brevity means concise and exact use of words; shortness of time. Shortness is the closest synonym.",
  },
  {
    statement: "COERCE",
    correctKey: 'A',
    options: ['Force', 'Request', 'Suggest', 'Advise'],
    explanation: "Coerce means to persuade someone by using force or threats. Force is the closest synonym.",
  },
  {
    statement: "DOCILE",
    correctKey: 'C',
    options: ['Aggressive', 'Wild', 'Submissive', 'Strong'],
    explanation: "Docile means ready to accept control or instruction; submissive. Submissive is the closest synonym.",
  },
  {
    statement: "ELUSIVE",
    correctKey: 'A',
    options: ['Hard to catch', 'Easy to find', 'Obvious', 'Visible'],
    explanation: "Elusive means difficult to find, catch, or achieve. 'Hard to catch' is the closest meaning.",
  },
  {
    statement: "FUTILE",
    correctKey: 'D',
    options: ['Successful', 'Powerful', 'Effective', 'Useless'],
    explanation: "Futile means incapable of producing any useful result; pointless. Useless is the closest synonym.",
  },
];

async function main() {
  console.log('Seeding 30 Basic Synonyms questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Synonyms' } });
  if (!topic) { console.error('Synonyms topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Basic Synonyms' },
  });
  if (!chapter) { console.error('Basic Synonyms chapter not found!'); process.exit(1); }

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
        difficulty: 'easy',
        correctOption: q.correctKey,
        explanation: q.explanation,
        xpReward: 10,
        timeLimit: 30,
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
