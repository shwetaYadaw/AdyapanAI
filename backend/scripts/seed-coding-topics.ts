import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

const topics = [
  { name: 'Sorting Techniques', slug: 'sorting-techniques' },
  { name: 'Arrays', slug: 'arrays' },
  { name: 'Binary Search', slug: 'binary-search' },
  { name: 'Strings', slug: 'strings' },
  { name: 'LinkedList', slug: 'linkedlist' },
  { name: 'Recursion', slug: 'recursion' },
  { name: 'Bit Manipulation', slug: 'bit-manipulation' },
  { name: 'Stack and Queues', slug: 'stack-queues' },
  { name: 'Sliding Window', slug: 'sliding-window' },
  { name: 'Heaps', slug: 'heaps' },
  { name: 'Greedy Algorithms', slug: 'greedy' },
  { name: 'Binary Trees', slug: 'binary-trees' },
  { name: 'Binary Search Trees', slug: 'bst' },
  { name: 'Graphs', slug: 'graphs' },
  { name: 'Dynamic Programming', slug: 'dp' },
  { name: 'Tries', slug: 'tries' },
];

const questionTemplates = [
  {
    title: 'Basic Concept',
    statement: 'What is the time complexity of {topic}?',
    difficulty: 'easy'
  },
  {
    title: 'Implementation Problem',
    statement: 'Implement {topic} with optimal approach',
    difficulty: 'medium'
  },
  {
    title: 'Optimization',
    statement: 'How to optimize {topic} further?',
    difficulty: 'hard'
  },
  {
    title: 'Real World Application',
    statement: 'Where is {topic} used in production?',
    difficulty: 'easy'
  },
  {
    title: 'Problem Solving',
    statement: 'Solve {topic} based problem efficiently',
    difficulty: 'medium'
  },
];

async function seedCodingTopics() {
  try {
    console.log('🌱 Starting seed for Coding Arena topics...\n');

    let topicsCreated = 0;
    let problemsCreated = 0;

    for (const topic of topics) {
      try {
        const existingTopic = await prisma.topic.findUnique({
          where: {
            name_system: {
              name: topic.name,
              system: 'coding-arena'
            }
          }
        });

        let topicId: string;

        if (existingTopic) {
          console.log(`⏭️  Skipped topic: ${topic.name} (already exists)`);
          topicId = existingTopic.id;
        } else {
          const createdTopic = await prisma.topic.create({
            data: {
              name: topic.name,
              description: `Learn ${topic.name} with practice problems`,
              system: 'coding-arena',
              order: topics.indexOf(topic),
              isActive: true,
            },
          });

          console.log(`✅ Created topic: ${topic.name}`);
          topicsCreated++;
          topicId = createdTopic.id;
        }

        // Generate 20 problems for each topic
        for (let i = 1; i <= 20; i++) {
          const template = questionTemplates[i % questionTemplates.length];
          const difficulty = ['easy', 'medium', 'hard'][Math.floor(i / 7)];
          const problemSlug = `${topic.slug}-${i}`;

          try {
            const existingProblem = await prisma.problem.findUnique({
              where: { slug: problemSlug }
            });

            if (!existingProblem) {
              await prisma.problem.create({
                data: {
                  title: `${template.title} - ${topic.name} #${i}`,
                  slug: problemSlug,
                  statement: template.statement.replace('{topic}', topic.name),
                  difficulty: difficulty,
                  topics: topic.name,
                  companies: ['TCS', 'Infosys', 'Amazon'][i % 3],
                  timeLimit: 30 + (i % 5) * 10,
                  memoryLimit: 256,
                  inputFormat: 'Integer or Array input',
                  outputFormat: 'Integer or string output',
                  constraints: `1 <= n <= ${100 + i * 100}`,
                  referenceSolution: `// Solution for ${topic.name} question ${i}\\n// Time: O(n log n), Space: O(1)`,
                  starterCode: {},
                  category: 'coding-arena'
                },
              });
              problemsCreated++;
            }
          } catch (err: any) {
            if (!err.message.includes('Unique constraint failed')) {
              console.error(`   Error creating problem: ${err.message}`);
            }
          }
        }

        console.log(`   📝 Created/Skipped 20 problems for: ${topic.name}`);
      } catch (error: any) {
        console.error(`❌ Error with topic ${topic.name}: ${error.message}`);
      }
    }

    console.log(`\n✨ Seed Summary:`);
    console.log(`   Topics created: ${topicsCreated}`);
    console.log(`   Problems created: ${problemsCreated}`);
    console.log(`   Total expected: ${topics.length} topics × 20 problems = ${topics.length * 20}`);
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedCodingTopics();
