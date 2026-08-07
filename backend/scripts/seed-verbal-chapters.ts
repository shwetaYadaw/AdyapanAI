import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const VERBAL_CHAPTERS: Record<string, string[]> = {
  'Verbal Analogies': ['Basic Analogies', 'Word Relationships', 'Meaning-Based Analogies', 'Advanced Analogies'],
  'Synonyms': ['Basic Synonyms', 'Intermediate Synonyms', 'Advanced Vocabulary', 'Frequently Asked Exam Synonyms'],
  'Antonyms': ['Basic Antonyms', 'Intermediate Antonyms', 'Advanced Antonyms', 'Competitive Exam Antonyms'],
  'Sentence Completion': ['Fill in the Blank (Single)', 'Fill in the Blank (Double)', 'Vocabulary Based', 'Grammar Based'],
  'Sentence Correction': ['Subject-Verb Agreement', 'Tenses', 'Articles & Determiners', 'Prepositions', 'Conjunctions', 'Modifiers'],
  'Spotting Errors': ['Grammar Errors', 'Verb Errors', 'Tense Errors', 'Pronoun Errors', 'Article Errors', 'Preposition Errors'],
  'Selecting Words': ['Vocabulary Selection', 'Context-Based Words', 'Confusing Words'],
  'Ordering of Words': ['Rearranging Words', 'Sentence Formation', 'Logical Order'],
  'Ordering of Sentences': ['Paragraph Arrangement', 'Logical Flow', 'Sequence Completion'],
  'Para Jumbles': ['Easy Para Jumbles', 'Moderate Para Jumbles', 'Difficult Para Jumbles'],
  'Sentence Improvement': ['Grammar Improvement', 'Vocabulary Improvement', 'Style Improvement'],
  'Idioms and Phrases': ['Common Idioms', 'Business Idioms', 'Frequently Asked Idioms', 'Advanced Idioms'],
  'One Word Substitution': ['People & Professions', 'Places', 'Actions', 'General Vocabulary'],
  'Change of Voice': ['Active to Passive', 'Passive to Active', 'Tense-Based Voice', 'Mixed Practice'],
  'Change of Speech': ['Direct to Indirect', 'Indirect to Direct', 'Reporting Verbs', 'Mixed Practice'],
};

async function main() {
  console.log('Seeding chapters for Verbal Ability topics...\n');
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [topicName, chapters] of Object.entries(VERBAL_CHAPTERS)) {
    const topic = await prisma.aptitudeTopic.findFirst({
      where: { name: topicName, isActive: true },
    });
    if (!topic) {
      console.log(`  Topic "${topicName}" not found - skipping`);
      continue;
    }
    console.log(`${topicName} (${topic.id}):`);
    for (let i = 0; i < chapters.length; i++) {
      const existing = await prisma.aptitudeChapter.findFirst({
        where: { topicId: topic.id, name: chapters[i] },
      });
      if (existing) {
        console.log(`  [skip] ${chapters[i]}`);
        totalSkipped++;
        continue;
      }
      await prisma.aptitudeChapter.create({
        data: { topicId: topic.id, name: chapters[i], order: i + 1 },
      });
      console.log(`  [new] ${chapters[i]}`);
      totalCreated++;
    }
  }

  console.log(`\nDone! Created: ${totalCreated}, Skipped: ${totalSkipped}`);
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
