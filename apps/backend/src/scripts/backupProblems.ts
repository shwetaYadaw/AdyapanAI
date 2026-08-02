import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

/**
 * Backup all problems from database to JSON file
 * This ensures zero data loss during migration
 */
async function backupProblems() {
  try {
    console.log('🔄 Starting backup of all problems...\n');

    // Get all problems with test cases
    const problems = await prisma.problem.findMany({
      include: {
        testCases: true,
        solutions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (problems.length === 0) {
      console.log('❌ No problems found in database');
      process.exit(0);
    }

    // Create backup directory
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `problems-backup-${timestamp}.json`);

    const backup = {
      timestamp: new Date().toISOString(),
      totalProblems: problems.length,
      problems: problems.map(p => ({
        ...p,
        testCases: p.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          explanation: tc.explanation,
          order: tc.order
        })),
        solutions: p.solutions.map(s => ({
          code: s.code,
          language: s.language,
          approach: s.approach,
          timeComplexity: s.timeComplexity,
          spaceComplexity: s.spaceComplexity,
          explanation: s.explanation,
          isOptimal: s.isOptimal
        }))
      }))
    };

    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

    console.log('✅ Backup completed successfully!\n');
    console.log(`📁 Backup file: ${backupFile}`);
    console.log(`📊 Total problems backed up: ${problems.length}`);
    console.log('\n💾 This backup file can be used to restore data if needed.');
    console.log('📤 You can also import this file using the Admin Dashboard.\n');

    // Create a summary file
    const summaryFile = path.join(backupDir, `backup-summary-${timestamp}.txt`);
    const summary = `
PROBLEM BACKUP SUMMARY
======================
Created: ${new Date().toISOString()}
Total Problems: ${problems.length}

Problems by Difficulty:
${problems
  .reduce((acc: any, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
  .toString()}

Problems by Category:
${problems
  .reduce((acc: any, p) => {
    acc[p.category || 'general'] = (acc[p.category || 'general'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
  .toString()}

Sample Problems:
${problems
  .slice(0, 5)
  .map(p => `- ${p.title} (${p.difficulty}, ${p.category})`)
  .join('\n')}
${problems.length > 5 ? `... and ${problems.length - 5} more` : ''}

Backup File: ${backupFile}
This file contains all problem data and can be used to restore or import problems.
`;

    fs.writeFileSync(summaryFile, summary);
    console.log(`📄 Summary file: ${summaryFile}\n`);

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run backup
backupProblems();
