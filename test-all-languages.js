const axios = require('axios');

const EXECUTION_ENGINE_URL = 'http://localhost:8001';
const API_KEY = 'adyapan-execution-engine-secret-key-2024';

// Simple test: Add two numbers
const testCases = {
  python: {
    code: `a, b = map(int, input().split())
print(a + b)`,
    input: '5 10',
    expectedOutput: '15',
  },
  javascript: {
    code: `const fs = require('fs');
const [a, b] = fs.readFileSync(0, 'utf8').trim().split(' ').map(Number);
console.log(a + b);`,
    input: '5 10',
    expectedOutput: '15',
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    input: '5 10',
    expectedOutput: '15',
  },
  java: {
    code: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}`,
    input: '5 10',
    expectedOutput: '15',
  },
};

async function testLanguage(language, testCase) {
  try {
    console.log(`\n🧪 Testing ${language.toUpperCase()}...`);
    
    const response = await axios.post(
      `${EXECUTION_ENGINE_URL}/api/execute/run`,
      {
        code: testCase.code,
        language: language,
        input: testCase.input,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        timeout: 30000,
      }
    );

    const result = response.data.data;
    const output = result.output.trim();
    const expected = testCase.expectedOutput.trim();

    if (output === expected) {
      console.log(`✅ ${language.toUpperCase()} PASSED`);
      console.log(`   Output: ${output}`);
      console.log(`   Runtime: ${result.runtime}ms`);
      console.log(`   Memory: ${result.memory}MB`);
      return true;
    } else {
      console.log(`❌ ${language.toUpperCase()} FAILED`);
      console.log(`   Expected: ${expected}`);
      console.log(`   Got: ${output}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`❌ ${language.toUpperCase()} ERROR`);
    console.log(`   ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testAllLanguages() {
  console.log('🚀 Testing All Language Runners\n');
  console.log('=' .repeat(50));

  const results = {};
  
  for (const [language, testCase] of Object.entries(testCases)) {
    results[language] = await testLanguage(language, testCase);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between tests
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 SUMMARY:');
  console.log('=' .repeat(50));

  let passCount = 0;
  for (const [language, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${language.toUpperCase().padEnd(15)} ${status}`);
    if (passed) passCount++;
  }

  console.log('='.repeat(50));
  console.log(`\n${passCount}/${Object.keys(results).length} languages working\n`);

  if (passCount === Object.keys(results).length) {
    console.log('🎉 All language runners are working correctly!\n');
  } else {
    console.log('⚠️  Some language runners need attention.\n');
  }
}

testAllLanguages().catch(console.error);
