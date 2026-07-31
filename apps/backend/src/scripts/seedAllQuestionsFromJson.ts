import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';
import fs from 'fs';

async function loadQuestionsFromJson() {
  const questionsDataDir = path.resolve(__dirname, '../data/questions');
  let totalSeeded = 0;
  let totalFailed = 0;

  // Get all topic directories
  const tcsNqtDir = path.join(questionsDataDir, 'tcs-nqt');
  const codingArenaDir = path.join(questionsDataDir, 'coding-arena');

  const sources = [
    { dir: tcsNqtDir, source: 'tcs-nqt', label: 'TCS NQT' },
    { dir: codingArenaDir, source: 'coding-arena', label: 'Coding Arena' }
  ];

  for (const { dir, source, label } of sources) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  ${label} directory not found at ${dir}`);
      continue;
    }

    console.log(`\n📂 Processing ${label} questions...`);

    const jsonFiles = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(dir, file);
      const topic = file.replace('.json', '');

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        if (!data.questions || !Array.isArray(data.questions)) {
          console.log(`  ⚠️  Invalid format in ${file}: missing 'questions' array`);
          continue;
        }

        for (const question of data.questions) {
          try {
            // Create slug from title
            const slug = slugify(topic, question.title);

            // Check if question already exists
            const existing = await prisma.question.findUnique({
              where: { slug }
            });

            if (existing) {
              // Update existing question
              await prisma.question.update({
                where: { slug },
                data: {
                  title: question.title,
                  difficulty: question.difficulty || 'medium',
                  statement: question.statement || '',
                  inputFormat: question.inputFormat || '',
                  outputFormat: question.outputFormat || '',
                  constraints: question.constraints || '',
                  sampleInput: question.sampleInput || '',
                  sampleOutput: question.sampleOutput || '',
                  topics: [topic],
                  companies: source === 'tcs-nqt' ? ['TCS'] : (question.companies || []),
                  testCases: question.testCases || [],
                }
              });
            } else {
              // Create new question
              await prisma.question.create({
                data: {
                  slug,
                  title: question.title,
                  difficulty: question.difficulty || 'medium',
                  statement: question.statement || '',
                  inputFormat: question.inputFormat || '',
                  outputFormat: question.outputFormat || '',
                  constraints: question.constraints || '',
                  sampleInput: question.sampleInput || '',
                  sampleOutput: question.sampleOutput || '',
                  topics: [topic],
                  companies: source === 'tcs-nqt' ? ['TCS'] : (question.companies || []),
                  testCases: question.testCases || [],
                  templates: {}, // Empty templates for now - can be added via admin API
                  timeLimit: 5000,
                  memoryLimit: 256,
                }
              });
            }

            totalSeeded++;
          } catch (err: any) {
            console.log(`    ❌ Error seeding "${question.title}": ${err.message}`);
            totalFailed++;
          }
        }

        console.log(`  ✅ ${file}: ${data.questions.length} questions`);
      } catch (err: any) {
        console.log(`  ❌ Error reading ${file}: ${err.message}`);
        totalFailed += 1;
      }
    }
  }

  console.log(`\n✨ Seeding complete!`);
  console.log(`   ✅ Total seeded: ${totalSeeded}`);
  console.log(`   ❌ Total failed: ${totalFailed}`);
}

function slugify(topic: string, title: string): string {
  const topicSlug = topic
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  const titleSlug = title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  return `${topicSlug}-${titleSlug}`;
}

async function seed() {
  try {
    console.log('🌱 Starting unified questions seed from JSON files...\n');
    await loadQuestionsFromJson();
    console.log('\n✅ Seed completed successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
