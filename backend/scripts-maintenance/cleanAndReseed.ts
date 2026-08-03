import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';
import fs from 'fs';

async function cleanAndReseed() {
  try {
    console.log('🧹 Cleaning up old data and reseeding...\n');

    // Step 1: Delete all problems
    console.log('🗑️  Deleting old problems from Problem table...');
    const deletedProblems = await prisma.problem.deleteMany({});
    console.log(`✅ Deleted ${deletedProblems.count} old problems`);

    // Step 2: Delete all problem test cases
    console.log('🗑️  Deleting problem test cases...');
    const deletedTestCases = await prisma.problemTestCase.deleteMany({});
    console.log(`✅ Deleted ${deletedTestCases.count} test cases`);

    // Step 3: Load fresh questions from JSON
    console.log('\n📂 Loading questions from JSON files...');
    const questionsDataDir = path.resolve(__dirname, '../data/questions');
    
    let totalLoaded = 0;
    const codingArenaDir = path.join(questionsDataDir, 'coding-arena');
    
    if (fs.existsSync(codingArenaDir)) {
      const jsonFiles = fs.readdirSync(codingArenaDir).filter(f => f.endsWith('.json'));
      console.log(`📋 Found ${jsonFiles.length} Coding Arena topic files`);
      
      for (const file of jsonFiles) {
        const filePath = path.join(codingArenaDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        if (data.questions && Array.isArray(data.questions)) {
          for (const question of data.questions) {
            const slug = question.slug || `${data.metadata.topic}-${question.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')}`;
            
            await prisma.problem.upsert({
              where: { slug },
              update: {
                title: question.title,
                difficulty: question.difficulty || 'medium',
                statement: question.statement || '',
                constraints: question.constraints || '',
                inputFormat: question.inputFormat || '',
                outputFormat: question.outputFormat || '',
                topics: question.category || data.metadata.topic || '',
                companies: Array.isArray(question.companies) ? question.companies.join(',') : '',
                timeLimit: question.timeLimit || 5000,
                memoryLimit: question.memoryLimit || 256,
              },
              create: {
                slug,
                title: question.title,
                difficulty: question.difficulty || 'medium',
                statement: question.statement || '',
                constraints: question.constraints || '',
                inputFormat: question.inputFormat || '',
                outputFormat: question.outputFormat || '',
                topics: question.category || data.metadata.topic || '',
                companies: Array.isArray(question.companies) ? question.companies.join(',') : '',
                timeLimit: question.timeLimit || 5000,
                memoryLimit: question.memoryLimit || 256,
                starterCode: '',
                referenceSolution: '',
              }
            });
            totalLoaded++;
          }
        }
      }
    }

    console.log(`\n✅ Loaded ${totalLoaded} questions from Coding Arena JSON files`);

    // Step 4: Verify
    const finalCount = await prisma.problem.count();
    console.log(`\n📊 Final count in Problem table: ${finalCount}`);
    console.log(`\n✨ Clean and reseed complete!`);
    console.log(`\n📌 IMPORTANT: Hard refresh your browser (Ctrl+Shift+R) to see updated questions`);

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndReseed();
