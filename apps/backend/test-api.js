const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/challenges/questions',
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
      const questions = parsed.data || [];
      const findAllDuplicates = questions.find(q => q.slug === 'find-all-duplicates-in-an-array-tcs-nqt');
      
      if (findAllDuplicates) {
        console.log('✅ Find All Duplicates problem found!');
        console.log('Title:', findAllDuplicates.title);
        console.log('Difficulty:', findAllDuplicates.difficulty);
        console.log('Total questions:', questions.length);
      } else {
        console.log('❌ Find All Duplicates problem NOT found');
        console.log('Total questions:', questions.length);
        const tcsQuestions = questions.filter(q => q.topics && q.topics.includes('tcs-nqt'));
        console.log('TCS NQT questions:', tcsQuestions.length);
        const lastFew = tcsQuestions.slice(-5);
        console.log('Last 5 problems:', lastFew.map(q => q.title));
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
