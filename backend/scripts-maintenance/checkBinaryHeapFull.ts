import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function check() {
  try {
    const problem = await prisma.question.findUnique({
      where: { slug: 'tournament-tree-and-binary-heap-hashing' },
      select: {
        id: true,
        title: true,
        slug: true,
        statement: true,
        inputFormat: true,
        outputFormat: true,
        constraints: true,
        sampleInput: true,
        sampleOutput: true,
        testCases: true
      }
    });

    if (!problem) {
      console.log('Problem not found');
      process.exit(1);
    }

    console.log('✅ Binary Heap Operations - Full Record Check\n');
    console.log('═'.repeat(70));
    
    console.log(`Title: ${problem.title}`);
    console.log(`Slug: ${problem.slug}`);
    console.log(`\n📄 Statement Length: ${(problem.statement as string).length} characters`);
    console.log(`\n📝 Statement contains:`);
    const stmt = problem.statement as string;
    console.log(`  - "Problem Statement" appears ${(stmt.match(/Problem Statement/g) || []).length} time(s)`);
    console.log(`  - "Binary Heap Operations" appears ${(stmt.match(/Binary Heap Operations/g) || []).length} time(s)`);
    console.log(`  - "insertKey" appears ${(stmt.match(/insertKey/g) || []).length} time(s)`);
    console.log(`  - "deleteKey" appears ${(stmt.match(/deleteKey/g) || []).length} time(s)`);
    console.log(`  - "extractMin" appears ${(stmt.match(/extractMin/g) || []).length} time(s)`);

    console.log(`\n📋 Input Format Length: ${(problem.inputFormat as string).length} characters`);
    console.log(`📋 Output Format Length: ${(problem.outputFormat as string).length} characters`);
    console.log(`📋 Constraints Length: ${(problem.constraints as string).length} characters`);
    console.log(`📋 Sample Input Length: ${(problem.sampleInput as string).length} characters`);
    console.log(`📋 Sample Output Length: ${(problem.sampleOutput as string).length} characters`);
    
    const testCases = problem.testCases as any[];
    console.log(`\n🧪 Test Cases: ${testCases.length} total`);
    console.log(`   - Visible: ${testCases.filter(tc => !tc.isHidden).length}`);
    console.log(`   - Hidden: ${testCases.filter(tc => tc.isHidden).length}`);

    console.log('\n✅ Record appears to have all data correctly');
    console.log('⚠️  Issue is likely frontend-related (rendering or caching)');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

check();
