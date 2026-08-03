import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  const q = await prisma.question.findFirst({
    where: { title: { contains: 'Kth - Smallest' } },
    select: { 
      title: true, 
      sampleInput: true, 
      sampleOutput: true,
      templates: true 
    }
  });
  
  if (!q) { 
    console.log('Question not found'); 
    await prisma.$disconnect(); 
    return; 
  }
  
  console.log('Title:', q.title);
  console.log('\nSample Input:');
  console.log(q.sampleInput);
  console.log('\nSample Output:');
  console.log(q.sampleOutput);
  
  const templates = Array.isArray(q.templates) ? q.templates as any[] : [];
  const javaTemplate = templates.find((t: any) => t.language === 'java');
  
  console.log('\n--- Java Template ---');
  console.log(javaTemplate?.code);
  
  await prisma.$disconnect();
}

check();
