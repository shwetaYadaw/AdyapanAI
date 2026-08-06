/**
 * ONE-TIME SYNC: Copy all TcsNqtQuestion entries to Problem table (Coding Arena)
 * After this, new questions added via admin will auto-sync (code in tcs-nqt-admin.routes.ts)
 */
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../src/config/prisma';

async function syncTcsToCodingArena() {
  console.log('🔄 Syncing TcsNqtQuestion → Problem (Coding Arena)...\n');

  const allTcs = await prisma.tcsNqtQuestion.findMany();
  let created = 0, skipped = 0, errors = 0;

  for (const q of allTcs) {
    const arenaSlug = q.slug.replace(/-tcs-nqt$/, '-arena').replace(/-tcs$/, '-arena');

    try {
      const existing = await prisma.problem.findUnique({ where: { slug: arenaSlug } });
      if (existing) { skipped++; continue; }

      const starterCode = {
        javascript: `// Write your solution here\nfunction solve(input) {\n  const lines = input.trim().split('\\n');\n  // Your code\n}\nsolve();`,
        python: `# Write your solution here\nimport sys\ndata = sys.stdin.read().split('\\n')\n# Your code`,
        java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code\n    }\n}`,
        cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Your code\n    return 0;\n}`,
      };

      const testCases = Array.isArray(q.testCases) ? q.testCases : [];

      await prisma.problem.create({
        data: {
          title: q.title,
          slug: arenaSlug,
          difficulty: q.difficulty,
          statement: q.statement,
          constraints: q.constraints,
          inputFormat: q.inputFormat,
          outputFormat: q.outputFormat,
          timeLimit: q.timeLimit || 2000,
          memoryLimit: q.memoryLimit || 256,
          starterCode,
          referenceSolution: q.referenceSolution,
          topics: q.topic,
          companies: q.companies,
          tags: '',
          category: (q as any).experienceLevel || 'freshers',
          isArchived: false,
          testCases: {
            create: testCases.map((tc: any, idx: number) => ({
              input: tc.input || '',
              expectedOutput: tc.output || tc.expectedOutput || '',
              isHidden: tc.isHidden ?? false,
              type: tc.isHidden ? 'hidden' : 'sample',
              explanation: tc.explanation || null,
              order: idx,
            })),
          },
        },
      });
      created++;
    } catch (err: any) {
      errors++;
      console.error(`  ❌ ${q.title}: ${err.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`✅ Sync complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (already exist): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total TcsNqtQuestion: ${allTcs.length}`);

  // Fix topic names to match coding-arena Topic table
  const r1 = await prisma.problem.updateMany({ where: { topics: 'Problems on Arrays' }, data: { topics: 'Arrays' } });
  if (r1.count > 0) console.log(`   Fixed 'Problems on Arrays' → 'Arrays': ${r1.count}`);

  // Verify
  const activeProblems = await prisma.problem.count({ where: { isArchived: false } });
  console.log(`\n   Coding Arena now has ${activeProblems} active problems.`);
  console.log('========================================\n');
}

syncTcsToCodingArena()
  .catch(err => { console.error('Fatal:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
