import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function generateBoilerplates(title: string) {
  const methodName = slugify(title).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  return [
    {
      language: 'python',
      code: `import sys\n\ndef ${methodName}(input_str):\n    # Write your logic here\n    # Process 'input_str' and return the result\n    return "1"\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    res = ${methodName}(lines[0])\n    print(res)\n\nif __name__ == "__main__":\n    solve()`
    },
    {
      language: 'javascript',
      code: `// Solution for ${title}\nconst fs = require('fs');\n\nfunction ${methodName}(inputStr) {\n    // Write your logic here\n    // Process 'inputStr' and return the result\n    return "1";\n}\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    if (!input) return;\n    console.log(${methodName}(input));\n}\nsolve();`
    },
    {
      language: 'cpp',
      code: `// Solution for ${title}\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring ${methodName}(string inputStr) {\n    // Write your logic here\n    // Process 'inputStr' and return the result\n    return "1";\n}\n\nint main() {\n    string inputStr;\n    if (getline(cin, inputStr)) {\n        cout << ${methodName}(inputStr) << endl;\n    }\n    return 0;\n}`
    },
    {
      language: 'java',
      code: `// Solution for ${title}\nimport java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static String ${methodName}(String inputStr) {\n        // Write your logic here\n        // Process 'inputStr' and return the result\n        return "1";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        if (line == null) return;\n        System.out.println(${methodName}(line.trim()));\n    }\n}`
    }
  ];
}

async function seed() {
  try {
    console.log('📚 Seeding TCS NQT questions from JSON...\n');

    // Read JSON file
    const jsonPath = path.resolve(__dirname, '../data/tcs-nqt-questions.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid JSON structure: expected questions array');
    }

    console.log(`✓ Loaded ${data.questions.length} questions from JSON\n`);

    // Delete old TCS NQT questions
    const deleted = await prisma.question.deleteMany({
      where: {
        slug: {
          endsWith: '-tcs-nqt'
        }
      }
    });

    console.log(`✓ Deleted ${deleted.count} old TCS NQT questions from database\n`);

    // Seed new questions
    const seededQuestions = [];

    for (const question of data.questions) {
      const slug = `${slugify(question.title)}-tcs-nqt`;

      const qDoc = {
        title: question.title,
        slug: slug,
        statement: `Practice solving **${question.title}** (TCS NQT preparation). Complete the function signature provided in the editor to parse the input parameters and return the correct result.`,
        difficulty: question.difficulty || 'medium',
        topics: ['tcs-nqt'],
        companies: ['TCS'],
        timeLimit: 1000,
        memoryLimit: 128,
        inputFormat: 'A single line of input value or space-separated elements.',
        outputFormat: 'Expected output solution.',
        constraints: 'Varies per test case.',
        sampleInput: '1 2 3',
        sampleOutput: '1',
        templates: generateBoilerplates(question.title),
        testCases: [
          { input: '1 2 3', output: '1', isHidden: false },
          { input: '4 5 6', output: '1', isHidden: true }
        ]
      };

      await prisma.question.upsert({
        where: { slug: slug },
        update: qDoc,
        create: qDoc
      });

      seededQuestions.push(slug);
    }

    console.log(`✅ Successfully seeded ${seededQuestions.length} TCS NQT questions from JSON!\n`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total seeded: ${seededQuestions.length}`);
    console.log(`   - Topic: tcs-nqt`);
    console.log(`   - Company: TCS`);

    // Verify count
    const count = await prisma.question.count({
      where: {
        slug: {
          endsWith: '-tcs-nqt'
        }
      }
    });

    console.log(`\n✓ Verified: ${count} questions in database with 'tcs-nqt' topic\n`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();
