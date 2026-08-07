import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 20 Difficult Para Jumbles - complex passages, longer sentences
// Answer pattern: D, B, C, A, D, C, B, A, D, B, A, C, D, A, B, C, D, B, A, C
const QUESTIONS = [
  {
    statement: "Arrange the sentences in correct order:\nP. The essence of democracy lies in the freedom of expression and the right to dissent.\nQ. However, this freedom comes with the responsibility of not spreading hatred.\nR. Many nations have struggled to find the balance between liberty and order.\nS. A truly democratic society encourages debate while maintaining social harmony.",
    correctKey: 'D',
    options: ['PRSQ', 'QPRS', 'RSPQ', 'PQRS'],
    explanation: "Freedom of expression (P) → Comes with responsibility (Q) → Nations struggle for balance (R) → Democratic society encourages debate (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Artificial intelligence is transforming industries at an unprecedented pace.\nQ. From healthcare to finance, AI applications are becoming indispensable.\nR. Yet, ethical concerns about bias and privacy remain largely unaddressed.\nS. Experts argue that regulation must keep pace with technological advancement.",
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "AI transforming industries (P) → Applications in healthcare, finance (Q) → Ethical concerns unaddressed (R) → Regulation must keep pace (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The ancient city of Varanasi has witnessed the rise and fall of many empires.\nQ. Its ghats, temples, and narrow lanes tell stories of centuries past.\nR. Despite modernization, the city retains its spiritual essence.\nS. Millions of pilgrims visit every year, seeking salvation on the banks of the Ganges.",
    correctKey: 'C',
    options: ['QRPS', 'RSPQ', 'PQRS', 'SPRQ'],
    explanation: "Rise and fall of empires (P) → Ghats and temples tell stories (Q) → Retains spiritual essence (R) → Pilgrims seek salvation (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The concept of sustainable development was first introduced in the Brundtland Report of 1987.\nQ. It defined sustainability as meeting present needs without compromising future generations.\nR. Since then, numerous international agreements have tried to implement this vision.\nS. The Paris Agreement of 2015 is considered the most significant of these efforts.",
    correctKey: 'A',
    options: ['PQRS', 'QPRS', 'RSPQ', 'SPRQ'],
    explanation: "Introduced in 1987 (P) → Defined sustainability (Q) → International agreements since then (R) → Paris Agreement most significant (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The human brain contains approximately 86 billion neurons.\nQ. Each neuron can form thousands of connections with other neurons.\nR. This complex network is responsible for everything from thought to movement.\nS. Despite decades of research, much about brain function remains a mystery.",
    correctKey: 'D',
    options: ['QRPS', 'RSPQ', 'SPRQ', 'PQRS'],
    explanation: "86 billion neurons (P) → Each forms thousands of connections (Q) → Complex network responsible for thought (R) → Much remains mystery (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The Industrial Revolution began in Britain in the late 18th century.\nQ. It spread to other parts of Europe and North America within decades.\nR. The revolution fundamentally changed the nature of work and production.\nS. Its effects on society, both positive and negative, continue to be debated.",
    correctKey: 'C',
    options: ['QRPS', 'RSPQ', 'PRQS', 'SPRQ'],
    explanation: "Began in Britain (P) → Changed nature of work (R) → Spread to other parts (Q) → Effects still debated (S). So PRQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Migration has been a defining feature of human history since the earliest times.\nQ. People have moved in search of food, safety, and better opportunities.\nR. In the modern era, migration patterns have become more complex and politicized.\nS. The debate over immigration policy remains one of the most divisive issues globally.",
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Defining feature of history (P) → Moved for food and safety (Q) → Modern patterns complex (R) → Immigration debate divisive (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Classical music has a rich tradition spanning several centuries.\nQ. Composers like Bach, Mozart, and Beethoven laid its foundations.\nR. In India, classical music is divided into Hindustani and Carnatic traditions.\nS. Both Eastern and Western classical forms require years of rigorous training.",
    correctKey: 'A',
    options: ['PQRS', 'QPRS', 'RSPQ', 'SPRQ'],
    explanation: "Rich tradition spanning centuries (P) → Bach, Mozart laid foundations (Q) → Indian classical divided (R) → Both require rigorous training (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The discovery of penicillin by Alexander Fleming in 1928 was largely accidental.\nQ. He noticed that mold on a petri dish was killing bacteria around it.\nR. This observation led to the development of the first antibiotic.\nS. Antibiotics have since saved millions of lives but overuse has created resistant bacteria.",
    correctKey: 'D',
    options: ['QRPS', 'RSPQ', 'SPRQ', 'PQRS'],
    explanation: "Discovery was accidental (P) → Noticed mold killing bacteria (Q) → Led to first antibiotic (R) → Saved millions but created resistance (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The caste system in India has deep historical roots going back thousands of years.\nQ. Originally based on occupation, it became rigid and hereditary over time.\nR. The Indian Constitution abolished untouchability and provided for affirmative action.\nS. Despite legal reforms, caste-based discrimination persists in many parts of the country.",
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Deep historical roots (P) → Based on occupation, became rigid (Q) → Constitution abolished untouchability (R) → Discrimination persists (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Space exploration has captivated human imagination for centuries.\nQ. The first successful moon landing in 1969 was a defining moment for mankind.\nR. Today, private companies like SpaceX are making space travel more accessible.\nS. The next frontier appears to be Mars, with missions planned for the coming decade.",
    correctKey: 'A',
    options: ['PQRS', 'QPRS', 'RSPQ', 'SPRQ'],
    explanation: "Captivated imagination (P) → Moon landing 1969 (Q) → Private companies today (R) → Mars is next frontier (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The monsoon season is crucial for Indian agriculture as most farming depends on rainfall.\nQ. Delayed or deficient monsoons can lead to droughts and crop failures.\nR. In recent years, climate change has made monsoon patterns increasingly unpredictable.\nS. Scientists are working on better forecasting models to help farmers prepare.",
    correctKey: 'C',
    options: ['QRPS', 'RSPQ', 'PQRS', 'SPRQ'],
    explanation: "Crucial for agriculture (P) → Delayed monsoons cause droughts (Q) → Climate change made unpredictable (R) → Scientists working on models (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The Renaissance was a period of extraordinary cultural and intellectual achievement.\nQ. It began in Italy in the 14th century and spread across Europe.\nR. Artists like Leonardo da Vinci and Michelangelo produced masterpieces during this era.\nS. The movement also laid the groundwork for modern science and philosophy.",
    correctKey: 'D',
    options: ['PRQS', 'RSPQ', 'SPRQ', 'PQRS'],
    explanation: "Extraordinary achievement (P) → Began in Italy (Q) → Artists produced masterpieces (R) → Laid groundwork for science (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Mahatma Gandhi's philosophy of nonviolence inspired civil rights movements worldwide.\nQ. His methods of peaceful protest proved that change was possible without bloodshed.\nR. Martin Luther King Jr. and Nelson Mandela both acknowledged Gandhi's influence.\nS. Today, Gandhi's principles remain relevant in addressing social injustice.",
    correctKey: 'A',
    options: ['PQRS', 'QPRS', 'RSPQ', 'SPRQ'],
    explanation: "Gandhi's philosophy inspired (P) → Peaceful protest proved change possible (Q) → MLK and Mandela acknowledged (R) → Principles remain relevant (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The rise of e-commerce has fundamentally altered consumer behavior.\nQ. People now prefer the convenience of shopping from their homes.\nR. Traditional brick-and-mortar stores have been forced to adapt or shut down.\nS. The COVID-19 pandemic accelerated this shift by several years.",
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Rise of e-commerce altered behavior (P) → People prefer home shopping (Q) → Traditional stores adapt (R) → Pandemic accelerated shift (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The theory of evolution by natural selection was proposed by Charles Darwin.\nQ. He gathered evidence during his famous voyage on HMS Beagle.\nR. His book 'On the Origin of Species' published in 1859 caused a scientific revolution.\nS. The theory remains the foundation of modern biology despite initial controversy.",
    correctKey: 'C',
    options: ['QRPS', 'RSPQ', 'PQRS', 'SPRQ'],
    explanation: "Proposed by Darwin (P) → Evidence from Beagle voyage (Q) → Book caused revolution (R) → Remains foundation of biology (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Cryptocurrency emerged as an alternative to traditional banking systems.\nQ. Bitcoin, the first cryptocurrency, was created in 2009 by an anonymous person.\nR. Since then, thousands of cryptocurrencies have entered the market.\nS. Governments worldwide are still grappling with how to regulate this new asset class.",
    correctKey: 'D',
    options: ['QRPS', 'RSPQ', 'SPRQ', 'PQRS'],
    explanation: "Alternative to banking (P) → Bitcoin created 2009 (Q) → Thousands entered market (R) → Governments grappling with regulation (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The Great Wall of China stretches over 13,000 miles across northern China.\nQ. Construction began over 2,000 years ago during the Qin Dynasty.\nR. Multiple dynasties contributed to building and maintaining different sections.\nS. Today, it stands as one of the most iconic structures ever built by humans.",
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Stretches 13,000 miles (P) → Construction began Qin Dynasty (Q) → Multiple dynasties contributed (R) → Iconic structure today (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Mental health awareness has grown significantly in recent years.\nQ. Earlier, mental illness was stigmatized and rarely discussed openly.\nR. Campaigns by celebrities and organizations have helped normalize the conversation.\nS. However, access to affordable mental healthcare remains a challenge in many countries.",
    correctKey: 'A',
    options: ['QPRS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Earlier stigmatized (Q) → Awareness grown recently (P) → Campaigns normalized conversation (R) → Access remains a challenge (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The Suez Canal connects the Mediterranean Sea to the Red Sea.\nQ. It was completed in 1869 after ten years of construction.\nR. The canal reduced the sea voyage between Europe and Asia by thousands of miles.\nS. Even today, about 12% of global trade passes through this vital waterway.",
    correctKey: 'C',
    options: ['QRPS', 'RSPQ', 'PQRS', 'SPRQ'],
    explanation: "Connects Mediterranean to Red Sea (P) → Completed in 1869 (Q) → Reduced voyage by thousands of miles (R) → 12% of global trade passes through (S). So PQRS.",
  },
];

async function main() {
  console.log('Seeding 20 Difficult Para Jumbles questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Para Jumbles' } });
  if (!topic) { console.error('Para Jumbles topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Difficult Para Jumbles' },
  });
  if (!chapter) { console.error('Difficult Para Jumbles chapter not found!'); process.exit(1); }

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
        timeLimit: 120,
        options: { create: options },
      },
    });
    created++;
    console.log(`  [+] Q${created}: ${q.statement.substring(0, 55)}...`);
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
