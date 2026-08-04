/**
 * clean-and-reseed.ts
 * 1. Deletes ALL existing problems and their test cases
 * 2. Re-seeds all 436 problems from archive with correct topic slugs
 * Run once to get a clean state.
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
  // ── Step 1: Clean everything ──────────────────────────────────────────────
  console.log('\n🧹 Step 1: Cleaning existing data...');
  
  const tcCount = await prisma.problemTestCase.deleteMany({});
  console.log(`   Deleted ${tcCount.count} test cases`);
  
  // Also clean related records that reference Problem
  await prisma.problemSubmission.deleteMany({});
  await prisma.problemSubmissionResult.deleteMany({});
  await prisma.problemSolution.deleteMany({});
  await prisma.problemVersion.deleteMany({});
  
  const pCount = await prisma.problem.deleteMany({});
  console.log(`   Deleted ${pCount.count} problems`);
  console.log('   ✅ Clean slate ready\n');

  // ── Step 2: Reseed from archive ───────────────────────────────────────────
  const archiveDir = path.resolve(
    __dirname,
    '../archive/seed-data-2026-08-03/data/questions/coding-arena'
  );

  if (!fs.existsSync(archiveDir)) {
    console.error(`❌ Archive directory not found: ${archiveDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(archiveDir).filter(f => f.endsWith('.json')).sort();
  console.log(`📦 Step 2: Seeding from ${files.length} topic files...\n`);

  let created = 0;
  let failed  = 0;
  const topicSummary: Record<string, number> = {};

  for (const file of files) {
    const topicSlug = file.replace('.json', '');
    const filePath  = path.join(archiveDir, file);

    let raw: { questions: RawQuestion[] };
    try {
      raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e: any) {
      console.error(`❌ Failed to parse ${file}: ${e.message}`);
      continue;
    }

    const questions = raw.questions ?? [];
    console.log(`📁 ${topicSlug.padEnd(30)} ${questions.length} problems`);
    topicSummary[topicSlug] = 0;

    // Track slugs within this run to skip in-run duplicates
    const seenSlugs = new Set<string>();

    for (const q of questions) {
      const slug = toSlug(q.title);

      if (seenSlugs.has(slug)) {
        console.log(`  ⚠️  Duplicate title in file, skipping: "${q.title}"`);
        continue;
      }
      seenSlugs.add(slug);

      const companies = Array.isArray(q.companies)
        ? q.companies.join(', ')
        : (q.companies ?? '');

      try {
        const newProblem = await prisma.problem.create({
          data: {
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
            referenceSolution: `// TODO: Add reference solution for ${q.title}\n`,
            topics:            topicSlug,
            companies,
            tags:              topicSlug,
            category:          topicSlug,
          },
        });

        // Create test cases
        for (const tc of (q.testCases ?? [])) {
          await prisma.problemTestCase.create({
            data: {
              problemId:      newProblem.id,
              input:          tc.input,
              expectedOutput: tc.output,
              isHidden:       tc.isHidden ?? true,
              type:           tc.isHidden ? 'hidden' : 'sample',
            },
          });
        }

        created++;
        topicSummary[topicSlug]++;
        process.stdout.write('.');
      } catch (e: any) {
        if (e.code === 'P2002') {
          // Unique constraint — slug already exists from another topic, skip
          console.log(`\n  ⚠️  Slug conflict skipped: "${slug}"`);
        } else {
          console.error(`\n  ❌ "${q.title}": ${e.message}`);
          failed++;
        }
      }
    }
    console.log(); // newline after dots
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log('✅ DONE');
  console.log('='.repeat(60));
  console.log(`  Total created : ${created}`);
  console.log(`  Failed        : ${failed}`);
  console.log('\n📊 Problems per topic:');
  let grandTotal = 0;
  for (const [topic, count] of Object.entries(topicSummary)) {
    console.log(`  ${topic.padEnd(30)} ${String(count).padStart(3)}`);
    grandTotal += count;
  }
  console.log(`${''.padEnd(30)} ---`);
  console.log(`  ${'TOTAL'.padEnd(29)} ${String(grandTotal).padStart(3)}`);
  console.log('='.repeat(60) + '\n');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
