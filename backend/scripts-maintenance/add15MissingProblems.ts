/**
 * Add 15 Missing Common DSA Problems
 * 
 * This script adds the 15 missing problems that should be in Problem table
 * These are standard DSA problems with complete problem statements
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

const MISSING_PROBLEMS = [
  {
    title: 'Replace O\'s with X\'s',
    slug: 'replace-os-with-xs',
    difficulty: 'medium',
    statement: 'Given a 2D board containing \'X\' and \'O\', capture all regions surrounded by \'X\'. A region is captured by flipping all \'O\'s into \'X\'s in that surrounded region.',
    constraints: '1 <= board.length, board[0].length <= 200\nboard[i][j] is \'X\' or \'O\'',
    inputFormat: 'First line contains board dimensions m and n. Next m lines contain n characters each.',
    outputFormat: 'Modified board with surrounded regions captured.',
    topics: '2d-arrays,dfs-bfs,matrix',
    companies: 'Amazon,Microsoft,Google',
  },
  {
    title: 'Activity Selection Problem',
    slug: 'activity-selection-problem',
    difficulty: 'medium',
    statement: 'Given n activities with their start and finish times. Select the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time.',
    constraints: '1 <= n <= 10^5\n0 <= start[i] < finish[i] <= 10^9',
    inputFormat: 'First line contains n. Second line contains n start times. Third line contains n finish times.',
    outputFormat: 'Maximum number of activities that can be performed.',
    topics: 'greedy,sorting',
    companies: 'Google,Amazon,Adobe',
  },
  {
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'easy',
    statement: 'Given a non-empty array of integers where every element appears twice except for one. Find that single element.',
    constraints: '1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element appears twice except for one',
    inputFormat: 'First line contains n. Second line contains n space-separated integers.',
    outputFormat: 'The element that appears only once.',
    topics: 'bit-manipulation,arrays',
    companies: 'Amazon,Microsoft,Apple',
  },
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists',
    inputFormat: 'First line contains n. Second line contains n space-separated integers. Third line contains target.',
    outputFormat: 'Two space-separated indices (0-indexed) of numbers that add up to target.',
    topics: 'arrays,hashing,two-pointers',
    companies: 'Google,Amazon,Microsoft,Facebook,Apple',
  },
  {
    title: 'Generate Parentheses',
    slug: 'generate-parentheses',
    difficulty: 'medium',
    statement: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    constraints: '1 <= n <= 8',
    inputFormat: 'Single integer n.',
    outputFormat: 'All combinations of well-formed parentheses, one per line.',
    topics: 'recursion-backtracking,strings',
    companies: 'Google,Amazon,Microsoft',
  },
  {
    title: 'Binary Tree Level Order Traversal (Reverse)',
    slug: 'reverse-level-order-traversal',
    difficulty: 'medium',
    statement: 'Given the root of a binary tree, return the bottom-up level order traversal of its nodes\' values (i.e., from left to right, level by level from leaf to root).',
    constraints: 'Number of nodes in the tree is in the range [0, 2000]\n-1000 <= Node.val <= 1000',
    inputFormat: 'First line contains space-separated node values in level order (use -1 for null).',
    outputFormat: 'Reverse level order traversal, each level on a new line.',
    topics: 'trees,bfs',
    companies: 'Amazon,Microsoft',
  },
  {
    title: 'Implement Two Stacks in an Array',
    slug: 'implement-two-stacks-in-an-array',
    difficulty: 'easy',
    statement: 'Design a data structure to implement two stacks using a single array. The two stacks should be able to grow in opposite directions.',
    constraints: '1 <= capacity <= 10^4\n1 <= operations <= 10^5',
    inputFormat: 'First line contains capacity. Following lines contain operations: push1/push2/pop1/pop2.',
    outputFormat: 'For each pop operation, output the popped element or -1 if stack is empty.',
    topics: 'stack,arrays,design',
    companies: 'Google,Amazon',
  },
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    difficulty: 'easy',
    statement: 'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    constraints: 'Number of nodes in the tree is in the range [0, 10^4]\n-100 <= Node.val <= 100',
    inputFormat: 'Space-separated node values in level order (use -1 for null).',
    outputFormat: 'Maximum depth of the tree.',
    topics: 'trees,dfs,recursion',
    companies: 'Amazon,Microsoft,Apple',
  },
  {
    title: 'Maximum and Minimum Element in an Array',
    slug: 'maximum-and-minimum-element-in-an-array',
    difficulty: 'easy',
    statement: 'Given an array of integers, find the maximum and minimum elements in the array.',
    constraints: '1 <= n <= 10^5\n-10^9 <= arr[i] <= 10^9',
    inputFormat: 'First line contains n. Second line contains n space-separated integers.',
    outputFormat: 'Two space-separated integers: minimum and maximum.',
    topics: 'arrays,searching',
    companies: 'Amazon,Microsoft',
  },
  {
    title: 'Delete Node in Linked List without Head Pointer',
    slug: 'delete-without-head-node',
    difficulty: 'easy',
    statement: 'You are given a pointer/reference to a node to be deleted in a linked list. Delete the node. Note that you are not given access to the head of the list.',
    constraints: 'The list contains at least two nodes\nThe given node is not the tail of the list',
    inputFormat: 'First line contains space-separated linked list values. Second line contains value of node to delete.',
    outputFormat: 'Modified linked list after deletion.',
    topics: 'linked-list',
    companies: 'Amazon,Microsoft',
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'easy',
    statement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word.',
    constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters',
    inputFormat: 'Two lines, each containing a string.',
    outputFormat: 'true or false',
    topics: 'strings,hashing,sorting',
    companies: 'Amazon,Microsoft,Google',
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'easy',
    statement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: 'Number of nodes in the list is in the range [0, 5000]\n-5000 <= Node.val <= 5000',
    inputFormat: 'Space-separated values of linked list nodes.',
    outputFormat: 'Reversed linked list values.',
    topics: 'linked-list,recursion',
    companies: 'Amazon,Microsoft,Apple,Google',
  },
  {
    title: 'Breadth First Search (BFS)',
    slug: 'bfs-traversal',
    difficulty: 'easy',
    statement: 'Given a graph represented as an adjacency list and a starting vertex, perform Breadth First Search traversal and return the order of visited vertices.',
    constraints: '1 <= V <= 10^4\n0 <= E <= 10^5',
    inputFormat: 'First line contains V and E. Next E lines contain edges u v. Last line contains starting vertex.',
    outputFormat: 'Space-separated vertices in BFS order.',
    topics: 'graphs,bfs,queue',
    companies: 'Google,Amazon,Microsoft',
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'easy',
    statement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    constraints: '1 <= n <= 45',
    inputFormat: 'Single integer n.',
    outputFormat: 'Number of distinct ways to climb to the top.',
    topics: 'dynamic-programming,recursion',
    companies: 'Amazon,Microsoft,Google,Adobe',
  },
  {
    title: 'Count Set Bits in an Integer',
    slug: 'count-set-bits-in-an-integer',
    difficulty: 'easy',
    statement: 'Write a function that takes an unsigned integer and returns the number of \'1\' bits it has (also known as the Hamming weight).',
    constraints: '1 <= n <= 2^31 - 1',
    inputFormat: 'Single integer n.',
    outputFormat: 'Number of set bits (1s) in binary representation.',
    topics: 'bit-manipulation',
    companies: 'Amazon,Microsoft,Apple',
  },
];

async function add15Problems() {
  const pool = new Pool({ connectionString });

  try {
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║              Add 15 Missing DSA Problems                           ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    let addedCount = 0;
    let skippedCount = 0;

    for (const problem of MISSING_PROBLEMS) {
      try {
        // Check if already exists
        const existing = await pool.query(
          'SELECT id FROM "Problem" WHERE slug = $1',
          [problem.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipped: "${problem.title}" (already exists)`);
          skippedCount++;
          continue;
        }

        // Insert problem
        await pool.query(`
          INSERT INTO "Problem" (
            id, title, slug, difficulty, statement, constraints,
            "inputFormat", "outputFormat", "timeLimit", "memoryLimit",
            "starterCode", "referenceSolution", topics, companies,
            "createdAt", "updatedAt"
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 2000, 256,
            '{}', '', $8, $9, NOW(), NOW()
          )
        `, [
          problem.title,
          problem.slug,
          problem.difficulty,
          problem.statement,
          problem.constraints,
          problem.inputFormat,
          problem.outputFormat,
          problem.topics,
          problem.companies,
        ]);

        console.log(`✅ Added: "${problem.title}"`);
        addedCount++;

      } catch (error: any) {
        console.error(`❌ Failed: "${problem.title}" - ${error.message}`);
      }
    }

    console.log('\n' + '═'.repeat(70));
    console.log('RESULTS:');
    console.log('═'.repeat(70));
    console.log(`✅ Successfully added:  ${addedCount}`);
    console.log(`⏭️  Skipped (existing): ${skippedCount}`);
    console.log(`📊 Total problems now:  ${421 + addedCount}`);
    console.log('═'.repeat(70));

    // Verify final count
    const finalCount = await pool.query('SELECT COUNT(*) FROM "Problem"');
    console.log(`\n📊 Problem table now has: ${finalCount.rows[0].count} problems`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

add15Problems()
  .then(() => {
    console.log('\n🎉 Successfully added missing problems!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to add problems:', error);
    process.exit(1);
  });
