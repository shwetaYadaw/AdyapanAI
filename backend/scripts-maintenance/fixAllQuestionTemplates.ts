import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../config/prisma';

/**
 * This script fixes ALL questions in the database by ensuring they have
 * complete, executable templates for all 4 languages with proper I/O handling.
 * 
 * The issue: Most questions use the generic fallback template which only reads
 * one line as a string and doesn't parse actual input formats.
 * 
 * The fix: Generate smart templates based on the question's inputFormat and
 * sample input/output to handle array inputs, multiple integers, etc.
 */

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Analyzes the sample input to determine the input structure
 */
function analyzeInputStructure(sampleInput: string): {
  type: 'single-array' | 'array-and-number' | 'two-arrays' | 'two-numbers' | 'multiple-lines' | 'string' | 'generic';
  description: string;
} {
  const lines = sampleInput.trim().split('\n');
  
  // Single line with numbers (array input)
  if (lines.length === 1 && /^[\d\s\-]+$/.test(lines[0])) {
    return { type: 'single-array', description: 'Single line of space-separated integers' };
  }
  
  // Two lines: array + number (common pattern)
  if (lines.length === 2 && /^[\d\s\-]+$/.test(lines[0]) && /^\d+$/.test(lines[1].trim())) {
    return { type: 'array-and-number', description: 'Array on line 1, single integer on line 2' };
  }
  
  // Two lines: both numbers (two integers)
  if (lines.length === 2 && /^\d+$/.test(lines[0].trim()) && /^\d+$/.test(lines[1].trim())) {
    return { type: 'two-numbers', description: 'Two integers on separate lines' };
  }
  
  // Two lines: both arrays
  if (lines.length === 2 && /^[\d\s\-]+$/.test(lines[0]) && /^[\d\s\-]+$/.test(lines[1])) {
    return { type: 'two-arrays', description: 'Two arrays on separate lines' };
  }
  
  // Multiple lines (matrix, etc.)
  if (lines.length > 2 && lines.every(line => /^[\d\s\-]+$/.test(line))) {
    return { type: 'multiple-lines', description: 'Multiple lines of numeric data' };
  }
  
  // String input
  if (lines.length === 1 && !/^[\d\s\-]+$/.test(lines[0])) {
    return { type: 'string', description: 'Single line string input' };
  }
  
  return { type: 'generic', description: 'Complex or mixed input format' };
}

/**
 * Generates complete templates with proper I/O handling based on input structure
 */
