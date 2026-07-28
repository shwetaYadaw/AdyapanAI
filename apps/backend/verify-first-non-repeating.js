const http = require('http');

function makeRequest(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ ...parsed, description });
        } catch (e) {
          resolve({ error: e.message, description });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ error: e.message, description });
    });

    req.end();
  });
}

async function verify() {
  console.log('🔧 Verifying First Non-Repeating Element problem...\n');

  // Check for old problem
  const oldResult = await makeRequest('/api/v1/challenges/questions/find-all-non-repeating-elements-in-an-array-tcs-nqt', 'Old problem check');
  
  // Check for new problem
  const newResult = await makeRequest('/api/v1/challenges/questions/first-non-repeating-element-tcs-nqt', 'New problem check');

  if (oldResult.data) {
    console.log('⚠️  Old problem still exists! Need to delete it.');
  } else {
    console.log('✅ Old problem successfully removed (expected 404 or no data)');
  }

  if (newResult.data) {
    const problem = newResult.data;
    console.log('\n✅ New problem found!');
    console.log('📝 Title:', problem.title);
    console.log('📝 Difficulty:', problem.difficulty);
    console.log('📝 Sample Input:', problem.sampleInput?.substring(0, 30) + '...');
    console.log('📝 Sample Output:', problem.sampleOutput);
    console.log('🧪 Test Cases Count:', problem.testCases?.length || 0);
    
    if (problem.testCases) {
      console.log('📋 Test Cases:');
      problem.testCases.forEach((tc, i) => {
        const visibility = tc.isHidden ? 'hidden' : 'visible';
        console.log(`  ${i + 1}. Input: [${tc.input.split('\\n')[1]?.substring(0, 20)}] → Output: [${tc.output}] (${visibility})`);
      });
    }
  } else {
    console.log('\n❌ New problem NOT found');
  }
}

verify();
