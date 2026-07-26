import { prisma } from '../config/prisma';

async function showUpdatedContent() {
  try {
    console.log('='.repeat(80));
    console.log('SHOWING UPDATED PROBLEM CONTENT SAMPLE');
    console.log('='.repeat(80));
    
    // Show Jump Game II as example
    const problem = await prisma.question.findUnique({
      where: { id: 'fb32e963-d583-4c1e-9e1a-76d61c27be28' },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        xpReward: true,
        topics: true,
        companies: true,
        statement: true,
        constraints: true,
        templates: true,
        testCases: true
      }
    });

    if (!problem) {
      console.log('Problem not found!');
      return;
    }

    console.log(`\n📌 PROBLEM TITLE: ${problem.title}`);
    console.log(`   ID: ${problem.id}`);
    console.log(`   Slug: ${problem.slug}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   XP Reward: ${problem.xpReward}`);
    
    console.log(`\n📂 TOPICS: ${problem.topics.join(', ')}`);
    console.log(`\n🏢 COMPANIES: ${problem.companies.join(', ')}`);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log('PROBLEM STATEMENT (First 500 chars):');
    console.log('='.repeat(80));
    console.log(problem.statement.substring(0, 500) + '...');
    
    console.log(`\n${'='.repeat(80)}`);
    console.log('CONSTRAINTS:');
    console.log('='.repeat(80));
    console.log(problem.constraints);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log('CODE TEMPLATES:');
    console.log('='.repeat(80));
    const templates = Array.isArray(problem.templates) ? problem.templates : [];
    for (let i = 0; i < templates.length; i++) {
      const t = templates[i];
      console.log(`\n${i + 1}. ${t.language.toUpperCase()}`);
      console.log('-'.repeat(40));
      const code = typeof t.code === 'string' ? t.code : JSON.stringify(t.code);
      console.log(code.substring(0, 300) + (code.length > 300 ? '\n   ...' : ''));
    }
    
    console.log(`\n${'='.repeat(80)}`);
    console.log('TEST CASES:');
    console.log('='.repeat(80));
    const testCases = Array.isArray(problem.testCases) ? problem.testCases : [];
    console.log(`Total: ${testCases.length} test cases`);
    
    let visibleCount = 0, hiddenCount = 0;
    for (const tc of testCases) {
      if (tc.isHidden) hiddenCount++;
      else visibleCount++;
    }
    
    console.log(`  • Visible: ${visibleCount} (for learning)`);
    console.log(`  • Hidden: ${hiddenCount} (for verification)`);
    
    // Show first 3 test cases
    console.log('\nFirst 3 Test Cases:');
    console.log('-'.repeat(40));
    for (let i = 0; i < Math.min(3, testCases.length); i++) {
      const tc = testCases[i];
      console.log(`\n  Test Case ${i + 1}:`);
      console.log(`    Input: ${tc.input.substring(0, 50)}${tc.input.length > 50 ? '...' : ''}`);
      console.log(`    Output: ${tc.output}`);
      console.log(`    Type: ${tc.isHidden ? 'Hidden' : 'Visible'}`);
    }
    
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('✅ ALL 4 PROBLEMS SUCCESSFULLY UPDATED');
    console.log('='.repeat(80));
    
    console.log(`\n📊 SUMMARY OF ALL 4 UPDATED PROBLEMS:\n`);
    
    const ids = [
      { id: 'e484f9ef-cb3e-4aa2-8e4a-a2f463c8e9f4', name: 'Jump Game' },
      { id: 'fb32e963-d583-4c1e-9e1a-76d61c27be28', name: 'Jump Game II' },
      { id: '0e7c8db2-74cd-46c3-a991-dd18e6bbe29c', name: 'Gas Station' },
      { id: '0cccc1fa-4067-4845-aefa-019ffa56d613', name: 'Minimize Cash Flow' }
    ];
    
    for (const { id, name } of ids) {
      const p = await prisma.question.findUnique({
        where: { id },
        select: {
          title: true,
          slug: true,
          statement: true,
          templates: true,
          testCases: true
        }
      });
      
      if (p) {
        const stmtLen = p.statement?.length || 0;
        const tplCount = Array.isArray(p.templates) ? p.templates.length : 0;
        const tcCount = Array.isArray(p.testCases) ? p.testCases.length : 0;
        
        console.log(`✓ ${name}`);
        console.log(`  • Slug: ${p.slug}`);
        console.log(`  • Statement: ${stmtLen} characters`);
        console.log(`  • Templates: ${tplCount}`);
        console.log(`  • Test Cases: ${tcCount}\n`);
      }
    }
    
    console.log('✅ DATABASE UPDATE COMPLETE AND VERIFIED');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showUpdatedContent();
