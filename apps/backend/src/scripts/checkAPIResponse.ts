import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import axios from 'axios';

async function checkAPI() {
  try {
    console.log('🔍 Checking API response for Binary Heap Operations...\n');

    const response = await axios.get(
      'http://localhost:5000/api/questions?slug=tournament-tree-and-binary-heap-hashing'
    );

    const data = response.data;
    console.log('✅ API Response received\n');
    console.log('Status:', response.status);
    console.log('Content Type:', response.headers['content-type']);

    if (data.data && data.data.length > 0) {
      const problem = data.data[0];
      console.log('\n📋 Problem Details:');
      console.log(`Title: ${problem.title}`);
      console.log(`Slug: ${problem.slug}`);
      console.log(`\nStatement (first 300 chars):\n${(problem.statement || '').substring(0, 300)}...`);
      
      console.log(`\n\nInput Format: ${problem.inputFormat ? 'Present' : 'Missing'}`);
      console.log(`Output Format: ${problem.outputFormat ? 'Present' : 'Missing'}`);
      console.log(`Constraints: ${problem.constraints ? 'Present' : 'Missing'}`);
      
      console.log(`\n✅ API response structure looks correct`);
    } else {
      console.log('❌ No problem data in response');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', (error as any).message);
    if ((error as any).response) {
      console.error('Response status:', (error as any).response.status);
    }
    process.exit(1);
  }
}

checkAPI();
