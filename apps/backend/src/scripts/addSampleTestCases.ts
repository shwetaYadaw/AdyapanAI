import { prisma } from '../config/prisma';

async function addSampleTestCases() {
  try {
    console.log('🔍 Starting to add sample test cases to all problems...\n');

    // Get all problems without test cases
    const problems = await prisma.problem.findMany({
      include: {
        testCases: true
      }
    });

    console.log(`📊 Found ${problems.length} problems in database`);
    
    const problemsWithoutTestCases = problems.filter(p => p.testCases.length === 0);
    console.log(`⚠️  Problems without test cases: ${problemsWithoutTestCases.length}\n`);

    if (problemsWithoutTestCases.length === 0) {
      console.log('✅ All problems already have test cases!');
      return;
    }

    let addedCount = 0;

    for (const problem of problemsWithoutTestCases) {
      console.log(`\n📝 Processing: ${problem.title}`);
      console.log(`   Slug: ${problem.slug}`);
      console.log(`   Difficulty: ${problem.difficulty}`);

      // Generate generic sample test cases based on problem title and difficulty
      const testCases = generateTestCasesForProblem(problem);

      // Add test cases to database
      for (const tc of testCases) {
        await prisma.problemTestCase.create({
          data: {
            problemId: problem.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            type: tc.type
          }
        });
      }

      addedCount++;
      console.log(`   ✅ Added ${testCases.length} test cases`);

      // Add a small delay to avoid overwhelming the database
      if (addedCount % 10 === 0) {
        console.log(`\n   ⏸️  Processed ${addedCount} problems, pausing briefly...`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n\n✅ Successfully added test cases to ${addedCount} problems!`);
    console.log(`📊 Total test cases added: ${addedCount * 2} (2 per problem on average)`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Generate test cases based on problem characteristics
function generateTestCasesForProblem(problem: any): Array<{
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  type: string;
}> {
  const slug = problem.slug.toLowerCase();
  const title = problem.title.toLowerCase();

  // Pattern matching for common problem types
  
  // Array problems
  if (slug.includes('array') || slug.includes('element') || title.includes('array')) {
    return [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '5',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3\n10 20 30',
        expectedOutput: '30',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '1\n42',
        expectedOutput: '42',
        isHidden: true,
        type: 'hidden'
      }
    ];
  }

  // String problems
  if (slug.includes('string') || slug.includes('anagram') || slug.includes('palindrome')) {
    return [
      {
        input: 'hello',
        expectedOutput: 'olleh',
        isHidden: false,
        type: 'visible'
      },
      {
        input: 'world',
        expectedOutput: 'dlrow',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Tree problems
  if (slug.includes('tree') || slug.includes('bfs') || slug.includes('dfs')) {
    return [
      {
        input: '7\n1 2 3 4 5 6 7',
        expectedOutput: '1 2 3 4 5 6 7',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3\n1 2 3',
        expectedOutput: '1 2 3',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Linked List problems
  if (slug.includes('linked') || slug.includes('list')) {
    return [
      {
        input: '1 2 3 4 5',
        expectedOutput: '5 4 3 2 1',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '1',
        expectedOutput: '1',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Sorting problems
  if (slug.includes('sort') || title.includes('sort')) {
    return [
      {
        input: '5\n5 2 8 1 9',
        expectedOutput: '1 2 5 8 9',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3\n3 2 1',
        expectedOutput: '1 2 3',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Searching problems
  if (slug.includes('search') || title.includes('search') || slug.includes('binary')) {
    return [
      {
        input: '5 3\n1 2 3 4 5',
        expectedOutput: '2',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '5 7\n1 2 3 4 5',
        expectedOutput: '-1',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Graph problems
  if (slug.includes('graph') || slug.includes('path') || slug.includes('cycle')) {
    return [
      {
        input: '5 4\n1 2\n2 3\n3 4\n4 5',
        expectedOutput: '4',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3 2\n1 2\n2 3',
        expectedOutput: '2',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Math/Number problems
  if (slug.includes('number') || slug.includes('digit') || slug.includes('prime') || 
      slug.includes('factorial') || slug.includes('fibonacci')) {
    return [
      {
        input: '5',
        expectedOutput: '5',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '10',
        expectedOutput: '10',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '1',
        expectedOutput: '1',
        isHidden: true,
        type: 'hidden'
      }
    ];
  }

  // Bit manipulation
  if (slug.includes('bit') || slug.includes('xor') || slug.includes('binary')) {
    return [
      {
        input: '5',
        expectedOutput: '2',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '15',
        expectedOutput: '4',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Dynamic Programming
  if (slug.includes('climb') || slug.includes('dp') || slug.includes('subsequence')) {
    return [
      {
        input: '5',
        expectedOutput: '8',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '3',
        expectedOutput: '3',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Two Pointers / Sliding Window
  if (slug.includes('two') || slug.includes('pointer') || slug.includes('window')) {
    return [
      {
        input: '6 9\n1 2 3 4 5 6',
        expectedOutput: '2',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '4 7\n2 3 4 5',
        expectedOutput: '2',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Stack/Queue problems
  if (slug.includes('stack') || slug.includes('queue') || slug.includes('parenthes')) {
    return [
      {
        input: '(())',
        expectedOutput: 'true',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '(()',
        expectedOutput: 'false',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Matrix problems
  if (slug.includes('matrix') || slug.includes('grid') || slug.includes('2d')) {
    return [
      {
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        expectedOutput: '45',
        isHidden: false,
        type: 'visible'
      },
      {
        input: '2 2\n1 2\n3 4',
        expectedOutput: '10',
        isHidden: false,
        type: 'visible'
      }
    ];
  }

  // Default generic test cases for unknown patterns
  return [
    {
      input: '5',
      expectedOutput: 'Sample output for input 5',
      isHidden: false,
      type: 'visible'
    },
    {
      input: '10',
      expectedOutput: 'Sample output for input 10',
      isHidden: false,
      type: 'visible'
    },
    {
      input: '1',
      expectedOutput: 'Sample output for input 1',
      isHidden: true,
      type: 'hidden'
    }
  ];
}

// Run the script
addSampleTestCases();
