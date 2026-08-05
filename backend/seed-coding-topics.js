// Seed script for Coding Arena topics and questions
// Run with: node seed-coding-topics.js

// Load environment variables
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correct: 1,
    difficulty: 'easy'
  },
  {
    title: 'Implementation Problem',
    statement: 'Implement {topic} with optimal approach',
    options: ['Recursive', 'Iterative', 'Divide & Conquer', 'Dynamic Programming'],
    correct: 0,
    difficulty: 'medium'
  },
  {
    title: 'Optimization',
    statement: 'How to optimize {topic} further?',
    options: ['Use extra space', 'Use hashing', 'Use sorting', 'Use memoization'],
    correct: 3,
    difficulty: 'hard'
  },
  {
    title: 'Real World Application',
    statement: 'Where is {topic} used in production?',
    options: ['Databases', 'Web servers', 'Mobile apps', 'All of above'],
    correct: 3,
    difficulty: 'easy'
  },
  {
    title: 'Problem Solving',
    statement: 'Solve {topic} based problem efficiently',
    options: ['Brute force', 'Two pointer', 'Binary search', 'Hash table'],
    correct: 1,
    difficulty: 'medium'
  },
];

async function seedData() {
  try {
    console.log('Starting seed...');

    // Create topics
    for (const topic of topics) {
      const createdTopic = await prisma.topic.upsert({
        where: { slug: topic.slug },
        update: {},
        create: {
          name: topic.name,
          slug: topic.slug,
          description: `Learn ${topic.name} with practice problems`,
          icon: '💻',
          system: 'coding-arena',
          order: topics.indexOf(topic),
          isActive: true,
        },
      });

      console.log(`Created/Updated topic: ${topic.name}`);

      // Generate 20 questions for each topic
      for (let i = 1; i <= 20; i++) {
        const template = questionTemplates[i % questionTemplates.length];
        const difficulty = ['easy', 'medium', 'hard'][Math.floor(i / 7)];

        await prisma.question.create({
          data: {
            title: `${template.title} - ${topic.name} #${i}`,
            slug: `${topic.slug}-q${i}`,
            statement: template.statement.replace('{topic}', topic.name),
            difficulty: difficulty,
            topic: topic.name,
            companies: ['TCS', 'Infosys', 'Amazon'][i % 3],
            timeLimit: 30 + (i % 5) * 10,
            memoryLimit: 256,
            inputFormat: 'Integer or Array input',
            outputFormat: 'Integer or string output',
            constraints: `1 <= n <= ${100 + i * 100}`,
            referenceSolution: `// Solution for ${topic.name} question ${i}\n// Time: O(n log n), Space: O(1)`,
            testCases: JSON.stringify([
              { input: '[1, 2, 3]', expected: '[1, 2, 3]' },
              { input: '[3, 2, 1]', expected: '[1, 2, 3]' },
            ]),
            xpReward: 10 + difficulty === 'hard' ? 10 : difficulty === 'medium' ? 5 : 0,
            topicId: createdTopic.id,
          },
        });
      }

      console.log(`Created 20 questions for: ${topic.name}`);
    }

    console.log('✅ Seed completed successfully!');
    console.log(`Created ${topics.length} topics`);
    console.log(`Created ${topics.length * 20} total questions`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
