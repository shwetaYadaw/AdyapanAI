import { prisma } from '../src/config/prisma';

async function main() {
  console.log('🌱 Seeding topics for all systems...');

  const initialTopics = [
    // Coding Arena Topics
    ...['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Hashing', 'Stack', 'Queue', 'Recursion', 'Backtracking', 'Greedy', 'Binary Search', 'Bit Manipulation', 'Segment Tree', 'Fenwick Tree', 'Trie', 'Two Pointers', 'Sliding Window', 'Heap/Priority Queue', 'DFS/BFS', 'Sorting'].map((name, idx) => ({
      name,
      system: 'coding-arena' as const,
      description: `${name} problems for top MNC companies`,
      order: idx,
      isActive: true,
    })),
    // TCS NQT Topics
    ...['Quantitative Aptitude', 'Verbal Reasoning', 'Logical Reasoning', 'English', 'Reading Comprehension', 'Problem Solving', 'Time & Work', 'Profit & Loss', 'Percentage', 'Simple Interest', 'Compound Interest', 'Algebra', 'Geometry', 'Trigonometry', 'Data Interpretation', 'Permutation & Combination', 'Probability'].map((name, idx) => ({
      name,
      system: 'tcs-nqt' as const,
      description: `${name} questions for TCS NQT preparation`,
      order: idx,
      isActive: true,
    })),
    // Aptitude Topics
    ...['Quantitative Aptitude', 'Verbal Reasoning', 'Logical Reasoning', 'Data Interpretation', 'Puzzles', 'Numbers', 'Percentages', 'Time & Distance', 'Time & Work', 'Profit & Loss', 'Ratios & Proportions', 'Averages', 'Permutation & Combination', 'Probability', 'Geometry', 'Algebra'].map((name, idx) => ({
      name,
      system: 'aptitude' as const,
      description: `${name} for all companies`,
      order: idx,
      isActive: true,
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
            system: topicData.system
          }
        }
      });

      if (existing) {
        console.log(`⏭️  ${topicData.system}: "${topicData.name}" already exists`);
        skipped++;
        continue;
      }

      const topic = await prisma.topic.create({
        data: topicData
      });

      console.log(`✅ Created: ${topicData.system} → ${topic.name}`);
      created++;
    } catch (err: any) {
      console.error(`❌ Error creating ${topicData.name}:`, err.message);
      skipped++;
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📊 Total: ${initialTopics.length}`);
}

main()
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
