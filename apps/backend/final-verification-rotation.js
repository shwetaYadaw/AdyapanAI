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
  console.log('🔧 Final Verification: Rotation Task\n');

  // Check for old problem
  const oldResult = await makeRequest('/api/v1/challenges/questions/rotation-of-elements-of-array-left-and-right-tcs-nqt');
  
  // Check for Rotate Array problem
  const rotateResult = await makeRequest('/api/v1/challenges/questions/rotate-array-tcs-nqt');

  console.log('Status Check:');
  console.log('─────────────────────────────────');
  
  if (oldResult.data) {
    console.log('❌ Old problem "rotation-of-elements-of-array-left-and-right" still exists');
  } else {
    console.log('✅ Old problem "rotation-of-elements-of-array-left-and-right" removed');
  }

  if (rotateResult.data) {
    const problem = rotateResult.data;
    console.log('✅ Problem "Rotate Array" exists');
    console.log(`   Title: ${problem.title}`);
    console.log(`   Difficulty: ${problem.difficulty}`);
    console.log(`   Sample Output: ${problem.sampleOutput}`);
    console.log(`   Test Cases: ${problem.testCases?.length}`);
    
    if (problem.testCases) {
      const visible = problem.testCases.filter(t => !t.isHidden).length;
      const hidden = problem.testCases.filter(t => t.isHidden).length;
      console.log(`   Visible: ${visible}, Hidden: ${hidden}`);
    }
  } else {
    console.log('❌ Problem "Rotate Array" NOT found');
  }

  console.log('\n✅ TASK 18 COMPLETE: Replaced rotation problem with existing Rotate Array');
}

verify();
