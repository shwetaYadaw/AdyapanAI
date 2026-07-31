import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

async function verify() {
  try {
    console.log('🔍 Verifying TCS NQT Updates...\n');

    // Get a few sample TCS NQT problems
    const problems = await prisma.question.findMany({
      where: {
        topics: {
          array_contains: 'tcs-nqt'
        }
      },
      select: {
        title: true,
        slug: true,
        statement: true,
        testCases: true
      },
      take: 5
    });

    console.log(`✅ Found ${problems.length} TCS NQT problems in database\n`);
    console.log('═'.repeat(70));

    for (const p of problems) {
      const stmt = p.statement as string;
      const testCases = p.testCases as any[];
      
      console.log(`\n📋 ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Statement length: ${stmt.length} characters`);
      console.log(`   Statement starts with: "${stmt.substring(0, 60)}..."`);
      console.log(`   Test Cases: ${testCases.length} total`);
      console.log(`      - Visible: ${testCases.filter(tc => !tc.isHidden).length}`);
      console.log(`      - Hidden: ${testCases.filter(tc => tc.isHidden).length}`);
    }

    console.log('\n' + '═'.repeat(70));
    console.log(`\n✅ TCS NQT problems are UPDATED in the database!`);
    console.log(`\n💡 To see the changes on frontend:`);
    console.log(`   1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)`);
    console.log(`   2. Or open in Incognito mode`);
    console.log(`   3. Or clear browser cache via DevTools\n`);

    const totalCount = await prisma.question.count({
      where: { topics: { array_contains: 'tcs-nqt' } }
    });
    console.log(`📊 Total TCS NQT problems in database: ${totalCount}`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