function generateCompleteTemplates(title: string, inputStructure: ReturnType<typeof analyzeInputStructure>) {
  const methodName = slugify(title).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  // Template for single array input (most common)
  if (inputStructure.type === 'single-array') {
    return [
      {
        language: 'python',
        code: `import sys

def ${methodName}(nums):
    # Write your solution here
    # Return the result
    return 0

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines: return
    nums = list(map(int, lines[0].split()))
    result = ${methodName}(nums)
    print(result)

if __name__ == "__main__":
    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}
const fs = require('fs');

function ${methodName}(nums) {
    // Write your solution here
    // Return the result
    return 0;
}

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const nums = input.split(/\\s+/).map(Number);
    const result = ${methodName}(nums);
    console.log(result);
}

solve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}
#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int ${methodName}(vector<int>& nums) {
    // Write your solution here
    // Return the result
    return 0;
}

int main() {
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        int val;
        vector<int> nums;
        while (ss >> val) nums.push_back(val);
        int result = ${methodName}(nums);
        cout << result << endl;
    }
    return 0;
}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}
import java.util.*;
import java.io.*;

class Main {
    public static int ${methodName}(int[] nums) {
        // Write your solution here
        // Return the result
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String[] parts = line.trim().split("\\\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int result = ${methodName}(nums);
        System.out.println(result);
    }
}`
      }
    ];
  }
  
  // Template for array + number (e.g., Two Sum, Kth element)
  if (inputStructure.type === 'array-and-number') {
    return [
      {
        language: 'python',
        code: `import sys

def ${methodName}(nums, k):
    # Write your solution here
    # Return the result
    return 0

def solve():
    lines = sys.stdin.read().splitlines()
    if len(lines) < 2: return
    nums = list(map(int, lines[0].split()))
    k = int(lines[1])
    result = ${methodName}(nums, k)
    print(result)

if __name__ == "__main__":
    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}
const fs = require('fs');

function ${methodName}(nums, k) {
    // Write your solution here
    // Return the result
    return 0;
}

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const lines = input.split(/\\r?\\n/);
    const nums = lines[0].trim().split(/\\s+/).map(Number);
    const k = parseInt(lines[1].trim());
    const result = ${methodName}(nums, k);
    console.log(result);
}

solve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}
#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int ${methodName}(vector<int>& nums, int k) {
    // Write your solution here
    // Return the result
    return 0;
}

int main() {
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        int val;
        vector<int> nums;
        while (ss >> val) nums.push_back(val);
        int k;
        if (cin >> k) {
            int result = ${methodName}(nums, k);
            cout << result << endl;
        }
    }
    return 0;
}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}
import java.util.*;
import java.io.*;

class Main {
    public static int ${methodName}(int[] nums, int k) {
        // Write your solution here
        // Return the result
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String[] parts = line.trim().split("\\\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        String kLine = br.readLine();
        if (kLine == null) return;
        int k = Integer.parseInt(kLine.trim());
        int result = ${methodName}(nums, k);
        System.out.println(result);
    }
}`
      }
    ];
  }
  
  // Template for two numbers (e.g., Space Optimization with range a, b)
  if (inputStructure.type === 'two-numbers') {
    return [
      {
        language: 'python',
        code: `import sys

def ${methodName}(a, b):
    # Write your solution here
    # Return the result
    return []

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines: return
    parts = list(map(int, lines[0].split()))
    a, b = parts[0], parts[1]
    result = ${methodName}(a, b)
    if isinstance(result, list):
        print(" ".join(map(str, result)))
    else:
        print(result)

if __name__ == "__main__":
    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}
const fs = require('fs');

function ${methodName}(a, b) {
    // Write your solution here
    // Return the result
    return [];
}

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const parts = input.split(/\\s+/).map(Number);
    const a = parts[0], b = parts[1];
    const result = ${methodName}(a, b);
    if (Array.isArray(result)) {
        console.log(result.join(' '));
    } else {
        console.log(result);
    }
}

solve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}
#include <iostream>
#include <vector>
using namespace std;

vector<int> ${methodName}(int a, int b) {
    // Write your solution here
    // Return the result
    return {};
}

int main() {
    int a, b;
    if (cin >> a >> b) {
        vector<int> result = ${methodName}(a, b);
        for (size_t i = 0; i < result.size(); i++) {
            cout << result[i] << (i == result.size() - 1 ? "" : " ");
        }
        cout << endl;
    }
    return 0;
}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}
import java.util.*;
import java.io.*;

class Main {
    public static List<Integer> ${methodName}(int a, int b) {
        // Write your solution here
        // Return the result
        return new ArrayList<>();
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String[] parts = line.trim().split("\\\\s+");
        int a = Integer.parseInt(parts[0]);
        int b = Integer.parseInt(parts[1]);
        List<Integer> result = ${methodName}(a, b);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.size(); i++) {
            sb.append(result.get(i)).append(i == result.size() - 1 ? "" : " ");
        }
        System.out.println(sb.toString());
    }
}`
      }
    ];
  }
  
  // Template for string input
  if (inputStructure.type === 'string') {
    return [
      {
        language: 'python',
        code: `import sys

def ${methodName}(s):
    # Write your solution here
    # Return the result
    return ""

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines: return
    s = lines[0].strip()
    result = ${methodName}(s)
    print(result)

if __name__ == "__main__":
    solve()`
      },
      {
        language: 'javascript',
        code: `// Solution for ${title}
const fs = require('fs');

function ${methodName}(s) {
    // Write your solution here
    // Return the result
    return "";
}

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const result = ${methodName}(input);
    console.log(result);
}

solve();`
      },
      {
        language: 'cpp',
        code: `// Solution for ${title}
#include <iostream>
#include <string>
using namespace std;

string ${methodName}(string s) {
    // Write your solution here
    // Return the result
    return "";
}

int main() {
    string s;
    if (getline(cin, s)) {
        string result = ${methodName}(s);
        cout << result << endl;
    }
    return 0;
}`
      },
      {
        language: 'java',
        code: `// Solution for ${title}
import java.util.*;
import java.io.*;

class Main {
    public static String ${methodName}(String s) {
        // Write your solution here
        // Return the result
        return "";
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String result = ${methodName}(line.trim());
        System.out.println(result);
    }
}`
      }
    ];
  }
  
  // Generic fallback - read all input as string and process
  return [
    {
      language: 'python',
      code: `import sys

def ${methodName}(input_data):
    # Write your solution here
    # Parse input_data as needed
    # Return the result
    return "0"

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines: return
    result = ${methodName}(lines)
    print(result)

if __name__ == "__main__":
    solve()`
    },
    {
      language: 'javascript',
      code: `// Solution for ${title}
const fs = require('fs');

function ${methodName}(inputData) {
    // Write your solution here
    // Parse inputData as needed
    // Return the result
    return "0";
}

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const lines = input.split(/\\r?\\n/);
    const result = ${methodName}(lines);
    console.log(result);
}

solve();`
    },
    {
      language: 'cpp',
      code: `// Solution for ${title}
#include <iostream>
#include <string>
#include <vector>
using namespace std;

string ${methodName}(vector<string>& inputData) {
    // Write your solution here
    // Parse inputData as needed
    // Return the result
    return "0";
}

int main() {
    vector<string> inputData;
    string line;
    while (getline(cin, line)) {
        inputData.push_back(line);
    }
    if (!inputData.empty()) {
        string result = ${methodName}(inputData);
        cout << result << endl;
    }
    return 0;
}`
    },
    {
      language: 'java',
      code: `// Solution for ${title}
import java.util.*;
import java.io.*;

class Main {
    public static String ${methodName}(List<String> inputData) {
        // Write your solution here
        // Parse inputData as needed
        // Return the result
        return "0";
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        List<String> inputData = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            inputData.add(line);
        }
        if (!inputData.isEmpty()) {
            String result = ${methodName}(inputData);
            System.out.println(result);
        }
    }
}`
    }
  ];
}

