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
  console.log('🔧 Verifying Check if array is subset problem...\n');

  // Check for old problem
  const oldResult = await makeRequest('/api/v1/challenges/questions/check-if-array-is-a-subset-of-another-array-or-not-tcs-nqt');
  
  // Check for new problem
  const newResult = await makeRequest('/api/v1/challenges/questions/check-if-an-array-is-subset-of-another-array-tcs-nqt');

  if (oldResult.data) {
    console.log('⚠️  Old problem still exists!');
  } else {
    console.log('✅ Old problem successfully removed');
  }

  if (newResult.data) {
    const problem = newResult.data;
    console.log('\n✅ New problem found!');
    console.log('📝 Title:', problem.title);
    console.log('📝 Difficulty:', problem.difficulty);
    console.log('📝 Sample Output:', problem.sampleOutput);
    console.log('🧪 Test Cases Count:', problem.testCases?.length || 0);
    
    if (problem.testCases) {
      const visible = problem.testCases.filter(t => !t.isHidden).length;
      const hidden = problem.testCases.filter(t => t.isHidden).length;
      console.log(`📋 Test Cases: ${visible} visible, ${hidden} hidden\n`);
      
      console.log('Test case examples:');
      problem.testCases.slice(0, 3).forEach((tc, i) => {
        const lines = tc.input.split('\n');
        const aArr = lines[1];
        const bArr = lines[3];
        console.log(`  ${i + 1}. a[]=[${aArr?.substring(0, 20)}...], b[]=[${bArr?.substring(0, 20)}...] → ${tc.output} (visible)`);
      });
      if (problem.testCases.length > 3) {
        console.log(`  ... ${problem.testCases.length - 3} more hidden test cases`);
      }
    }
  } else {
    console.log('\n❌ New problem NOT found');
  }
}

verify();
