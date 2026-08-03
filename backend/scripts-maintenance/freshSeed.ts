import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';
import fs from 'fs';

async function freshSeed() {
  try {
    console.log('🌱 Fresh seeding problems...\n');

    console.log('🗑️  Clearing old data...');
    await prisma.problemTestCase.deleteMany({});
    await prisma.problem.deleteMany({});
    console.log('✅ Old data cleared');

    console.log('\n📂 Loading from Coding Arena JSON files...');
    const codingArenaDir = path.resolve(__dirname, '../data/questions/coding-arena');
    
    let total = 0;
    const seenSlugs = new Set<string>();
    const jsonFiles = fs.readdirSync(codingArenaDir).filter(f => f.endsWith('.json'));
    console.log(`📋 Found ${jsonFiles.length} files\n`);

    for (const file of jsonFiles) {
      const filePath = path.join(codingArenaDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      const topic = file.replace('.json', '');
      console.log(`  Processing ${file}...`);
      
      for (const q of data.questions || []) {
        let baseSlug = q.slug || `${topic}-${q.title.toLowerCase().replace(/[^\w]+/g, '-')}`;
        let slug = baseSlug;
        let counter = 1;
        
        // Handle duplicate slugs
        while (seenSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        seenSlugs.add(slug);
        
        try {
          await prisma.problem.create({
            data: {
              slug,
              title: q.title || 'Untitled',
              difficulty: q.difficulty || 'medium',
              statement: q.statement || '',
              constraints: q.constraints || '',
              inputFormat: q.inputFormat || '',
              outputFormat: q.outputFormat || '',
              topics: topic,
              companies: Array.isArray(q.companies) ? q.companies.join(',') : '',
              timeLimit: 5000,
              memoryLimit: 256,
              starterCode: '',
              referenceSolution: '',
            }
          });
          total++;
        } catch (err: any) {
          console.log(`    ⚠️  Skipped "${q.title}" (${err.message})`);
        }
      }
    }

    console.log(`\n✅ Seeded ${total} problems from Coding Arena`);
    
    const count = await prisma.problem.count();
    console.log(`📊 Total in Problem table: ${count}`);
    console.log(`\n✨ Fresh seed complete!`);
    console.log(`📌 Go to http://localhost:3000 and REFRESH THE PAGE (Ctrl+Shift+R)\n`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

freshSeed();
