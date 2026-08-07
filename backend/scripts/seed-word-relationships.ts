import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 22 Word Relationships questions - Indiabix style, unique
// Answer pattern: B, D, A, C, D, B, A, C, D, A, B, C, A, D, C, B, D, A, C, B, D, A
const QUESTIONS = [
  {
    statement: "FIRE : ASH",
    correctKey: 'B',
    options: ['Food : Hunger', 'Event : Aftermath', 'Water : Ice', 'Tree : Branch'],
    explanation: "Fire produces ash as a residue. Similarly, an event produces aftermath (consequence). The relationship is process : residue/result.",
  },
  {
    statement: "GERM : DISEASE",
    correctKey: 'D',
    options: ['Accident : Injury', 'Doctor : Patient', 'Medicine : Health', 'Spark : Fire'],
    explanation: "A germ causes disease. Similarly, a spark causes fire. The relationship is cause : effect.",
  },
  {
    statement: "KING : THRONE",
    correctKey: 'A',
    options: ['Judge : Bench', 'Soldier : War', 'Teacher : Chalk', 'Student : Exam'],
    explanation: "A king sits on a throne (his seat of authority). Similarly, a judge sits on a bench (seat of authority in court). The relationship is person : their official seat.",
  },
  {
    statement: "LION : PRIDE",
    correctKey: 'C',
    options: ['Hen : Egg', 'Dog : Kennel', 'Wolf : Pack', 'Cat : Whiskers'],
    explanation: "A group of lions is called a pride. Similarly, a group of wolves is called a pack. The relationship is animal : collective noun for its group.",
  },
  {
    statement: "SCISSORS : CLOTH",
    correctKey: 'D',
    options: ['Pen : Paper', 'Hammer : Wall', 'Spoon : Bowl', 'Axe : Wood'],
    explanation: "Scissors are used to cut cloth. Similarly, an axe is used to cut wood. The relationship is cutting tool : material it cuts.",
  },
  {
    statement: "ELATED : DESPONDENT",
    correctKey: 'B',
    options: ['Happy : Joyful', 'Generous : Miserly', 'Angry : Furious', 'Calm : Peaceful'],
    explanation: "Elated (extremely happy) is opposite of despondent (extremely sad). Similarly, generous is opposite of miserly. The relationship is antonyms.",
  },
  {
    statement: "BIOGRAPHY : AUTOBIOGRAPHY",
    correctKey: 'A',
    options: ['Photograph : Selfie', 'Book : Novel', 'Painting : Sketch', 'Letter : Email'],
    explanation: "A biography is written by someone else about a person; an autobiography is written by the person themselves. Similarly, a photograph is taken by someone else; a selfie is taken by oneself.",
  },
  {
    statement: "AUTHOR : PEN",
    correctKey: 'C',
    options: ['Painter : Gallery', 'Singer : Stage', 'Surgeon : Scalpel', 'Farmer : Land'],
    explanation: "An author uses a pen as their primary tool. Similarly, a surgeon uses a scalpel as their primary tool. The relationship is professional : their tool.",
  },
  {
    statement: "HOUSE : BRICK",
    correctKey: 'D',
    options: ['Tree : Garden', 'River : Fish', 'Cloud : Sky', 'Necklace : Bead'],
    explanation: "A house is made up of bricks. Similarly, a necklace is made up of beads. The relationship is whole : its basic unit/component.",
  },
  {
    statement: "COBBLER : LEATHER",
    correctKey: 'A',
    options: ['Blacksmith : Iron', 'Painter : Gallery', 'Chef : Kitchen', 'Driver : Road'],
    explanation: "A cobbler works with leather as raw material. Similarly, a blacksmith works with iron as raw material. The relationship is craftsman : material they work with.",
  },
  {
    statement: "BOLD : TIMID",
    correctKey: 'B',
    options: ['Strong : Powerful', 'Advance : Retreat', 'Fast : Quick', 'Bright : Shiny'],
    explanation: "Bold and timid are antonyms. Similarly, advance and retreat are antonyms. The relationship is opposites.",
  },
  {
    statement: "HORSE : NEIGH",
    correctKey: 'C',
    options: ['Dog : Tail', 'Cat : Fur', 'Donkey : Bray', 'Bird : Wing'],
    explanation: "A horse makes the sound neigh. Similarly, a donkey makes the sound bray. The relationship is animal : its characteristic sound.",
  },
  {
    statement: "FOSSIL : ANTIQUITY",
    correctKey: 'A',
    options: ['Relic : Ancient', 'Modern : New', 'Stone : Rock', 'Museum : Art'],
    explanation: "A fossil represents antiquity (something very old). Similarly, a relic represents something ancient. The relationship is object : its characteristic quality of age.",
  },
  {
    statement: "ARCHIPELAGO : ISLANDS",
    correctKey: 'D',
    options: ['Mountain : Snow', 'River : Water', 'Forest : Animals', 'Constellation : Stars'],
    explanation: "An archipelago is a group/chain of islands. Similarly, a constellation is a group of stars. The relationship is collective formation : its individual units.",
  },
  {
    statement: "EVAPORATION : CLOUD",
    correctKey: 'C',
    options: ['Rain : River', 'Sun : Heat', 'Combustion : Smoke', 'Wind : Air'],
    explanation: "Evaporation leads to the formation of clouds. Similarly, combustion leads to the formation of smoke. The relationship is process : its product.",
  },
  {
    statement: "FAMISHED : EAT",
    correctKey: 'B',
    options: ['Happy : Dance', 'Exhausted : Rest', 'Rich : Spend', 'Angry : Fight'],
    explanation: "When famished (extremely hungry), one needs to eat. Similarly, when exhausted, one needs to rest. The relationship is extreme state : required action.",
  },
  {
    statement: "HIBERNATE : WINTER",
    correctKey: 'D',
    options: ['Sleep : Night', 'Swim : Pool', 'Run : Morning', 'Migrate : Summer'],
    explanation: "Animals hibernate during winter. Similarly, some birds migrate during summer. The relationship is survival behavior : season that triggers it.",
  },
  {
    statement: "LEMON : SOUR",
    correctKey: 'A',
    options: ['Sugar : Sweet', 'Salt : White', 'Water : Wet', 'Pepper : Black'],
    explanation: "Lemon has a sour taste. Similarly, sugar has a sweet taste. The relationship is item : its inherent taste.",
  },
  {
    statement: "BREAD : BAKERY",
    correctKey: 'C',
    options: ['Milk : Cow', 'Fish : River', 'Medicine : Pharmacy', 'Flower : Garden'],
    explanation: "Bread is obtained from a bakery. Similarly, medicine is obtained from a pharmacy. The relationship is product : place where it is sold/made.",
  },
  {
    statement: "IMPRISON : FREEDOM",
    correctKey: 'B',
    options: ['Allow : Entry', 'Starve : Nourishment', 'Punish : Crime', 'Reward : Merit'],
    explanation: "To imprison someone is to deprive them of freedom. Similarly, to starve is to deprive of nourishment. The relationship is action : what it takes away.",
  },
  {
    statement: "CALENDAR : DATES",
    correctKey: 'D',
    options: ['Book : Pages', 'Clock : Time', 'Map : Roads', 'Dictionary : Words'],
    explanation: "A calendar contains dates arranged in order. Similarly, a dictionary contains words arranged in order. The relationship is reference : organized content it contains.",
  },
  {
    statement: "OXYGEN : COMBUSTION",
    correctKey: 'A',
    options: ['Catalyst : Reaction', 'Water : Thirst', 'Food : Hunger', 'Light : Vision'],
    explanation: "Oxygen is necessary for combustion to occur. Similarly, a catalyst is necessary for a chemical reaction to occur (or speed up). The relationship is essential element : process it enables.",
  },
];

async function main() {
  console.log('Seeding 22 Word Relationships questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Verbal Analogies' } });
  if (!topic) { console.error('Verbal Analogies topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Word Relationships' },
  });
  if (!chapter) { console.error('Word Relationships chapter not found!'); process.exit(1); }

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
