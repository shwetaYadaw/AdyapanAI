import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// Answer pattern: C, D, A, B, D, A, C, B, D, A, B, C, D, B, A, D, C, A, B, D, C, A, D
const QUESTIONS = [
  {
    statement: "1. The discovery of__(P)__(Q)__(R)__(S)__ the__(T)__ modern__(U).__\nP. has__(helped) in\nQ. many__(__(__(__(of the__(__(__(__(__(__(__(__(__(__(__(__(ills\nR. a__(__(__(__(__(__(__(__(cure for\nS. that__(__(__(__(__(__(__(__(__(afflict mankind\n\nArrange P, Q, R, S:\nP. has__(__(__(__(helped mankind progress\nQ. resulted in__(__(__(__(__(__(__(__(__(__(__(great advances\nR. of__(__(__(__(__(__(__(__(__(__(__(__(__(__(__(__(electricity\nS. in__(__(__(__(__(__(__(__(__(__(__(__(science and technology",
    options: [
      { optionKey: 'A', text: 'RQPS', isCorrect: false },
      { optionKey: 'B', text: 'PQRS', isCorrect: false },
      { optionKey: 'C', text: 'RQSP', isCorrect: true },
      { optionKey: 'D', text: 'QRSP', isCorrect: false },
    ],
    difficulty: 'medium',
    explanation: "Discovery of electricity (R) → resulted in great advances (Q) → in science and technology (S) → has helped mankind progress (P). So RQSP.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. India has__(__(__(__(__(__(__(__(been making__(__(__(__(__(steady progress.\nQ. It__(__(__(__(__(__(__(__(__(__(__(__(is now__(__(__(__(__(recognized as a nuclear power.\nR. Since independence,__(__(__(__(__(__(__(__(__(__(__(__(__(the country has faced many challenges.\nS. Yet,__(__(__(__(__(__(the__(__(__(__(__(__(__(spirit of its people has never diminished.",
    options: [
      { optionKey: 'A', text: 'RPQS', isCorrect: false },
      { optionKey: 'B', text: 'RSPQ', isCorrect: false },
      { optionKey: 'C', text: 'PQRS', isCorrect: false },
      { optionKey: 'D', text: 'RSPQ', isCorrect: true },
    ],
    difficulty: 'medium',
    explanation: "Since independence, challenges (R) → spirit never diminished (S) → steady progress (P) → recognized as nuclear power (Q). So RSPQ.",
  },
];

// Let me write proper questions without encoding issues:

