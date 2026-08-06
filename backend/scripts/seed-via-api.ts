import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Seed data - simple problems
const topicsWithProblems: any = {
  'Sorting Techniques': [
    {
      title: 'Merge Sort Implementation',
      difficulty: 'medium',
      statement: 'Implement merge sort and sort an array of integers.',
      inputFormat: 'First line: n (array size), second line: n space-separated integers',
      outputFormat: 'Sorted array elements space-separated',
      constraints: '1 <= n <= 10^5, -10^9 <= arr[i] <= 10^9',
      companies: 'Google,Amazon,Microsoft,Meta,Apple',
      starterCode: 'def mergeSort(arr):\n    pass'
    }
  ],
  'Arrays': [
    {
      title: 'Two Sum',
      difficulty: 'easy',
      statement: 'Given array and target, find two numbers that add to target.',
      inputFormat: 'First line: n, second line: array, third line: target',
      outputFormat: 'Two indices',
      constraints: '2 <= n <= 10^4',
      companies: 'Google,Amazon,Microsoft,Meta',
      starterCode: 'def twoSum(nums, target):\n    pass'
    }
  ]
};

async function seedViaAPI() {
  const baseURL = 'http://localhost:5000';

  console.log('🌱 Seeding problems via API...\n');

  let totalCreated = 0;

  for (const [topicName, problems] of Object.entries(topicsWithProblems)) {
    console.log(`📚 Topic: ${topicName}`);
    console.log(`   Adding ${problems.length} problems...`);

    for (const problem of problems as any[]) {
      try {
        const slug = problem.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');

        const payload = {
          title: problem.title,
          difficulty: problem.difficulty,
          statement: problem.statement,
          inputFormat: problem.inputFormat,
          outputFormat: problem.outputFormat,
          constraints: problem.constraints,
          companies: problem.companies,
          topic: topicName,
          referenceSolution: 'Sample solution',
          testCases: []
        };

        // Make API call to create problem
        const response = await axios.post(`${baseURL}/admin/coding-arena`, payload, {
          headers: {
            'Content-Type': 'application/json',
            // Add auth header if needed
          }
        });

        console.log(`   ✅ ${problem.title}`);
        totalCreated++;
      } catch (err: any) {
        console.log(`   ❌ ${problem.title}: ${err.response?.data?.message || err.message}`);
      }
    }
  }

  console.log(`\n✨ Total created: ${totalCreated}`);
}

seedViaAPI()
  .then(() => {
    console.log('✅ Seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  });
