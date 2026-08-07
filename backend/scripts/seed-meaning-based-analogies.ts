import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// 25 Meaning-Based Analogies - focus on semantic/meaning relationships
// Answer pattern: D, A, C, B, A, D, B, C, A, D, C, B, D, A, B, C, D, B, A, C, D, A, B, C, D
const QUESTIONS = [
  {
    statement: "VERBOSE : CONCISE",
    correctKey: 'D',
    options: ['Talkative : Chatty', 'Loud : Noisy', 'Brief : Short', 'Extravagant : Frugal'],
    explanation: "Verbose (using too many words) is opposite of concise (brief). Similarly, extravagant (spending too much) is opposite of frugal (thrifty). Both are antonym pairs.",
  },
  {
    statement: "NOVICE : EXPERT",
    correctKey: 'A',
    options: ['Amateur : Professional', 'Student : College', 'Young : Energetic', 'Learner : Book'],
    explanation: "A novice is someone with no experience, opposite of an expert. Similarly, an amateur is opposite of a professional. The relationship is beginner : master.",
  },
  {
    statement: "COURAGEOUS : HEROIC",
    correctKey: 'C',
    options: ['Sad : Happy', 'Dark : Black', 'Angry : Furious', 'Cold : Winter'],
    explanation: "Heroic is a stronger degree of courageous. Similarly, furious is a stronger degree of angry. The relationship is mild intensity : extreme intensity.",
  },
  {
    statement: "WHISPER : SHOUT",
    correctKey: 'B',
    options: ['Walk : Path', 'Drizzle : Downpour', 'Speak : Talk', 'Listen : Hear'],
    explanation: "Whisper is soft speech, shout is loud speech (opposites in intensity). Similarly, drizzle is light rain, downpour is heavy rain. The relationship is mild form : intense form.",
  },
  {
    statement: "BENEVOLENT : KIND",
    correctKey: 'A',
    options: ['Malevolent : Cruel', 'Generous : Rich', 'Helpful : Useful', 'Gentle : Soft'],
    explanation: "Benevolent means kind/charitable. Similarly, malevolent means cruel/wishing harm. Both pairs share the same meaning relationship (synonym pairs with formal/informal).",
  },
  {
    statement: "TRANSPARENT : OPAQUE",
    correctKey: 'D',
    options: ['Clear : Clean', 'Glass : Mirror', 'Light : Heavy', 'Visible : Hidden'],
    explanation: "Transparent (can see through) is opposite of opaque (cannot see through). Similarly, visible (can be seen) is opposite of hidden (cannot be seen). Antonym pair about perception.",
  },
  {
    statement: "GENUINE : COUNTERFEIT",
    correctKey: 'B',
    options: ['Real : Actual', 'Authentic : Fake', 'True : Honest', 'Original : First'],
    explanation: "Genuine and counterfeit are antonyms (real vs fake). Similarly, authentic and fake are antonyms. The relationship is real : imitation.",
  },
  {
    statement: "ACCELERATE : SPEED",
    correctKey: 'C',
    options: ['Reduce : Size', 'Walk : Distance', 'Amplify : Sound', 'Drive : Car'],
    explanation: "To accelerate is to increase speed. Similarly, to amplify is to increase sound. The relationship is verb meaning to increase : what is increased.",
  },
  {
    statement: "EPHEMERAL : PERMANENT",
    correctKey: 'A',
    options: ['Temporary : Eternal', 'Quick : Slow', 'Small : Big', 'Weak : Strong'],
    explanation: "Ephemeral (short-lived) is opposite of permanent (lasting forever). Similarly, temporary is opposite of eternal. Both are antonym pairs about duration.",
  },
  {
    statement: "AFFLUENT : WEALTHY",
    correctKey: 'D',
    options: ['Poor : Sad', 'Happy : Excited', 'Rich : Gold', 'Indigent : Destitute'],
    explanation: "Affluent and wealthy are synonyms (both mean rich). Similarly, indigent and destitute are synonyms (both mean extremely poor). The relationship is synonym pairs.",
  },
  {
    statement: "METICULOUS : CARELESS",
    correctKey: 'C',
    options: ['Quick : Fast', 'Careful : Cautious', 'Diligent : Negligent', 'Smart : Clever'],
    explanation: "Meticulous (very careful) is opposite of careless. Similarly, diligent (hardworking) is opposite of negligent (failing in duty). Antonym pairs.",
  },
  {
    statement: "ARID : HUMID",
    correctKey: 'B',
    options: ['Hot : Cold', 'Barren : Fertile', 'Dry : Wet', 'Sandy : Rocky'],
    explanation: "Arid (very dry) is opposite of humid (moist). Similarly, barren (infertile) is opposite of fertile (productive). Both pairs describe contrasting environmental conditions.",
  },
  {
    statement: "MITIGATE : AGGRAVATE",
    correctKey: 'D',
    options: ['Help : Assist', 'Solve : Fix', 'Reduce : Minimize', 'Soothe : Irritate'],
    explanation: "Mitigate (to make less severe) is opposite of aggravate (to make worse). Similarly, soothe (to calm) is opposite of irritate (to annoy). Antonym pairs about intensity.",
  },
  {
    statement: "PRUDENT : WISE",
    correctKey: 'A',
    options: ['Reckless : Foolish', 'Careful : Slow', 'Smart : Intelligent', 'Quick : Fast'],
    explanation: "Prudent and wise are synonyms (both mean showing good judgment). Similarly, reckless and foolish are synonyms (both mean lacking good judgment). Synonym pairs.",
  },
  {
    statement: "CACOPHONY : HARMONY",
    correctKey: 'B',
    options: ['Music : Song', 'Chaos : Order', 'Sound : Noise', 'Rhythm : Beat'],
    explanation: "Cacophony (harsh noise) is opposite of harmony (pleasant arrangement). Similarly, chaos (disorder) is opposite of order (arrangement). Antonym pairs.",
  },
  {
    statement: "LETHARGIC : ENERGETIC",
    correctKey: 'C',
    options: ['Tired : Sleepy', 'Lazy : Idle', 'Dormant : Active', 'Slow : Steady'],
    explanation: "Lethargic (sluggish, lacking energy) is opposite of energetic. Similarly, dormant (inactive) is opposite of active. Antonym pairs about activity level.",
  },
  {
    statement: "ABUNDANT : SCARCE",
    correctKey: 'D',
    options: ['Many : Few', 'Large : Big', 'Heavy : Light', 'Surplus : Deficit'],
    explanation: "Abundant (more than enough) is opposite of scarce (not enough). Similarly, surplus (excess) is opposite of deficit (shortage). Antonym pairs about quantity.",
  },
  {
    statement: "CREDULOUS : GULLIBLE",
    correctKey: 'B',
    options: ['Smart : Clever', 'Skeptical : Doubtful', 'Honest : True', 'Naive : Young'],
    explanation: "Credulous and gullible are synonyms (both mean easily believing). Similarly, skeptical and doubtful are synonyms (both mean questioning/disbelieving). Synonym pairs.",
  },
  {
    statement: "SOMNOLENT : AWAKE",
    correctKey: 'A',
    options: ['Famished : Satiated', 'Tired : Exhausted', 'Dark : Dim', 'Cold : Cool'],
    explanation: "Somnolent (sleepy) is opposite of awake. Similarly, famished (extremely hungry) is opposite of satiated (full). Antonym pairs about physical states.",
  },
  {
    statement: "GARRULOUS : TALKATIVE",
    correctKey: 'C',
    options: ['Quiet : Silent', 'Loud : Noisy', 'Reticent : Reserved', 'Quick : Swift'],
    explanation: "Garrulous and talkative are synonyms (both mean talking a lot). Similarly, reticent and reserved are synonyms (both mean reluctant to speak). Synonym pairs.",
  },
  {
    statement: "ZENITH : NADIR",
    correctKey: 'D',
    options: ['Top : High', 'Sky : Ground', 'Mountain : Valley', 'Apex : Base'],
    explanation: "Zenith (highest point) is opposite of nadir (lowest point). Similarly, apex (top) is opposite of base (bottom). Antonym pairs about position.",
  },
  {
    statement: "ENIGMATIC : MYSTERIOUS",
    correctKey: 'A',
    options: ['Lucid : Clear', 'Dark : Night', 'Hidden : Secret', 'Strange : Weird'],
    explanation: "Enigmatic and mysterious are synonyms (both mean hard to understand). Similarly, lucid and clear are synonyms (both mean easy to understand). Synonym pairs - opposites in meaning to each other.",
  },
  {
    statement: "PLACATE : PROVOKE",
    correctKey: 'B',
    options: ['Help : Aid', 'Console : Distress', 'Fight : Battle', 'Calm : Peace'],
    explanation: "Placate (to calm someone) is opposite of provoke (to anger someone). Similarly, console (to comfort) is opposite of distress (to cause suffering). Antonym pairs.",
  },
  {
    statement: "OMNISCIENT : IGNORANT",
    correctKey: 'C',
    options: ['Wise : Smart', 'All : None', 'Omnipotent : Powerless', 'God : Human'],
    explanation: "Omniscient (all-knowing) is opposite of ignorant (lacking knowledge). Similarly, omnipotent (all-powerful) is opposite of powerless. Antonym pairs with 'omni-' prefix.",
  },
  {
    statement: "VOLATILE : STABLE",
    correctKey: 'D',
    options: ['Hot : Cold', 'Fast : Slow', 'Loud : Quiet', 'Erratic : Consistent'],
    explanation: "Volatile (likely to change unpredictably) is opposite of stable. Similarly, erratic (unpredictable) is opposite of consistent (steady). Antonym pairs about predictability.",
  },
];

async function main() {
  console.log('Seeding 25 Meaning-Based Analogies questions...\n');

  const topic = await prisma.aptitudeTopic.findFirst({ where: { name: 'Verbal Analogies' } });
  if (!topic) { console.error('Verbal Analogies topic not found!'); process.exit(1); }

  const chapter = await prisma.aptitudeChapter.findFirst({
    where: { topicId: topic.id, name: 'Meaning-Based Analogies' },
  });
  if (!chapter) { console.error('Meaning-Based Analogies chapter not found!'); process.exit(1); }

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