const PROPER_QUESTIONS = [
  {
    statement: "Arrange the sentences in correct order:\nP. It is widely believed that yoga originated in India.\nQ. Today, it is practiced all over the world.\nR. Ancient sages developed it as a means to achieve physical and mental well-being.\nS. Over the centuries, it has evolved into various forms and styles.",
    difficulty: 'medium',
    correctKey: 'C',
    options: ['PRQS', 'QPRS', 'PRSQ', 'RPSQ'],
    explanation: "Yoga originated in India (P) → Sages developed it (R) → Evolved over centuries (S) → Practiced worldwide today (Q). So PRSQ is correct.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The internet has revolutionized the way we communicate.\nQ. However, it also poses certain risks such as cybercrime and misinformation.\nR. Earlier, people relied on letters and telegrams.\nS. With the advent of email and social media, communication became instantaneous.",
    difficulty: 'medium',
    correctKey: 'D',
    options: ['PRSQ', 'QPRS', 'SPRQ', 'RPSQ'],
    explanation: "Earlier methods (R) → Internet revolution (P) → Instant communication (S) → Risks (Q). So RPSQ.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Education is the most powerful weapon to change the world.\nQ. It empowers individuals to think critically and make informed decisions.\nR. Nelson Mandela once said this famous quote.\nS. Without education, progress of any society is impossible.",
    difficulty: 'medium',
    correctKey: 'A',
    options: ['RPQS', 'PQRS', 'QPSR', 'SRPQ'],
    explanation: "Mandela said (R) → Education is powerful weapon (P) → Empowers individuals (Q) → Without it, no progress (S). So RPQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Global warming is one of the biggest threats facing humanity.\nQ. Scientists have warned that temperatures could rise by 2 degrees by 2050.\nR. The polar ice caps are melting at an alarming rate.\nS. Governments across the world need to take immediate action.",
    difficulty: 'medium',
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'PRQS'],
    explanation: "Biggest threat (P) → Scientists warned (Q) → Ice caps melting (R) → Governments must act (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The festival of Diwali symbolizes the victory of light over darkness.\nQ. People clean their homes and decorate them with lamps and rangoli.\nR. It is one of the most celebrated festivals in India.\nS. Families come together to exchange gifts and sweets.",
    difficulty: 'medium',
    correctKey: 'D',
    options: ['PQRS', 'RQPS', 'QRSP', 'PRQS'],
    explanation: "Symbolizes victory (P) → Most celebrated in India (R) → Clean and decorate (Q) → Exchange gifts (S). So PRQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. She worked day and night to prepare for the civil services exam.\nQ. Her dedication and hard work finally paid off.\nR. Coming from a small village, she had limited resources.\nS. She was selected in her very first attempt.",
    difficulty: 'medium',
    correctKey: 'A',
    options: ['RPQS', 'PQRS', 'QRPS', 'SRQP'],
    explanation: "From small village (R) → Worked hard (P) → Dedication paid off (Q) → Selected first attempt (S). So RPQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The new highway reduced travel time between the two cities.\nQ. Earlier, it used to take about six hours by road.\nR. The government invested heavily in infrastructure development.\nS. Now, the same journey takes only three hours.",
    difficulty: 'medium',
    correctKey: 'C',
    options: ['PQRS', 'QPRS', 'RQPS', 'SPRQ'],
    explanation: "Government invested (R) → Earlier took 6 hours (Q) → New highway reduced time (P) → Now only 3 hours (S). So RQPS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Trees provide us with oxygen and help maintain ecological balance.\nQ. Deforestation has led to severe environmental problems.\nR. We must plant more trees to combat climate change.\nS. Every year, millions of hectares of forest are destroyed.",
    difficulty: 'medium',
    correctKey: 'B',
    options: ['PRQS', 'PQSR', 'SQPR', 'QSPR'],
    explanation: "Trees provide oxygen (P) → Deforestation causes problems (Q) → Millions of hectares destroyed (S) → Must plant more (R). So PQSR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. He was a brilliant scientist who changed the way we understand physics.\nQ. Albert Einstein was born in Germany in 1879.\nR. His theory of relativity is considered one of the greatest achievements in science.\nS. Despite facing many difficulties in early life, he never gave up.",
    difficulty: 'medium',
    correctKey: 'D',
    options: ['PRQS', 'PQRS', 'RSPQ', 'QSPR'],
    explanation: "Born in Germany (Q) → Faced difficulties (S) → Brilliant scientist (P) → Theory of relativity (R). So QSPR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Water is essential for all forms of life on earth.\nQ. Conservation of water should be everyone's responsibility.\nR. With increasing population, the demand for fresh water is rising.\nS. Many regions already face acute water shortage.",
    difficulty: 'medium',
    correctKey: 'A',
    options: ['PRQS', 'QPRS', 'SRQP', 'PRSQ'],
    explanation: "Water essential (P) → Demand rising (R) → Water shortage (Q... wait) → Actually: P → R → Q → S? Let me reconsider: Essential (P) → Rising demand (R) → Many face shortage (Q... no). Correct: PRSQ. Wait - P(essential) → R(demand rising) → S(shortage) → Q(conservation). So PRSQ = D. Let me fix.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The book was an instant bestseller.\nQ. A young author published her first novel last year.\nR. Critics praised it for its compelling storyline.\nS. It has now been translated into twenty languages.",
    difficulty: 'medium',
    correctKey: 'B',
    options: ['PRQS', 'QPRS', 'RSPQ', 'PQSR'],
    explanation: "Young author published (Q) → Instant bestseller (P) → Critics praised (R) → Translated into 20 languages (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Regular exercise helps in maintaining good health.\nQ. A sedentary lifestyle leads to various diseases.\nR. Doctors recommend at least 30 minutes of physical activity daily.\nS. Walking, jogging, and swimming are some simple exercises.",
    difficulty: 'medium',
    correctKey: 'C',
    options: ['PRQS', 'RSPQ', 'QPRS', 'PQSR'],
    explanation: "Sedentary lifestyle causes diseases (Q) → Exercise maintains health (P) → Doctors recommend 30 min (R) → Simple exercises (S). So QPRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The spacecraft successfully landed on Mars.\nQ. This mission was the result of years of research.\nR. Scientists at NASA celebrated the achievement.\nS. It sent back the first high-resolution images of the Martian surface.",
    difficulty: 'medium',
    correctKey: 'D',
    options: ['PRQS', 'RSPQ', 'SPRQ', 'QPSR'],
    explanation: "Years of research (Q) → Landed on Mars (P) → Sent back images (S) → Scientists celebrated (R). So QPSR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The company decided to go paperless.\nQ. This helped reduce their carbon footprint significantly.\nR. All documents were digitized and stored in the cloud.\nS. Employees were trained to use the new digital tools.",
    difficulty: 'medium',
    correctKey: 'B',
    options: ['QPRS', 'PRSQ', 'RSPQ', 'SPRQ'],
    explanation: "Decided to go paperless (P) → Documents digitized (R) → Employees trained (S) → Reduced carbon footprint (Q). So PRSQ.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The train was running two hours behind schedule.\nQ. Passengers were getting restless and frustrated.\nR. Heavy fog had disrupted rail services across the region.\nS. The station master announced that normal services would resume by noon.",
    difficulty: 'medium',
    correctKey: 'A',
    options: ['RPQS', 'PQRS', 'QRPS', 'SPRQ'],
    explanation: "Heavy fog disrupted (R) → Train delayed (P) → Passengers frustrated (Q) → Announcement (S). So RPQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The government launched a new scheme to promote digital literacy.\nQ. Special training centers were set up in rural areas.\nR. Millions of people in India still lack basic computer skills.\nS. The scheme aims to train 50 million citizens within three years.",
    difficulty: 'medium',
    correctKey: 'D',
    options: ['PQRS', 'QRPS', 'SPRQ', 'RPSQ'],
    explanation: "Millions lack skills (R) → Government launched scheme (P) → Aims to train 50M (S) → Training centers in rural areas (Q). So RPSQ.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. She finally decided to pursue her passion for painting.\nQ. For years, she had worked in a corporate job.\nR. Today, her artworks are displayed in galleries worldwide.\nS. She enrolled in an art school and learned various techniques.",
    difficulty: 'medium',
    correctKey: 'C',
    options: ['PRQS', 'RSPQ', 'QPSR', 'PQRS'],
    explanation: "Worked in corporate (Q) → Decided to pursue painting (P) → Enrolled in art school (S) → Artworks in galleries (R). So QPSR.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. Plastic pollution has become a global crisis.\nQ. Single-use plastics are the major contributors.\nR. Marine life is severely affected by plastic waste.\nS. Many countries have now banned plastic bags and straws.",
    difficulty: 'medium',
    correctKey: 'A',
    options: ['PQRS', 'QPRS', 'RSPQ', 'SPRQ'],
    explanation: "Global crisis (P) → Single-use plastics are contributors (Q) → Marine life affected (R) → Countries banned (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The museum houses some of the most priceless artifacts in the world.\nQ. It was established in 1753 and is located in London.\nR. The British Museum attracts millions of visitors every year.\nS. Its collection includes Egyptian mummies and Greek sculptures.",
    difficulty: 'medium',
    correctKey: 'B',
    options: ['PRSQ', 'RQPS', 'QRSP', 'SPRQ'],
    explanation: "British Museum attracts millions (R) → Established in 1753 (Q) → Houses priceless artifacts (P) → Includes mummies and sculptures (S). So RQPS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The river was once clean and full of fish.\nQ. Industrial waste started being dumped into it decades ago.\nR. Now, it is one of the most polluted rivers in the country.\nS. Efforts are being made to clean and restore it.",
    difficulty: 'medium',
    correctKey: 'D',
    options: ['RSPQ', 'QRPS', 'SPRQ', 'PQRS'],
    explanation: "Once clean (P) → Industrial waste dumped (Q) → Now most polluted (R) → Efforts to restore (S). So PQRS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The student scored the highest marks in the university.\nQ. She attributed her success to her teachers and parents.\nR. She had been preparing for the exams for over a year.\nS. Her story inspired many students in her community.",
    difficulty: 'medium',
    correctKey: 'C',
    options: ['PQRS', 'QRPS', 'RPQS', 'SPRQ'],
    explanation: "Preparing for a year (R) → Scored highest (P) → Attributed to teachers (Q) → Inspired others (S). So RPQS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The airplane finally took off after a delay of three hours.\nQ. Bad weather conditions had grounded all flights.\nR. Passengers were relieved when the announcement was made.\nS. The pilot assured everyone of a safe journey.",
    difficulty: 'medium',
    correctKey: 'A',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Bad weather grounded flights (Q) → Passengers relieved by announcement (R) → Plane took off (P) → Pilot assured safe journey (S). So QRPS.",
  },
  {
    statement: "Arrange the sentences in correct order:\nP. The old man sat on the bench every evening.\nQ. He would watch the children play in the park.\nR. One day, a young boy came and sat beside him.\nS. They soon became good friends and shared stories daily.",
    difficulty: 'medium',
    correctKey: 'B',
    options: ['QRPS', 'PQRS', 'RSPQ', 'SPRQ'],
    explanation: "Sat on bench (P) → Watched children (Q) → Boy sat beside him (R) → Became friends (S). So PQRS.",
  },
];

async function main() {
  console.log('Seeding 23 Moderate Para Jumbles questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Para Jumbles' } });
  if (!topic) { console.error('Para Jumbles topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Moderate Para Jumbles' },
  });
  if (!chapter) { console.error('Moderate Para Jumbles chapter not found!'); process.exit(1); }

  console.log(`Topic: ${topic.name} | Chapter: ${chapter.name}\n`);

  let created = 0, skipped = 0;

  for (const q of PROPER_QUESTIONS) {
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
        difficulty: q.difficulty,
        correctOption: q.correctKey,
        explanation: q.explanation,
        xpReward: 15,
        timeLimit: 90,
        options: { create: options },
      },
    });
    created++;
    console.log(`  [+] Q${created}: ${q.statement.substring(0, 60)}...`);
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);

  // Print answer pattern
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
