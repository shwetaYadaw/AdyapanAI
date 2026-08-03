import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  const q = await prisma.question.findFirst({
    where: { 
      OR: [
        { title: { contains: 'Kth - Smallest' } },
        { title: { contains: 'kth-smallest' } }
      ]
    },
    select: { 
      id: true,
      title: true, 
      slug: true,
      sampleInput: true, 
      sampleOutput: true,
      templates: true 
    }
  });
  
  if (!q) { 
    console.log('Question not found - searching all with "kth" or "smallest"...');
    const all = await prisma.question.findMany({
      where: {
        OR: [
          { title: { contains: 'Kth', mode: 'insensitive' } },
          { title: { contains: 'smallest', mode: 'insensitive' } }
        ]
      },
      select: { title: true, slug: true }
    });
    console.log(`Found ${all.length} questions with Kth or smallest:`);
    all.forEach(q => console.log(`  - ${q.title} (${q.slug})`));
    await prisma.$disconnect(); 
    return; 
  }
  
  console.log('ID:', q.id);
  console.log('Title:', q.title);
  console.log('Slug:', q.slug);
  console.log('\nSample Input:');
  console.log(q.sampleInput);
  console.log('\nSample Output:');
  console.log(q.sampleOutput);
  
  const templates = Array.isArray(q.templates) ? q.templates as any[] : [];
  console.log(`\nNumber of templates: ${templates.length}`);
  
  const javaTemplate = templates.find((t: any) => t.language === 'java');
  
  if (javaTemplate) {
    console.log('\n--- Java Template ---');
    console.log(javaTemplate.code);
  } else {
    console.log('\n❌ No Java template found!');
  }
  
  await prisma.$disconnect();
}

check();
