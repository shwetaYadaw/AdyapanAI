import path from 'path';
import fs from 'fs';
import { prisma } from '../config/prisma';
import { logger } from './logger';

async function autoSeedQuestions() {
  try {
    logger.info('🌱 Starting auto-seed of questions from JSON files...');
    
    const questionsDataDir = path.resolve(__dirname, '../data/questions');
    let totalSeeded = 0;
    let totalUpdated = 0;
    let totalFailed = 0;

    const codingArenaDir = path.join(questionsDataDir, 'coding-arena');
    
    if (!fs.existsSync(codingArenaDir)) {
      logger.warn(`⚠️  Coding Arena directory not found at ${codingArenaDir}`);
      return;
    }

    const jsonFiles = fs.readdirSync(codingArenaDir).filter(f => f.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(codingArenaDir, file);
      const topic = file.replace('.json', '');

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        if (!data.questions || !Array.isArray(data.questions)) {
          logger.warn(`  ⚠️  Invalid format in ${file}: missing 'questions' array`);
          continue;
        }

        for (const question of data.questions) {
          try {
            const slug = slugify(topic, question.title);

            const existing = await prisma.question.findUnique({
              where: { slug }
            });

            if (existing) {
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
                  companies: question.companies || [],
                  testCases: question.testCases || [],
                  templates: question.templates || {},
                  timeLimit: question.timeLimit || 5000,
                  memoryLimit: question.memoryLimit || 256,
                  xpReward: question.xpReward || 10,
                }
              });
              totalUpdated++;
            } else {
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
                  companies: question.companies || [],
                  testCases: question.testCases || [],
                  templates: question.templates || {},
                  timeLimit: question.timeLimit || 5000,
                  memoryLimit: question.memoryLimit || 256,
                  xpReward: question.xpReward || 10,
                }
              });
              totalSeeded++;
            }
          } catch (err: any) {
            logger.error(`    ❌ Error seeding "${question.title}": ${err.message}`);
            totalFailed++;
          }
        }

        logger.info(`  ✅ ${file}: ${data.questions.length} questions processed`);
      } catch (err: any) {
        logger.error(`  ❌ Error reading ${file}: ${err.message}`);
        totalFailed += 1;
      }
    }

    logger.info(`✨ Auto-seed complete!`);
    logger.info(`   ✅ Total created: ${totalSeeded}`);
    logger.info(`   ✏️  Total updated: ${totalUpdated}`);
    logger.info(`   ❌ Total failed: ${totalFailed}`);
  } catch (error) {
    logger.error('❌ Auto-seed failed:', error);
  }
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

export { autoSeedQuestions };
