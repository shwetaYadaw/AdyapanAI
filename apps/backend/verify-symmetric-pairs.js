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
  console.log('🔧 Verifying Symmetric pairs in an array problem...\n');

  // Check for old problem
  const oldResult = await makeRequest('/api/v1/challenges/questions/find-all-symmetric-pairs-in-array-tcs-nqt', 'Old problem check');
  
  // Check for new problem
  const newResult = await makeRequest('/api/v1/challenges/questions/symmetric-pairs-in-an-array-tcs-nqt', 'New problem check');

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
    console.log('📝 Sample Input (first 40 chars):', problem.sampleInput?.substring(0, 40));
    console.log('📝 Sample Output:', problem.sampleOutput);
    console.log('🧪 Test Cases Count:', problem.testCases?.length || 0);
    
    if (problem.testCases) {
      const visible = problem.testCases.filter(t => !t.isHidden).length;
      const hidden = problem.testCases.filter(t => t.isHidden).length;
      console.log(`📋 Test Cases: ${visible} visible, ${hidden} hidden`);
      console.log('\nTest case details:');
      problem.testCases.forEach((tc, i) => {
        const visibility = tc.isHidden ? 'hidden' : 'visible';
        const inputPreview = tc.input.split('\n')[0];
        console.log(`  ${i + 1}. Input lines: ${tc.input.split('\n').length}, Output: [${tc.output.substring(0, 30)}...] (${visibility})`);
      });
    }
  } else {
    console.log('\n❌ New problem NOT found');
  }
}

verify();
