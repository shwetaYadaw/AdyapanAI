const http = require('http');

function makeRequest(path) {
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
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ error: e.message });
    });

    req.end();
  });
}

async function verify() {
  console.log('🔧 Verifying Sort array according to order problem...\n');

  // Check for the problem
  const result = await makeRequest('/api/v1/challenges/questions/sort-an-array-according-to-the-order-defined-by-another-array-tcs-nqt');

  if (result.data) {
    const problem = result.data;
    console.log('✅ Problem found!');
    console.log('📝 Title:', problem.title);
    console.log('📝 Difficulty:', problem.difficulty);
    console.log('📝 Sample Input (first 35 chars):', problem.sampleInput?.substring(0, 35));
    console.log('📝 Sample Output:', problem.sampleOutput);
    console.log('🧪 Test Cases Count:', problem.testCases?.length || 0);
    
    if (problem.testCases) {
      const visible = problem.testCases.filter(t => !t.isHidden).length;
      const hidden = problem.testCases.filter(t => t.isHidden).length;
      console.log(`📋 Test Cases: ${visible} visible, ${hidden} hidden\n`);
      
      console.log('Test case examples:');
      problem.testCases.slice(0, 3).forEach((tc, i) => {
        const outputPreview = tc.output.length > 25 ? tc.output.substring(0, 25) + '...' : tc.output;
        console.log(`  ${i + 1}. Output: [${outputPreview}] (visible)`);
      });
      if (problem.testCases.length > 3) {
        console.log(`  ... ${problem.testCases.length - 3} more hidden test cases`);
      }
    }
  } else {
    console.log('❌ Problem NOT found');
  }
}

verify();
