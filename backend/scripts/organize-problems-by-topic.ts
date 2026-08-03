import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * This script organizes the 436 existing problems in the Problem table by topics
 * It extracts topic from the slug and updates the topics field
 * NO DATA LOSS - Only updates the topics field
 */

// Topic mapping based on common slug patterns
const topicMapping: { [key: string]: string } = {
  'array': 'Arrays',
  'arrays': 'Arrays',
  'string': 'Strings',
  'strings': 'Strings',
  'linked-list': 'Linked List',
  'tree': 'Trees',
  'trees': 'Trees',
  'graph': 'Graphs',
  'graphs': 'Graphs',
  'dynamic-programming': 'Dynamic Programming',
  'dp': 'Dynamic Programming',
  'hash': 'Hashing',
  'hashing': 'Hashing',
  'stack': 'Stack',
  'queue': 'Queue',
  'heap': 'Heap/Priority Queue',
  'priority-queue': 'Heap/Priority Queue',
  'recursion': 'Recursion',
  'backtracking': 'Backtracking',
  'greedy': 'Greedy',
  'binary-search': 'Binary Search',
  'bit-manipulation': 'Bit Manipulation',
  'bit': 'Bit Manipulation',
  'segment-tree': 'Segment Tree',
  'fenwick': 'Fenwick Tree',
  'trie': 'Trie',
  'two-pointer': 'Two Pointers',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'dfs': 'DFS/BFS',
  'bfs': 'DFS/BFS',
  'sort': 'Sorting',
  'sorting': 'Sorting',
  'search': 'Searching',
  'searching': 'Searching'
};

async function organizeProblems() {
  console.log('🔍 Starting to organize problems by topic...\n');
  console.log('📌 This will update the topics field in the Problem table');
  console.log('✅ NO DATA LOSS - Only updating topics field\n');

  try {
    // Fetch all problems
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        topics: true
      }
    });

    console.log(`📊 Found ${problems.length} problems in database\n`);

    if (problems.length === 0) {
      console.log('⚠️  No problems found in database');
      return;
    }

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    const topicCounts: { [key: string]: number } = {};

    for (const problem of problems) {
      try {
        // Extract topic from slug
        const slugParts = problem.slug.split('-');
        let detectedTopic = 'General'; // Default

        // Try to match slug parts with topic mapping
        for (const part of slugParts) {
          const lowerPart = part.toLowerCase();
          if (topicMapping[lowerPart]) {
            detectedTopic = topicMapping[lowerPart];
            break;
          }
        }

        // Also check if topics field already has a meaningful value
        if (problem.topics && problem.topics.trim().length > 0 && problem.topics !== 'null' && problem.topics !== '[]') {
          // Keep existing topic if it exists
          console.log(`⏭️  Skipping: "${problem.title}" - already has topic: ${problem.topics}`);
          skipped++;
          
          // Count topics
          topicCounts[problem.topics] = (topicCounts[problem.topics] || 0) + 1;
          continue;
        }

        // Update the problem with detected topic
        await prisma.problem.update({
          where: { id: problem.id },
          data: {
            topics: detectedTopic
          }
        });

        console.log(`✅ Updated: "${problem.title}" (${problem.slug}) → Topic: ${detectedTopic}`);
        updated++;

        // Count topics
        topicCounts[detectedTopic] = (topicCounts[detectedTopic] || 0) + 1;

      } catch (err: any) {
        console.error(`❌ Failed to update "${problem.title}": ${err.message}`);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📈 ORGANIZATION COMPLETE!');
    console.log('='.repeat(70));
    console.log(`✅ Updated: ${updated} problems`);
    console.log(`⏭️  Skipped: ${skipped} problems (already had topics)`);
    console.log(`❌ Failed: ${failed} problems`);
    console.log(`📊 Total: ${problems.length} problems`);
    console.log('\n📊 Problems Distribution by Topic:');
    console.log('='.repeat(70));

    // Sort topics by count (descending)
    const sortedTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1]);

    sortedTopics.forEach(([topic, count]) => {
      const percentage = ((count / problems.length) * 100).toFixed(1);
      console.log(`   ${topic.padEnd(30)} : ${count.toString().padStart(4)} problems (${percentage}%)`);
    });

    console.log('='.repeat(70) + '\n');

  } catch (error: any) {
    console.error('❌ Error organizing problems:', error.message);
    process.exit(1);
  }
}

organizeProblems()
  .then(() => {
    console.log('✨ Done! All problems organized successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
