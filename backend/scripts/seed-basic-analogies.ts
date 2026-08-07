import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 23 Basic Analogies - Indiabix style, unique questions
// Answer pattern: C, A, D, B, A, D, C, B, D, A, C, B, A, D, B, C, A, D, B, C, D, A, B
const QUESTIONS = [
  {
    statement: "PAINTER : BRUSH",
    correctKey: 'C',
    options: ['Singer : Song', 'Writer : Paper', 'Carpenter : Saw', 'Chef : Recipe'],
    explanation: "A painter uses a brush as a tool. Similarly, a carpenter uses a saw as a tool. The relationship is worker : tool.",
  },
  {
    statement: "MARATHON : RACE",
    correctKey: 'A',
    options: ['Sonnet : Poem', 'Lecture : Class', 'Elephant : Zoo', 'Pencil : Write'],
    explanation: "A marathon is a type of race. Similarly, a sonnet is a type of poem. The relationship is specific : general category.",
  },
  {
    statement: "BIRD : FLOCK",
    correctKey: 'D',
    options: ['Dog : Bark', 'Cat : Kitten', 'Cow : Milk', 'Fish : School'],
    explanation: "A group of birds is called a flock. Similarly, a group of fish is called a school. The relationship is animal : collective noun.",
  },
  {
    statement: "THERMOMETER : TEMPERATURE",
    correctKey: 'B',
    options: ['Clock : Wall', 'Barometer : Pressure', 'Telescope : Stars', 'Compass : Travel'],
    explanation: "A thermometer measures temperature. Similarly, a barometer measures atmospheric pressure. The relationship is instrument : what it measures.",
  },
  {
    statement: "CHAPTER : BOOK",
    correctKey: 'A',
    options: ['Scene : Play', 'Cover : Magazine', 'Author : Novel', 'Library : Reader'],
    explanation: "A chapter is a part of a book. Similarly, a scene is a part of a play. The relationship is part : whole.",
  },
  {
    statement: "CALF : COW",
    correctKey: 'D',
    options: ['Puppy : Bone', 'Egg : Hen', 'Cub : Den', 'Foal : Horse'],
    explanation: "A calf is the young one of a cow. Similarly, a foal is the young one of a horse. The relationship is young one : adult animal.",
  },
  {
    statement: "IRON : RUST",
    correctKey: 'C',
    options: ['Wood : Tree', 'Gold : Mine', 'Copper : Patina', 'Silver : Shine'],
    explanation: "Iron develops rust when exposed to moisture. Similarly, copper develops patina (green layer) when exposed to elements. The relationship is metal : its oxidation product.",
  },
  {
    statement: "GLOVE : HAND",
    correctKey: 'B',
    options: ['Hat : Head', 'Sock : Foot', 'Belt : Waist', 'Ring : Finger'],
    explanation: "A glove is worn on the hand to cover it completely. Similarly, a sock is worn on the foot to cover it. The relationship is covering : body part covered.",
  },
  {
    statement: "OASIS : DESERT",
    correctKey: 'D',
    options: ['Tree : Forest', 'Rain : Cloud', 'Ship : Sea', 'Island : Ocean'],
    explanation: "An oasis is a fertile spot in a desert. Similarly, an island is land in the middle of an ocean. Both represent something contrasting within a larger expanse.",
  },
  {
    statement: "SYMPHONY : COMPOSER",
    correctKey: 'A',
    options: ['Sculpture : Sculptor', 'Music : Piano', 'Gallery : Painting', 'Stage : Actor'],
    explanation: "A symphony is created by a composer. Similarly, a sculpture is created by a sculptor. The relationship is creation : creator.",
  },
  {
    statement: "MERCURY : PLANET",
    correctKey: 'C',
    options: ['Nile : Country', 'Shark : Ocean', 'Hydrogen : Element', 'Diamond : Ring'],
    explanation: "Mercury is a type of planet. Similarly, hydrogen is a type of element. The relationship is specific example : category.",
  },
  {
    statement: "NEEDLE : THREAD",
    correctKey: 'B',
    options: ['Hammer : Wall', 'Pen : Ink', 'Key : Door', 'Comb : Mirror'],
    explanation: "A needle requires thread to function (for sewing). Similarly, a pen requires ink to function (for writing). The relationship is tool : what it needs to work.",
  },
  {
    statement: "LIBRARIAN : LIBRARY",
    correctKey: 'A',
    options: ['Curator : Museum', 'Student : School', 'Patient : Hospital', 'Passenger : Bus'],
    explanation: "A librarian manages a library. Similarly, a curator manages a museum. The relationship is caretaker/manager : place managed.",
  },
  {
    statement: "DROUGHT : FAMINE",
    correctKey: 'D',
    options: ['Rain : Umbrella', 'Flood : Dam', 'Winter : Snow', 'Virus : Epidemic'],
    explanation: "Drought leads to famine (cause and effect). Similarly, a virus leads to an epidemic. The relationship is cause : effect.",
  },
  {
    statement: "TELESCOPE : ASTRONOMER",
    correctKey: 'B',
    options: ['Knife : Butcher', 'Stethoscope : Doctor', 'Brush : Artist', 'Oven : Baker'],
    explanation: "A telescope is the primary tool of an astronomer. Similarly, a stethoscope is the primary tool of a doctor. The relationship is specialized instrument : professional.",
  },
  {
    statement: "WHALE : MAMMAL",
    correctKey: 'C',
    options: ['Shark : Fish', 'Eagle : Sky', 'Snake : Reptile', 'Frog : Water'],
    explanation: "A whale is classified as a mammal. Similarly, a snake is classified as a reptile. The relationship is animal : its biological class.",
  },
  {
    statement: "PETAL : FLOWER",
    correctKey: 'A',
    options: ['Brick : Wall', 'Seed : Fruit', 'Root : Soil', 'Leaf : Autumn'],
    explanation: "A petal is a part of a flower. Similarly, a brick is a part of a wall. The relationship is component : structure it forms.",
  },
  {
    statement: "ENVY : GREEN",
    correctKey: 'D',
    options: ['Happy : Smile', 'Anger : Fight', 'Sad : Tears', 'Danger : Red'],
    explanation: "Envy is symbolically associated with the color green. Similarly, danger is symbolically associated with the color red. The relationship is emotion/concept : its symbolic color.",
  },
  {
    statement: "CAPTAIN : SHIP",
    correctKey: 'B',
    options: ['Teacher : Student', 'Principal : School', 'Soldier : Army', 'Driver : Road'],
    explanation: "A captain is in charge of a ship. Similarly, a principal is in charge of a school. The relationship is leader : institution/vessel they lead.",
  },
  {
    statement: "MANGO : FRUIT",
    correctKey: 'C',
    options: ['Potato : Field', 'Rice : Cereal', 'Rose : Flower', 'Milk : Cow'],
    explanation: "Mango is a type of fruit. Similarly, rose is a type of flower. The relationship is specific item : its category.",
  },
  {
    statement: "DARK : LIGHT",
    correctKey: 'D',
    options: ['Big : Size', 'Hot : Fire', 'Tall : Height', 'Silent : Noisy'],
    explanation: "Dark and light are antonyms (opposites). Similarly, silent and noisy are antonyms. The relationship is word : its opposite.",
  },
  {
    statement: "ACORN : OAK",
    correctKey: 'A',
    options: ['Seed : Tree', 'Egg : Bird', 'Caterpillar : Cocoon', 'Bud : Leaf'],
    explanation: "An acorn grows into an oak tree. Similarly, a seed grows into a tree. The relationship is origin/beginning : what it develops into.",
  },
  {
    statement: "ANKLE : WRIST",
    correctKey: 'B',
    options: ['Hand : Finger', 'Knee : Elbow', 'Foot : Toe', 'Head : Neck'],
    explanation: "Ankle is a joint in the leg, wrist is a joint in the arm. Similarly, knee is a joint in the leg and elbow is a joint in the arm. Both pairs are analogous joints in lower and upper limbs.",
  },
];

async function main() {
  console.log('Seeding 23 Basic Analogies questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Verbal Analogies' } });
  if (!topic) { console.error('Verbal Analogies topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Basic Analogies' },
  });
  if (!chapter) { console.error('Basic Analogies chapter not found!'); process.exit(1); }

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
