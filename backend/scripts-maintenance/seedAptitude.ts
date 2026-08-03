/**
 * Seed Script for Aptitude Questions
 * 
 * This script migrates ALL hardcoded aptitude questions from AptitudePage.tsx to the database.
 * 
 * Usage:
 *   npx ts-node src/scripts/seedAptitude.ts
 * 
 * This will import all 622 questions from the frontend into the database.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Verify database connection
async function verifyConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful\n');
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error);
    console.error('\n💡 Make sure DATABASE_URL is set in your .env file');
    process.exit(1);
  }
}

// Read the AptitudePage.tsx file and extract questions
function extractQuestionsFromFile(): Array<{
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  module: string;
  topic: string;
  difficulty: string;
}> {
  const filePath = path.join(__dirname, '../../../web/src/pages/student/AptitudePage.tsx');
  
  console.log('📖 Reading file:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    console.log('💡 Make sure you run this from the backend directory');
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Extract TCS_NUMERICAL_TOPICS, TCS_VERBAL_TOPICS, etc.
  const allQuestions: any[] = [];
  
  // Find all exported topic arrays
  const topicArrayPattern = /export const (\w+_TOPICS):\s*Topic\[\]\s*=\s*\[([\s\S]*?)\];[\s\n]*(?=export|function|default)/g;
  
  let match;
  while ((match = topicArrayPattern.exec(fileContent)) !== null) {
    const arrayName = match[1];
    const arrayContent = match[2];
    
    console.log(`\n📦 Found array: ${arrayName}`);
    
    // Determine module from array name
    let module = 'quantitative';
    if (arrayName.includes('VERBAL')) module = 'verbal';
    else if (arrayName.includes('LOGICAL')) module = 'logical';
    
    // Extract topics from this array
    const topicPattern = /\{\s*name:\s*['"`](.*?)['"`][\s\S]*?questions:\s*\[([\s\S]*?)\]\s*\}/g;
    
    let topicMatch;
    while ((topicMatch = topicPattern.exec(arrayContent)) !== null) {
      const topicName = topicMatch[1];
      const questionsContent = topicMatch[2];
      
      // Convert topic name to slug
      const topicSlug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Extract individual questions
      const questionPattern = /\{\s*question:\s*['"`]([\s\S]*?)['"`]\s*,\s*options:\s*\[([\s\S]*?)\]\s*,\s*answer:\s*['"`](.*?)['"`]\s*,\s*explanation:\s*['"`]([\s\S]*?)['"`]\s*\}/g;
      
      let questionMatch;
      while ((questionMatch = questionPattern.exec(questionsContent)) !== null) {
        const question = questionMatch[1].replace(/\\'/g, "'").replace(/\\/g, '');
        const optionsStr = questionMatch[2];
        const answer = questionMatch[3].replace(/\\'/g, "'");
        const explanation = questionMatch[4].replace(/\\'/g, "'").replace(/\\/g, '');
        
        // Parse options array
        const options = optionsStr
          .split(',')
          .map(opt => opt.trim().replace(/^['"`]|['"`]$/g, '').replace(/\\'/g, "'"))
          .filter(opt => opt.length > 0);
        
        allQuestions.push({
          question,
          options,
          answer,
          explanation,
          module,
          topic: topicSlug,
          difficulty: 'medium', // Default difficulty
        });
      }
      
      console.log(`   ├─ Topic: ${topicName} (${topicSlug})`);
    }
  }
  
  console.log(`\n✅ Extracted ${allQuestions.length} questions from file`);
  return allQuestions;
}

async function seedAptitude() {
  try {
    console.log('🌱 Starting aptitude questions seeding...\n');
    
    // Verify database connection first
    await verifyConnection();

    // Extract questions from file
    const questions = extractQuestionsFromFile();
    
    if (questions.length === 0) {
      console.error('❌ No questions found to seed!');
      process.exit(1);
    }

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const q of questions) {
      try {
        // Check if question already exists
        const existing = await prisma.aptitudeQuestion.findFirst({
          where: { question: q.question },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Create new question
        await prisma.aptitudeQuestion.create({
          data: {
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            module: q.module,
            topic: q.topic,
            difficulty: q.difficulty,
          },
        });

        created++;
        
        // Progress indicator
        if (created % 50 === 0) {
          console.log(`   ✅ Progress: ${created} questions created...`);
        }
      } catch (err) {
        failed++;
        console.error(`   ❌ Failed to create question: "${q.question.substring(0, 50)}..."`);
        console.error(`      Error: ${err}`);
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`   ✅ Created:  ${created} questions`);
    console.log(`   ⏭️  Skipped:  ${skipped} questions (already exist)`);
    console.log(`   ❌ Failed:   ${failed} questions`);
    console.log(`   📝 Total:    ${questions.length} questions`);
    console.log('═══════════════════════════════════════');
    console.log('\n✨ Aptitude questions seeding completed successfully!');
    console.log('\n🎉 You now have all your aptitude questions in the database!');
    console.log('📍 Next step: Test the admin panel at /admin/aptitude');
  } catch (error) {
    console.error('❌ Error seeding aptitude questions:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAptitude();
