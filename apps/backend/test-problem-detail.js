const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/challenges/questions/find-all-duplicates-in-an-array-tcs-nqt',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const problem = parsed.data;
      
      if (problem) {
        console.log('✅ Problem detail found!');
        console.log('Title:', problem.title);
        console.log('Difficulty:', problem.difficulty);
        console.log('Statement preview:', problem.statement?.substring(0, 100) + '...');
        console.log('Test cases count:', problem.testCases?.length || 0);
        if (problem.testCases) {
          console.log('Visible test cases:', problem.testCases.filter(t => !t.isHidden).length);
          console.log('Hidden test cases:', problem.testCases.filter(t => t.isHidden).length);
        }
      } else {
        console.log('❌ Problem detail NOT found');
        console.log('Response:', parsed);
      }
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.end();
