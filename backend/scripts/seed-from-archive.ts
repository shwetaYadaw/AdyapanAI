/**
 * seed-from-archive.ts
 * Seeds all 436 Coding Arena problems from the archive JSON files into the Problem table.
 * Topic slugs match exactly what the frontend TOPIC_GROUPS uses as keys.
 * Safe to re-run — upserts by slug.
 */

import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../src/config/prisma';

interface RawTestCase {
  input: string;
  output: string;
  isHidden?: boolean;
}

interface RawQuestion {
  title: string;
  difficulty: string;
  category?: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  testCases?: RawTestCase[];
  companies?: string | string[];
  timeLimit?: number;
  memoryLimit?: number;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function starterCode() {
  return {
    javascript: `function solve(input) {\n  // Write your solution here\n}\n`,
    python:     `def solve(input):\n    # Write your solution here\n    pass\n`,
    java:       `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n`,
    cpp:        `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
  };
}

async function main() {
  const archiveDir = path.resolve(__dirname, '../archive/seed-data-2026-08-03/data/questions/coding-arena');

  if (!fs.existsSync(archiveDir)) {
    console.error(`❌ Archive directory not found: ${archiveDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(archiveDir).filter(f => f.endsWith('.json')).sort();
  console.log(`\n📦 Found ${files.length} topic files\n`);

  let created = 0;
  let updated = 0;
  let failed  = 0;
  const topicSummary: Record<string, number> = {};

  for (const file of files) {
    const topicSlug = file.replace('.json', ''); // e.g. "arrays", "two-pointers"
    const filePath  = path.join(archiveDir, file);

    let raw: { questions: RawQuestion[] };
    try {
      raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e: any) {
      console.error(`❌ Failed to parse ${file}: ${e.message}`);
      continue;
    }

    const questions = raw.questions ?? [];
    console.log(`📁 ${topicSlug} — ${questions.length} problems`);
    topicSummary[topicSlug] = 0;

    for (const q of questions) {
      const slug = toSlug(q.title);
      const companies = Array.isArray(q.companies)
        ? q.companies.join(', ')
        : (q.companies ?? '');

      const problemData = {
        title:             q.title,
        slug,
        difficulty:        (q.difficulty ?? 'medium').toLowerCase(),
        statement:         q.statement ?? '',
        constraints:       q.constraints ?? '',
        inputFormat:       q.inputFormat ?? '',
        outputFormat:      q.outputFormat ?? '',
        timeLimit:         q.timeLimit ?? 2000,
        memoryLimit:       q.memoryLimit ?? 256,
        starterCode:       starterCode(),
        referenceSolution: `// Reference solution for: ${q.title}\n`,
        topics:            topicSlug,   // exact slug — matches frontend TOPIC_GROUPS key
        companies,
        tags:              topicSlug,
        category:          topicSlug,
      };

      try {
        const existing = await prisma.problem.findUnique({ where: { slug } });

        if (existing) {
          await prisma.problem.update({ where: { slug }, data: problemData });
          // Replace test cases
          await prisma.problemTestCase.deleteMany({ where: { problemId: existing.id } });
          const id = existing.id;
          for (const tc of (q.testCases ?? [])) {
            await prisma.problemTestCase.create({
              data: { problemId: id, input: tc.input, expectedOutput: tc.output, isHidden: tc.isHidden ?? true, type: tc.isHidden ? 'hidden' : 'sample' },
            });
          }
          updated++;
        } else {
          const created_ = await prisma.problem.create({ data: problemData });
          for (const tc of (q.testCases ?? [])) {
            await prisma.problemTestCase.create({
              data: { problemId: created_.id, input: tc.input, expectedOutput: tc.output, isHidden: tc.isHidden ?? true, type: tc.isHidden ? 'hidden' : 'sample' },
            });
          }
          created++;
        }

        topicSummary[topicSlug]++;
        process.stdout.write('.');
      } catch (e: any) {
        console.error(`\n  ❌ ${q.title}: ${e.message}`);
        failed++;
      }
    }
    console.log(); // newline after dots
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ SEED COMPLETE');
  console.log('='.repeat(60));
  console.log(`  Created : ${created}`);
  console.log(`  Updated : ${updated}`);
  console.log(`  Failed  : ${failed}`);
  console.log(`  Total   : ${created + updated}`);
  console.log('\n📊 Problems per topic:');
  for (const [topic, count] of Object.entries(topicSummary)) {
    console.log(`  ${topic.padEnd(30)} ${count}`);
  }
  console.log('='.repeat(60) + '\n');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