async function main() {
  try {
    console.log('🔧 Starting template fix for all questions...\n');
    
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        sampleInput: true,
        sampleOutput: true,
        templates: true,
        inputFormat: true
      }
    });
    
    console.log(`Found ${questions.length} questions in database\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const question of questions) {
      // Analyze input structure
      const inputStructure = analyzeInputStructure(question.sampleInput);
      
      // Check if question already has proper templates
      const existingTemplates = Array.isArray(question.templates) ? question.templates as any[] : [];
      const hasAllLanguages = existingTemplates.length === 4 &&
        existingTemplates.every((t: any) => t.code && t.code.length > 100);
      
      // Check if templates are generic (contain "inputStr" or "input_str" or return "1")
      const isGeneric = existingTemplates.some((t: any) => 
        t.code && (
          t.code.includes('inputStr') || 
          t.code.includes('input_str') || 
          (t.code.includes('return "1"') && !question.title.includes('Two Sum'))
        )
      );
      
      if (hasAllLanguages && !isGeneric) {
        console.log(`✅ SKIP: "${question.title}" - Already has complete templates`);
        skippedCount++;
        continue;
      }
      
      // Generate new templates
      const newTemplates = generateCompleteTemplates(question.title, inputStructure);
      
      // Update question
      await prisma.question.update({
        where: { id: question.id },
        data: { templates: newTemplates }
      });
      
      console.log(`✅ UPDATED: "${question.title}"`);
      console.log(`   Input type: ${inputStructure.type} - ${inputStructure.description}`);
      updatedCount++;
    }
    
    console.log(`\n✅ Template fix complete!`);
    console.log(`   Updated: ${updatedCount} questions`);
    console.log(`   Skipped: ${skippedCount} questions (already had complete templates)`);
    console.log(`   Total: ${questions.length} questions`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing templates:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
