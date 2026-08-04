// @ts-nocheck
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
    let totalDeleted = 0;
    let totalFailed = 0;

    const codingArenaDir = path.join(questionsDataDir, 'coding-arena');
    
    if (!fs.existsSync(codingArenaDir)) {
      logger.warn(`⚠️  Coding Arena directory not found at ${codingArenaDir}`);
      return;
    }

    const jsonFiles = fs.readdirSync(codingArenaDir).filter(f => f.endsWith('.json'));

    // Step 1: Collect all valid slugs from JSON files
    const validSlugs = new Set<string>();
    const topicQuestions = new Map<string, any[]>();

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

        topicQuestions.set(topic, data.questions);

        for (const question of data.questions) {
          const slug = slugify(topic, question.title);
          validSlugs.add(slug);
        }
      } catch (err) {
        logger.error(`  ❌ Error reading ${file}`);
      }
    }

    // Step 2: Delete duplicate questions that are NOT in the valid set
    const existingQuestions = await prisma.question.findMany({
      select: { id: true, slug: true, title: true }
    });

    for (const question of existingQuestions) {
      if (!validSlugs.has(question.slug)) {
        try {
          await prisma.question.delete({
            where: { id: question.id }
          });
          totalDeleted++;
          logger.info(`  🗑️  Deleted duplicate: "${question.title}"`);
        } catch (err) {
          logger.warn(`  ⚠️  Could not delete: "${question.title}"`);
        }
      }
    }

    // Step 3: Seed/update questions from JSON files
    for (const [topic, questions] of topicQuestions) {
      try {
        for (const question of questions) {
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

        logger.info(`  ✅ ${topicQuestions.get(topic)?.length || 0} questions processed for topic: ${topic}`);
      } catch (err: any) {
        logger.error(`  ❌ Error processing topic ${topic}: ${err.message}`);
      }
    }

    logger.info(`✨ Auto-seed complete!`);
    logger.info(`   ✅ Total created: ${totalSeeded}`);
    logger.info(`   ✏️  Total updated: ${totalUpdated}`);
    logger.info(`   🗑️  Total deleted (duplicates): ${totalDeleted}`);
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
