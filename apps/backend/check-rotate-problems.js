const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/challenges/questions',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const questions = parsed.data || [];
      
      console.log('🔍 Searching for Rotate Array problems...\n');
      
      const rotateProblems = questions.filter(q => 
        q.slug && q.slug.includes('rotate') && q.topics?.includes('tcs-nqt')
      );
      
      console.log(`Found ${rotateProblems.length} rotate-related TCS NQT problems:\n`);
      rotateProblems.forEach(q => {
        console.log(`  - ${q.slug}`);
        console.log(`    Title: ${q.title}`);
        console.log(`    Difficulty: ${q.difficulty}\n`);
      });
      
    } catch (e) {
      console.error('Error:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.end();
