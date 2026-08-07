import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 23 Advanced Analogies - complex, multi-layered relationships
// Answer pattern: A, C, D, B, C, A, D, B, C, D, A, B, D, C, A, B, D, A, C, B, D, C, A
const QUESTIONS = [
  {
    statement: "POSTHUMOUS : DEATH",
    correctKey: 'A',
    options: ['Postgraduate : Graduation', 'Prefix : Word', 'Prelude : Music', 'Epilogue : Story'],
    explanation: "Posthumous means after death. Postgraduate means after graduation. Both use 'post-' meaning after an event.",
  },
  {
    statement: "ARCHIPELAGO : ISLAND",
    correctKey: 'C',
    options: ['Mountain : Hill', 'Ocean : Wave', 'Galaxy : Star', 'Forest : Leaf'],
    explanation: "An archipelago is a collection of islands. A galaxy is a collection of stars. The relationship is large group : individual unit.",
  },
  {
    statement: "CONNOISSEUR : TASTE",
    correctKey: 'D',
    options: ['Teacher : School', 'Chef : Kitchen', 'Doctor : Hospital', 'Virtuoso : Skill'],
    explanation: "A connoisseur is an expert in matters of fine taste. A virtuoso is an expert with exceptional skill. Both refer to a person with refined expertise.",
  },
  {
    statement: "ANARCHY : GOVERNMENT",
    correctKey: 'B',
    options: ['War : Army', 'Atheism : Religion', 'Democracy : People', 'Chaos : Storm'],
    explanation: "Anarchy is the absence of government. Atheism is the absence of religion/belief in God. Both represent the negation of a system.",
  },
  {
    statement: "DILETTANTE : EXPERT",
    correctKey: 'C',
    options: ['Artist : Painter', 'Student : Teacher', 'Charlatan : Genuine', 'Novice : Learner'],
    explanation: "A dilettante (superficial dabbler) is opposite of an expert. A charlatan (fraud) is opposite of genuine. Both pairs contrast pretense with authenticity/mastery.",
  },
  {
    statement: "LABYRINTH : CONFUSION",
    correctKey: 'A',
    options: ['Quagmire : Difficulty', 'Road : Travel', 'Map : Direction', 'Puzzle : Game'],
    explanation: "A labyrinth leads to confusion. A quagmire (swamp/difficult situation) leads to difficulty. Both represent something that traps or bewilders.",
  },
  {
    statement: "PLAGIARISM : IDEAS",
    correctKey: 'D',
    options: ['Writing : Author', 'Copying : Exam', 'Fraud : Money', 'Piracy : Content'],
    explanation: "Plagiarism is the theft of ideas. Piracy is the theft of content (digital). Both are forms of intellectual property theft.",
  },
  {
    statement: "CATALYST : REACTION",
    correctKey: 'B',
    options: ['Fuel : Fire', 'Stimulus : Response', 'Chemical : Experiment', 'Heat : Temperature'],
    explanation: "A catalyst speeds up a reaction. A stimulus triggers a response. Both initiate or accelerate a process without being consumed in it.",
  },
  {
    statement: "METAMORPHOSIS : BUTTERFLY",
    correctKey: 'C',
    options: ['Growth : Plant', 'Change : Weather', 'Puberty : Adolescent', 'Evolution : Species'],
    explanation: "Metamorphosis is the dramatic transformation a butterfly undergoes. Puberty is the dramatic transformation an adolescent undergoes. Both are biological transformations.",
  },
  {
    statement: "PALETTE : PAINTER",
    correctKey: 'D',
    options: ['Pen : Writer', 'Stage : Actor', 'Hammer : Carpenter', 'Anvil : Blacksmith'],
    explanation: "A palette is the specific work surface for a painter. An anvil is the specific work surface for a blacksmith. Both are specialized platforms for their craft.",
  },
  {
    statement: "FILIBUSTER : LEGISLATION",
    correctKey: 'A',
    options: ['Veto : Decision', 'Vote : Election', 'Law : Court', 'Speech : Parliament'],
    explanation: "A filibuster is used to obstruct/delay legislation. A veto is used to obstruct/block a decision. Both are mechanisms to prevent action.",
  },
  {
    statement: "PANDEMIC : EPIDEMIC",
    correctKey: 'B',
    options: ['Big : Small', 'Global : Regional', 'Disease : Virus', 'Death : Illness'],
    explanation: "A pandemic is worldwide; an epidemic is regional. The difference is in geographical scope. Global is to regional as pandemic is to epidemic.",
  },
  {
    statement: "STOIC : EMOTION",
    correctKey: 'D',
    options: ['Happy : Joy', 'Miser : Wealth', 'Silent : Voice', 'Ascetic : Luxury'],
    explanation: "A stoic suppresses/avoids emotion. An ascetic renounces luxury. Both voluntarily deny themselves something.",
  },
  {
    statement: "MANUSCRIPT : PUBLISHED",
    correctKey: 'C',
    options: ['Idea : Thought', 'Plan : Blueprint', 'Prototype : Manufactured', 'Draft : Written'],
    explanation: "A manuscript becomes a published work after the production process. A prototype becomes a manufactured product. Both are the preliminary version of a final product.",
  },
  {
    statement: "SOLILOQUY : AUDIENCE",
    correctKey: 'A',
    options: ['Monologue : Conversation', 'Speech : Crowd', 'Song : Singer', 'Dialogue : Play'],
    explanation: "A soliloquy is spoken without an audience (to oneself). A monologue lacks the back-and-forth of a conversation. Both represent one-sided communication.",
  },
  {
    statement: "HYPOTHESIS : THEORY",
    correctKey: 'B',
    options: ['Question : Answer', 'Suspicion : Conviction', 'Idea : Plan', 'Guess : Truth'],
    explanation: "A hypothesis is an untested idea that becomes a theory after evidence. A suspicion is unconfirmed doubt that becomes a conviction after proof. Both progress from uncertain to certain.",
  },
  {
    statement: "ALTRUISM : SELFISHNESS",
    correctKey: 'D',
    options: ['Love : Hate', 'Give : Take', 'Kind : Mean', 'Philanthropy : Misanthropy'],
    explanation: "Altruism (selfless concern for others) is opposite of selfishness. Philanthropy (love of mankind) is opposite of misanthropy (hatred of mankind). Both are formal antonym pairs.",
  },
  {
    statement: "OXYMORON : CONTRADICTION",
    correctKey: 'A',
    options: ['Hyperbole : Exaggeration', 'Metaphor : Poetry', 'Simile : Comparison', 'Irony : Humor'],
    explanation: "An oxymoron is a figure of speech involving contradiction. Hyperbole is a figure of speech involving exaggeration. Both are rhetorical devices defined by their core characteristic.",
  },
  {
    statement: "NOSTALGIA : PAST",
    correctKey: 'C',
    options: ['Fear : Dark', 'Anger : Present', 'Ambition : Future', 'Regret : Mistake'],
    explanation: "Nostalgia is a longing directed at the past. Ambition is a drive directed at the future. Both are emotions oriented toward a specific time.",
  },
  {
    statement: "OLIGARCHY : FEW",
    correctKey: 'B',
    options: ['Monarchy : King', 'Democracy : Many', 'Anarchy : None', 'Theocracy : God'],
    explanation: "An oligarchy is rule by a few. A democracy is rule by many (the people). Both are forms of government defined by who holds power.",
  },
  {
    statement: "SYMBIOSIS : MUTUAL",
    correctKey: 'D',
    options: ['Competition : Win', 'Cooperation : Team', 'Friendship : Love', 'Parasitism : One-sided'],
    explanation: "Symbiosis is a relationship that is mutual (both benefit). Parasitism is a relationship that is one-sided (only one benefits). Both are biological relationships defined by their benefit structure.",
  },
  {
    statement: "EUPHEMISM : OFFENSE",
    correctKey: 'C',
    options: ['Lie : Truth', 'Compliment : Insult', 'Diplomacy : Conflict', 'Silence : Noise'],
    explanation: "A euphemism is used to avoid giving offense. Diplomacy is used to avoid conflict. Both are strategies to soften or prevent negative outcomes.",
  },
  {
    statement: "INERTIA : MOTION",
    correctKey: 'A',
    options: ['Apathy : Action', 'Gravity : Weight', 'Force : Speed', 'Friction : Heat'],
    explanation: "Inertia resists motion (tendency to stay still). Apathy resists action (lack of motivation to act). Both represent resistance to change or activity.",
  },
];

async function main() {
  console.log('Seeding 23 Advanced Analogies questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Verbal Analogies' } });
  if (!topic) { console.error('Verbal Analogies topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Advanced Analogies' },
  });
  if (!chapter) { console.error('Advanced Analogies chapter not found!'); process.exit(1); }

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
        timeLimit: 90,
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
