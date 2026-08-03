import path from 'path';
import fs from 'fs';
import { prisma } from '../src/config/prisma';

interface TestCase {
  input: string;
  output: string;
  isHidden?: boolean;
}

interface QuestionData {
  title: string;
  difficulty: string;
  category?: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  testCases?: TestCase[];
}

function slugify(topic: string, title: string): string {
  const titleSlug = title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  return titleSlug;
}

function generateStarterCode(): any {
  return {
    javascript: `function solve() {\n    // Write your code here\n    \n}\n\nsolve();`,
    python: `def solve():\n    # Write your code here\n    pass\n\nsolve()`,
    java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}`
  };
}

function generateReferenceSolution(title: string): string {
  // Placeholder reference solution
  return `// Reference solution for: ${title}\nfunction solve() {\n    // Implementation here\n    return result;\n}`;
}

async function seedCodingArenaProblems() {
  try {
    console.log('🌱 Starting to seed Coding Arena problems from JSON files...\n');

    const questionsDataDir = path.resolve(__dirname, '../src/data/questions');
    const codingArenaDir = path.join(questionsDataDir, 'coding-arena');

    if (!fs.existsSync(codingArenaDir)) {
      console.error(`❌ Coding Arena directory not found at ${codingArenaDir}`);
      return;
    }

    const jsonFiles = fs.readdirSync(codingArenaDir).filter(f => f.endsWith('.json'));
    
    let totalSeeded = 0;
    let totalUpdated = 0;
    let totalFailed = 0;

    for (const file of jsonFiles) {
      const filePath = path.join(codingArenaDir, file);
      const topic = file.replace('.json', '');

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        if (!data.questions || !Array.isArray(data.questions)) {
          console.warn(`  ⚠️  Invalid format in ${file}: missing 'questions' array`);
          continue;
        }

        console.log(`\n📁 Processing topic: ${topic} (${data.questions.length} problems)`);

        for (const question of data.questions) {
          try {
            const slug = slugify(topic, question.title);

            // Prepare test cases for Problem table
            const testCasesData = question.testCases || [];
            
            // Check if problem already exists
            const existing = await prisma.problem.findUnique({
              where: { slug },
              include: { testCases: true }
            });

            const problemData = {
              title: question.title,
              slug,
              difficulty: question.difficulty || 'medium',
              statement: question.statement || '',
              constraints: question.constraints || '',
              inputFormat: question.inputFormat || '',
              outputFormat: question.outputFormat || '',
              timeLimit: question.timeLimit || 2000,
              memoryLimit: question.memoryLimit || 256,
              starterCode: generateStarterCode(),
              referenceSolution: generateReferenceSolution(question.title),
              topics: topic,
              companies: Array.isArray(question.companies) ? question.companies.join(', ') : (question.companies || ''),
              tags: topic,
              category: question.category || topic
            };

            if (existing) {
              // Update existing problem
              await prisma.problem.update({
                where: { slug },
                data: problemData
              });

              // Delete old test cases and create new ones
              await prisma.problemTestCase.deleteMany({
                where: { problemId: existing.id }
              });

              // Create test cases
              for (const tc of testCasesData) {
                await prisma.problemTestCase.create({
                  data: {
                    problemId: existing.id,
                    input: tc.input,
                    expectedOutput: tc.output,
                    isHidden: tc.isHidden ?? true,
                    type: tc.isHidden ? 'hidden' : 'sample'
                  }
                });
              }

              totalUpdated++;
              console.log(`  ✏️  Updated: "${question.title}"`);
            } else {
              // Create new problem
              const newProblem = await prisma.problem.create({
                data: problemData
              });

              // Create test cases
              for (const tc of testCasesData) {
                await prisma.problemTestCase.create({
                  data: {
                    problemId: newProblem.id,
                    input: tc.input,
                    expectedOutput: tc.output,
                    isHidden: tc.isHidden ?? true,
                    type: tc.isHidden ? 'hidden' : 'sample'
                  }
                });
              }

              totalSeeded++;
              console.log(`  ✅ Created: "${question.title}"`);
            }
          } catch (err: any) {
            console.error(`    ❌ Error processing "${question.title}": ${err.message}`);
            totalFailed++;
          }
        }
      } catch (err: any) {
        console.error(`  ❌ Error reading ${file}: ${err.message}`);
      }
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`   ✅ Total created: ${totalSeeded}`);
    console.log(`   ✏️  Total updated: ${totalUpdated}`);
    console.log(`   ❌ Total failed: ${totalFailed}`);
    console.log(`   📊 Total problems in database: ${totalSeeded + totalUpdated}\n`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedCodingArenaProblems()
  .then(() => {
    console.log('✅ Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
