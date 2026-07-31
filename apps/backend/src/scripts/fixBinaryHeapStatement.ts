import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function fix() {
  try {
    console.log('🔧 Fixing Binary Heap Operations statement...\n');

    const problem = await prisma.question.findUnique({
      where: { slug: 'tournament-tree-and-binary-heap-hashing' }
    });

    if (!problem) {
      console.log('❌ Problem not found');
      process.exit(1);
    }

    let statement = problem.statement as string;
    
    // Remove the "## 📝 Problem Statement" line from the beginning
    const lines = statement.split('\n');
    
    // Find and remove the first "## 📝 Problem Statement" or similar
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('## ') && lines[i].toLowerCase().includes('problem')) {
        startIdx = i + 1;
        break;
      }
    }

    // Reconstruct the statement without that line
    const newStatement = lines.slice(startIdx).join('\n').trim();

    console.log(`Original statement length: ${statement.length}`);
    console.log(`New statement length: ${newStatement.length}`);
    console.log(`Removed ${lines.length - (lines.length - startIdx)} lines\n`);

    // Update in database
    const updated = await prisma.question.update({
      where: { slug: 'tournament-tree-and-binary-heap-hashing' },
      data: { statement: newStatement }
    });

    console.log('✅ Statement updated successfully!\n');
    console.log('First 300 characters of new statement:');
    console.log(newStatement.substring(0, 300) + '...');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fix();
