import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

async function seedTopics() {
  console.log('🌱 Seeding topics...\n');

  const initialTopics = [
    // Coding Arena Topics
    ...['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Hashing', 'Stack', 'Queue', 'Recursion', 'Backtracking', 'Greedy', 'Binary Search', 'Bit Manipulation', 'Segment Tree', 'Fenwick Tree', 'Trie', 'Two Pointers', 'Sliding Window', 'Heap/Priority Queue', 'DFS/BFS', 'Sorting'].map((name, idx) => ({
      name,
      system: 'coding-arena',
      description: `${name} problems for top MNC companies`,
      order: idx,
      isActive: true
    })),
    // TCS NQT Topics
    ...['Quantitative Aptitude', 'Verbal Reasoning', 'Logical Reasoning', 'English', 'Reading Comprehension', 'Problem Solving', 'Time & Work', 'Profit & Loss', 'Percentage', 'Simple Interest', 'Compound Interest', 'Algebra', 'Geometry', 'Trigonometry', 'Data Interpretation', 'Permutation & Combination', 'Probability'].map((name, idx) => ({
      name,
      system: 'tcs-nqt',
      description: `${name} questions for TCS NQT preparation`,
      order: idx,
      isActive: true
    })),
    // Aptitude Topics
    ...['Quantitative Aptitude', 'Verbal Reasoning', 'Logical Reasoning', 'Data Interpretation', 'Puzzles', 'Numbers', 'Percentages', 'Time & Distance', 'Time & Work', 'Profit & Loss', 'Ratios & Proportions', 'Averages', 'Permutation & Combination', 'Probability', 'Geometry', 'Algebra'].map((name, idx) => ({
      name,
      system: 'aptitude',
      description: `${name} for all companies`,
      order: idx,
      isActive: true
    }))
  ];

  let created = 0;
  let skipped = 0;

  for (const topicData of initialTopics) {
    try {
      // Check if already exists
      const existing = await prisma.topic.findUnique({
        where: {
          name_system: {
            name: topicData.name,
            system: topicData.system as any
          }
        }
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${topicData.name} (${topicData.system}) - already exists`);
        skipped++;
        continue;
      }

      await prisma.topic.create({
        data: topicData as any
      });

      console.log(`✅ Created: ${topicData.name} (${topicData.system})`);
      created++;
    } catch (err: any) {
      console.error(`❌ Error creating ${topicData.name} (${topicData.system}): ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✨ Summary:`);
  console.log(`   Created: ${created} topics`);
  console.log(`   Skipped: ${skipped} topics\n`);

  // Display count by system
  const counts = await prisma.topic.groupBy({
    by: ['system'],
    _count: {
      id: true
    }
  });

  console.log('📊 Topics by system:');
  counts.forEach(({ system, _count }) => {
    console.log(`   ${system}: ${_count.id} topics`);
  });
}

seedTopics()
  .catch((err) => {
    console.error('Error seeding topics:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
