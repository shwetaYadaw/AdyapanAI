import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const QUESTIONS = [
  {
    statement: "Arrange the sentences in correct order:\nP. The children were playing in the garden.\nQ. Suddenly, it started raining heavily.\nR. They all rushed inside the house.\nS. Their mother had warned them about the weather.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'SPQR', isCorrect: true },
      { optionKey: 'C', text: 'QPSR', isCorrect: false },
      { optionKey: 'D', text: 'PRSQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "The logical order is: Mother warned (S) → Children played anyway (P) → Rain started (Q) → They rushed inside (R). So SPQR is correct.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He put on his shoes.\nQ. He got up early in the morning.\nR. He went out for a walk.\nS. He brushed his teeth and took a bath.",
    options: [
      { optionKey: 'A', text: 'QSPR', isCorrect: true },
      { optionKey: 'B', text: 'QPSR', isCorrect: false },
      { optionKey: 'C', text: 'PQRS', isCorrect: false },
      { optionKey: 'D', text: 'SRQP', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Morning routine: Got up (Q) → Brushed & bathed (S) → Put on shoes (P) → Went for walk (R). So QSPR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The doctor examined the patient carefully.\nQ. He prescribed some medicines.\nR. The patient went to the hospital.\nS. The patient felt better after two days.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'QPRS', isCorrect: false },
      { optionKey: 'C', text: 'RPQS', isCorrect: true },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Logical sequence: Patient went to hospital (R) → Doctor examined (P) → Prescribed medicines (Q) → Patient felt better (S). So RPQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He saw a beautiful flower.\nQ. He was walking in the garden.\nR. He decided to pluck it.\nS. But then he thought it would wilt.",
    options: [
      { optionKey: 'A', text: 'QPRS', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'QRPS', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Walking (Q) → Saw flower (P) → Decided to pluck (R) → Thought it would wilt (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The train arrived at the station.\nQ. The passengers rushed to board it.\nR. It was already 15 minutes late.\nS. Finally, the train departed.",
    options: [
      { optionKey: 'A', text: 'PRQS', isCorrect: true },
      { optionKey: 'B', text: 'QPRS', isCorrect: false },
      { optionKey: 'C', text: 'RPQS', isCorrect: false },
      { optionKey: 'D', text: 'SQPR', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Train arrived (P) → Was late (R) → Passengers rushed (Q) → Train departed (S). So PRQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. She studied hard for the exam.\nQ. She got the highest marks in class.\nR. She wanted to become a doctor.\nS. Her parents were very proud of her.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'RPQS', isCorrect: true },
      { optionKey: 'C', text: 'QPSR', isCorrect: false },
      { optionKey: 'D', text: 'SRQP', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Wanted to be doctor (R) → Studied hard (P) → Got highest marks (Q) → Parents proud (S). So RPQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The match was about to start.\nQ. The stadium was packed with spectators.\nR. Both teams walked onto the field.\nS. The captain won the toss.",
    options: [
      { optionKey: 'A', text: 'QPRS', isCorrect: true },
      { optionKey: 'B', text: 'PRQS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'PQSR', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Stadium packed (Q) → Match about to start (P) → Teams walked in (R) → Captain won toss (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. I missed the bus.\nQ. I woke up late.\nR. My alarm did not ring.\nS. I had to take a taxi to work.",
    options: [
      { optionKey: 'A', text: 'QPRS', isCorrect: false },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RQPS', isCorrect: true },
      { optionKey: 'D', text: 'SQRP', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Alarm didn't ring (R) → Woke up late (Q) → Missed bus (P) → Took taxi (S). So RQPS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The letter was delivered to the wrong address.\nQ. The postman realized his mistake.\nR. He went back to collect it.\nS. Finally, it reached the right person.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: true },
      { optionKey: 'B', text: 'QPRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Wrong delivery (P) → Realized mistake (Q) → Went back (R) → Reached right person (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. They decided to go on a picnic.\nQ. The weather was pleasant.\nR. They packed food and drinks.\nS. Everyone enjoyed the day.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'QPRS', isCorrect: true },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'PRQS', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Weather pleasant (Q) → Decided picnic (P) → Packed food (R) → Enjoyed (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He applied for the job.\nQ. He saw an advertisement in the newspaper.\nR. He was called for an interview.\nS. He got selected.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'QRPS', isCorrect: false },
      { optionKey: 'C', text: 'QPRS', isCorrect: true },
      { optionKey: 'D', text: 'RPQS', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Saw ad (Q) → Applied (P) → Interview (R) → Selected (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The thief broke into the house.\nQ. The police arrived and arrested him.\nR. The neighbors heard the noise.\nS. They immediately called the police.",
    options: [
      { optionKey: 'A', text: 'PRSQ', isCorrect: true },
      { optionKey: 'B', text: 'QPRS', isCorrect: false },
      { optionKey: 'C', text: 'RPQS', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Thief broke in (P) → Neighbors heard (R) → Called police (S) → Police arrested (Q). So PRSQ.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. She opened the gift box.\nQ. It was her birthday.\nR. She was delighted to see a watch inside.\nS. Her friends surprised her with a gift.",
    options: [
      { optionKey: 'A', text: 'QSPR', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'SPRQ', isCorrect: false },
      { optionKey: 'D', text: 'RSPQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Birthday (Q) → Friends gave gift (S) → Opened box (P) → Delighted (R). So QSPR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The farmer planted the seeds.\nQ. He watered them every day.\nR. After a few weeks, small plants appeared.\nS. By the end of the season, he had a good harvest.",
    options: [
      { optionKey: 'A', text: 'QPRS', isCorrect: false },
      { optionKey: 'B', text: 'PRQS', isCorrect: false },
      { optionKey: 'C', text: 'PQRS', isCorrect: true },
      { optionKey: 'D', text: 'RSPQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Planted seeds (P) → Watered (Q) → Plants appeared (R) → Good harvest (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The movie received excellent reviews.\nQ. A new film was released last Friday.\nR. The director was overjoyed.\nS. It earned a huge amount at the box office.",
    options: [
      { optionKey: 'A', text: 'QPSR', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Film released (Q) → Good reviews (P) → Box office earnings (S) → Director overjoyed (R). So QPSR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He saved money for two years.\nQ. He wanted to buy a new car.\nR. He finally bought his dream car.\nS. He compared different models online.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'QPSR', isCorrect: true },
      { optionKey: 'C', text: 'SRQP', isCorrect: false },
      { optionKey: 'D', text: 'RSPQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Wanted car (Q) → Saved money (P) → Compared models (S) → Bought car (R). So QPSR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The cat climbed up the tree.\nQ. A dog was chasing it.\nR. The owner called the fire brigade.\nS. They rescued the cat safely.",
    options: [
      { optionKey: 'A', text: 'QPRS', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Dog chasing (Q) → Cat climbed tree (P) → Owner called fire brigade (R) → Rescued (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The flight was delayed by two hours.\nQ. We reached the airport on time.\nR. We had to wait in the lounge.\nS. Finally, the announcement came for boarding.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'RSPQ', isCorrect: false },
      { optionKey: 'C', text: 'QPRS', isCorrect: true },
      { optionKey: 'D', text: 'SQPR', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Reached airport (Q) → Flight delayed (P) → Waited in lounge (R) → Boarding announcement (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. She slipped and fell down.\nQ. She was running in the corridor.\nR. She was taken to the hospital.\nS. Her leg was fractured.",
    options: [
      { optionKey: 'A', text: 'QPSR', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Running (Q) → Slipped (P) → Fractured leg (S) → Hospital (R). So QPSR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He finished reading the novel.\nQ. He bought a novel from the bookstore.\nR. He started reading it the same evening.\nS. He recommended it to his friends.",
    options: [
      { optionKey: 'A', text: 'QRPS', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Bought novel (Q) → Started reading (R) → Finished (P) → Recommended (S). So QRPS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The power went off suddenly.\nQ. We were watching TV.\nR. We lit candles.\nS. The power came back after an hour.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'QPRS', isCorrect: true },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Watching TV (Q) → Power off (P) → Lit candles (R) → Power back (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The teacher explained the topic.\nQ. The students entered the classroom.\nR. She gave them a test afterwards.\nS. Most students scored well.",
    options: [
      { optionKey: 'A', text: 'QPRS', isCorrect: true },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RSPQ', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Students entered (Q) → Teacher explained (P) → Gave test (R) → Students scored well (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He accepted the job offer.\nQ. He received a call from the company.\nR. He had attended an interview last week.\nS. He joined the company next Monday.",
    options: [
      { optionKey: 'A', text: 'PQRS', isCorrect: false },
      { optionKey: 'B', text: 'RQPS', isCorrect: true },
      { optionKey: 'C', text: 'QPRS', isCorrect: false },
      { optionKey: 'D', text: 'SPRQ', isCorrect: false },
    ],
    difficulty: 'easy',
    explanation: "Attended interview (R) → Received call (Q) → Accepted offer (P) → Joined (S). So RQPS.",
  },
];

async function main() {
  console.log('Seeding 23 Para Jumbles questions (Easy chapter)...\n');

  // Find Para Jumbles topic
  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Para Jumbles' } });
  if (!topic) { console.error('Para Jumbles topic not found!'); process.exit(1); }

  // Find Easy Para Jumbles chapter
  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Easy Para Jumbles' },
  });
  if (!chapter) { console.error('Easy Para Jumbles chapter not found!'); process.exit(1); }

  console.log(`Topic: ${topic.name} (${topic.id})`);
  console.log(`Chapter: ${chapter.name} (${chapter.id})\n`);

  let created = 0, skipped = 0;

  for (const q of QUESTIONS) {
    const existing = await prisma.aptitudeQuestion.findFirst({
      where: { chapterId: chapter.id, statement: { equals: q.statement, mode: 'insensitive' } },
    });
    if (existing) { skipped++; continue; }

    const correctOpt = q.options.find(o => o.isCorrect);
    await prisma.aptitudeQuestion.create({
      data: {
        chapterId: chapter.id,
        statement: q.statement,
        difficulty: q.difficulty,
        correctOption: correctOpt!.optionKey,
        explanation: q.explanation,
        xpReward: 10,
        timeLimit: 60,
        options: {
          create: q.options.map((o, i) => ({
            optionKey: o.optionKey,
            text: o.text,
            isCorrect: o.isCorrect,
            order: i,
          })),
        },
      },
    });
    created++;
    console.log(`  [+] Q${created}: ${q.statement.substring(0, 50)}...`);
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
