# Dual Execution Mode System - Technical Design

## 1. Overview

This document outlines the technical design for implementing a dual execution mode system in Adyapan AI that supports both **Full Program Mode** and **Function Mode** for coding challenges.

### 1.1 Problem Statement

Currently, the platform only supports Full Program Mode where students must write complete programs with:
- Input reading logic (Scanner, BufferedReader, input(), etc.)
- Main function/entry point
- Output printing logic

This approach has limitations:
- Students spend time on boilerplate I/O code instead of focusing on problem-solving
- Different I/O methods cause confusion (Scanner vs BufferedReader in Java)
- Template mismatches lead to runtime errors
- Not beginner-friendly

### 1.2 Solution Goals

1. **Dual Mode Support**: Allow questions to be configured as either Full Program or Function Mode
2. **Mode Detection**: System determines mode from question configuration, not user code
3. **Language Agnostic**: Works across Python, JavaScript, Java, C++
4. **Backward Compatible**: Existing questions continue working without changes
5. **Single Judge**: Same execution engine and judge handles both modes
6. **Flexible Validation**: Accept any correct solution approach (sorting, heap, recursion, etc.)
7. **Production Ready**: Scalable architecture for deployment

---

## 2. High-Level Architecture

### 2.1 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  - Code Editor                                               │
│  - Mode Display (Full Program / Function Only)              │
│  - Template Provider                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                       │
│  - Question Service (returns executionMode)                  │
│  - Template Generator (mode-aware)                           │
│  - Submission Handler                                        │
│  - Test Case Generator                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Execution Engine (Docker Service)               │
│  - Mode Detector                                             │
│  - Wrapper Generator (for Function Mode)                     │
│  - Docker Container Executor                                 │
│  - Output Comparator                                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Execution Flow Comparison

#### Full Program Mode
```
User Code → Docker Container → Execute Directly → Compare Output
```

#### Function Mode
```
User Code → Wrapper Injection → Combined Code → Docker Container → Execute → Extract Output → Compare
```

---

## 3. Database Schema Changes

### 3.1 Question Model Extension

Add `executionMode` field to Question model:

```prisma
model Question {
  id            String   @id @default(uuid())
  title         String
  slug          String   @unique
  statement     String   @db.Text
  difficulty    String   @default("easy")
  
  // NEW FIELD
  executionMode String   @default("full-program") // "full-program" | "function"
  
  // Function Mode specific fields
  functionSignature Json?  // { python: "def solution(arr, k):", java: "public static int solution(int[] arr, int k)", ... }
  parameterTypes    Json?  // { params: [{name: "arr", type: "array<int>"}, {name: "k", type: "int"}], returnType: "int" }
  
  // Existing fields
  topics        Json
  companies     Json
  timeLimit     Int      @default(2000)
  memoryLimit   Int      @default(256)
  inputFormat   String   @db.Text
  outputFormat  String   @db.Text
  constraints   String   @db.Text
  sampleInput   String   @db.Text
  sampleOutput  String   @db.Text
  templates     Json
  testCases     Json
  xpReward      Int      @default(10)
  submissions   Submission[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### 3.2 Migration Strategy

1. Add new fields with default values (`executionMode = "full-program"`)
2. Existing 544 questions remain in Full Program Mode
3. New questions can be created in either mode
4. Existing questions can be converted to Function Mode later

---

## 4. Low-Level Design

### 4.1 Execution Mode Enum

```typescript
// apps/backend/src/types/execution.types.ts
export enum ExecutionMode {
  FULL_PROGRAM = 'full-program',
  FUNCTION = 'function'
}

export interface FunctionSignature {
  python?: string;    // "def solution(arr: List[int], k: int) -> int:"
  javascript?: string; // "function solution(arr, k) {"
  java?: string;      // "public static int solution(int[] arr, int k)"
  cpp?: string;       // "int solution(vector<int>& arr, int k)"
}

export interface ParameterDefinition {
  name: string;
  type: 'int' | 'float' | 'string' | 'boolean' | 'array<int>' | 'array<float>' | 'array<string>' | 'matrix<int>' | 'tree' | 'graph';
  description?: string;
}

export interface FunctionMetadata {
  params: ParameterDefinition[];
  returnType: string;
  functionName: string; // default: "solution"
}
```

### 4.2 Wrapper Generator Service

The wrapper generator creates I/O handling code that wraps the user's function.

```typescript
// apps/execution-engine/src/services/wrapper.service.ts
export class WrapperService {
  /**
   * Generate wrapper code for Function Mode execution
   */
  generateWrapper(
    userCode: string,
    language: string,
    functionMetadata: FunctionMetadata,
    testInput: string
  ): string {
    switch (language) {
      case 'python':
        return this.generatePythonWrapper(userCode, functionMetadata, testInput);
      case 'javascript':
        return this.generateJavaScriptWrapper(userCode, functionMetadata, testInput);
      case 'java':
        return this.generateJavaWrapper(userCode, functionMetadata, testInput);
      case 'cpp':
        return this.generateCppWrapper(userCode, functionMetadata, testInput);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private generatePythonWrapper(
    userCode: string,
    metadata: FunctionMetadata,
    testInput: string
  ): string {
    const { params, returnType, functionName } = metadata;
    
    // Generate input parsing logic
    const inputParser = this.generatePythonInputParser(params);
    
    // Generate function call
    const paramNames = params.map(p => p.name).join(', ');
    
    return `
${userCode}

# Platform-generated wrapper code
if __name__ == "__main__":
    import sys
    ${inputParser}
    result = ${functionName}(${paramNames})
    print(result)
`;
  }

  private generatePythonInputParser(params: ParameterDefinition[]): string {
    let parser = '';
    for (const param of params) {
      if (param.type === 'array<int>') {
        parser += `${param.name} = list(map(int, input().split()))\n    `;
      } else if (param.type === 'int') {
        parser += `${param.name} = int(input().strip())\n    `;
      } else if (param.type === 'string') {
        parser += `${param.name} = input().strip()\n    `;
      } else if (param.type === 'array<string>') {
        parser += `${param.name} = input().split()\n    `;
      }
      // Add more type handlers as needed
    }
    return parser.trim();
  }

  private generateJavaWrapper(
    userCode: string,
    metadata: FunctionMetadata,
    testInput: string
  ): string {
    const { params, returnType, functionName } = metadata;
    
    // Detect user's class name
    const classMatch = userCode.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Solution';
    
    const inputParser = this.generateJavaInputParser(params);
    const functionCall = this.generateJavaFunctionCall(className, functionName, params, returnType);
    
    return `
import java.io.*;
import java.util.*;

${userCode}

// Platform-generated wrapper code
class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        ${inputParser}
        ${functionCall}
        System.out.println(result);
    }
}
`;
  }

  private generateJavaInputParser(params: ParameterDefinition[]): string {
    let parser = '';
    for (const param of params) {
      if (param.type === 'array<int>') {
        parser += `String[] ${param.name}Str = br.readLine().split(" ");\n        `;
        parser += `int[] ${param.name} = Arrays.stream(${param.name}Str).mapToInt(Integer::parseInt).toArray();\n        `;
      } else if (param.type === 'int') {
        parser += `int ${param.name} = Integer.parseInt(br.readLine().trim());\n        `;
      } else if (param.type === 'string') {
        parser += `String ${param.name} = br.readLine().trim();\n        `;
      }
    }
    return parser.trim();
  }

  private generateJavaFunctionCall(
    className: string,
    functionName: string,
    params: ParameterDefinition[],
    returnType: string
  ): string {
    const paramNames = params.map(p => p.name).join(', ');
    return `${className} solution = new ${className}();\n        ${returnType} result = solution.${functionName}(${paramNames});`;
  }

  // Similar methods for JavaScript and C++
}
```

### 4.3 Template Generator Update

Update template generator to provide mode-aware templates:

```typescript
// apps/backend/src/services/template.service.ts
export class TemplateService {
  generateTemplate(
    question: Question,
    language: string
  ): string {
    if (question.executionMode === ExecutionMode.FUNCTION) {
      return this.generateFunctionTemplate(question, language);
    } else {
      return this.generateFullProgramTemplate(question, language);
    }
  }

  private generateFunctionTemplate(
    question: Question,
    language: string
  ): string {
    const signatures = question.functionSignature as FunctionSignature;
    const metadata = question.parameterTypes as FunctionMetadata;
    
    switch (language) {
      case 'python':
        return `from typing import List

${signatures.python || 'def solution(arr: List[int]) -> int:'}
    # Write your code here
    pass
`;
      
      case 'java':
        return `class Solution {
    ${signatures.java || 'public static int solution(int[] arr) {'}
        // Write your code here
        return 0;
    }
}
`;
      
      case 'javascript':
        return `${signatures.javascript || 'function solution(arr) {'}
    // Write your code here
    return 0;
}
`;
      
      case 'cpp':
        return `#include <vector>
using namespace std;

${signatures.cpp || 'int solution(vector<int>& arr) {'}
    // Write your code here
    return 0;
}
`;
    }
  }

  private generateFullProgramTemplate(
    question: Question,
    language: string
  ): string {
    // Existing template generation logic (from autoFixAllTemplates.ts)
    // Analyzes test cases and generates appropriate I/O templates
    return this.analyzeAndGenerateTemplate(question, language);
  }
}
```

### 4.4 Execution Engine Modification

Update DockerService to handle both modes:

```typescript
// apps/execution-engine/src/services/docker.service.ts
export class DockerService {
  async executeCode(
    code: string,
    language: LanguageConfig,
    input: string,
    expectedOutput?: string,
    timeLimit?: number,
    memoryLimit?: number,
    executionMode?: ExecutionMode,
    functionMetadata?: FunctionMetadata
  ): Promise<ExecutionResult> {
    
    let finalCode = code;
    
    // If Function Mode, wrap user code with I/O handler
    if (executionMode === ExecutionMode.FUNCTION && functionMetadata) {
      const wrapperService = new WrapperService();
      finalCode = wrapperService.generateWrapper(
        code,
        language.id,
        functionMetadata,
        input
      );
    }
    
    // Rest of the execution logic remains the same
    return this.executeInDocker(finalCode, language, input, expectedOutput, timeLimit, memoryLimit);
  }
  
  private async executeInDocker(
    code: string,
    language: LanguageConfig,
    input: string,
    expectedOutput?: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    // Existing Docker execution logic
    // No changes needed - wrapper makes it transparent
  }
}
```

### 4.5 API Route Updates

Update submission route to pass execution mode:

```typescript
// apps/backend/src/routes/challenge.routes.ts
router.post('/questions/:id/submit', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;
  const userId = req.user.id;

  // Fetch question with execution mode
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Prepare execution metadata
  const executionMetadata = {
    executionMode: question.executionMode,
    functionMetadata: question.executionMode === 'function' 
      ? question.parameterTypes 
      : null,
  };

  // Send to execution engine
  const result = await fetch(`${EXECUTION_ENGINE_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      language,
      input: testCase.input,
      expectedOutput: testCase.output,
      timeLimit: question.timeLimit,
      memoryLimit: question.memoryLimit,
      executionMode: executionMetadata.executionMode,
      functionMetadata: executionMetadata.functionMetadata,
    }),
  });

  // Rest of submission logic
});
```

---

## 5. Wrapper Code Examples

### 5.1 Python Wrapper Example

**User's Function Code:**
```python
def solution(arr, k):
    return sorted(arr)[k-1]
```

**Generated Complete Code:**
```python
def solution(arr, k):
    return sorted(arr)[k-1]

# Platform-generated wrapper code
if __name__ == "__main__":
    import sys
    arr = list(map(int, input().split()))
    k = int(input().strip())
    result = solution(arr, k)
    print(result)
```

### 5.2 Java Wrapper Example

**User's Function Code:**
```java
class Solution {
    public static int solution(int[] arr, int k) {
        Arrays.sort(arr);
        return arr[k-1];
    }
}
```

**Generated Complete Code:**
```java
import java.io.*;
import java.util.*;

class Solution {
    public static int solution(int[] arr, int k) {
        Arrays.sort(arr);
        return arr[k-1];
    }
}

// Platform-generated wrapper code
class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] arrStr = br.readLine().split(" ");
        int[] arr = Arrays.stream(arrStr).mapToInt(Integer::parseInt).toArray();
        int k = Integer.parseInt(br.readLine().trim());
        Solution solution = new Solution();
        int result = solution.solution(arr, k);
        System.out.println(result);
    }
}
```

### 5.3 JavaScript Wrapper Example

**User's Function Code:**
```javascript
function solution(arr, k) {
    return arr.sort((a, b) => a - b)[k-1];
}
```

**Generated Complete Code:**
```javascript
function solution(arr, k) {
    return arr.sort((a, b) => a - b)[k-1];
}

// Platform-generated wrapper code
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const arr = lines[0].split(' ').map(Number);
    const k = parseInt(lines[1]);
    const result = solution(arr, k);
    console.log(result);
});
```

### 5.4 C++ Wrapper Example

**User's Function Code:**
```cpp
int solution(vector<int>& arr, int k) {
    sort(arr.begin(), arr.end());
    return arr[k-1];
}
```

**Generated Complete Code:**
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

int solution(vector<int>& arr, int k) {
    sort(arr.begin(), arr.end());
    return arr[k-1];
}

// Platform-generated wrapper code
int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> arr;
    int num;
    while (iss >> num) {
        arr.push_back(num);
    }
    
    int k;
    cin >> k;
    
    int result = solution(arr, k);
    cout << result << endl;
    
    return 0;
}
```

---

## 6. Frontend Integration

### 6.1 Question Display Component

```typescript
// apps/web/src/components/QuestionDisplay.tsx
interface QuestionDisplayProps {
  question: Question;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="question-container">
      {/* Mode Badge */}
      <div className="execution-mode-badge">
        {question.executionMode === 'function' ? (
          <Badge variant="success">Function Mode</Badge>
        ) : (
          <Badge variant="primary">Full Program Mode</Badge>
        )}
      </div>

      {/* Function Signature Display (Function Mode Only) */}
      {question.executionMode === 'function' && (
        <div className="function-signature">
          <h4>Function Signature:</h4>
          <CodeBlock language={selectedLanguage}>
            {question.functionSignature[selectedLanguage]}
          </CodeBlock>
          <p className="text-muted">
            Implement the above function. Input/output handling is managed by the platform.
          </p>
        </div>
      )}

      {/* Problem Statement */}
      <div className="problem-statement">
        <ReactMarkdown>{question.statement}</ReactMarkdown>
      </div>

      {/* Rest of question display */}
    </div>
  );
};
```

### 6.2 Code Editor Component Update

```typescript
// apps/web/src/components/CodeEditor.tsx
export const CodeEditor: React.FC<CodeEditorProps> = ({ question, onSubmit }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  useEffect(() => {
    // Load appropriate template based on execution mode
    const template = getTemplate(question, language);
    setCode(template);
  }, [question, language]);

  const getTemplate = (question: Question, lang: string): string => {
    if (question.executionMode === 'function') {
      return question.templates[lang].function || '';
    } else {
      return question.templates[lang].fullProgram || '';
    }
  };

  return (
    <div className="code-editor-container">
      {/* Language Selector */}
      <LanguageSelector value={language} onChange={setLanguage} />

      {/* Execution Mode Info */}
      {question.executionMode === 'function' && (
        <Alert variant="info">
          <strong>Function Mode:</strong> Write only the function implementation.
          The platform will handle input/output automatically.
        </Alert>
      )}

      {/* Monaco Editor */}
      <MonacoEditor
        language={language}
        value={code}
        onChange={setCode}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
        }}
      />

      {/* Submit Button */}
      <Button onClick={() => onSubmit(code, language)}>
        Submit Solution
      </Button>
    </div>
  );
};
```

---

## 7. Type System for Parameters

### 7.1 Supported Parameter Types

| Type | Python | JavaScript | Java | C++ |
|------|--------|------------|------|-----|
| **int** | `int` | `number` | `int` | `int` |
| **float** | `float` | `number` | `double` | `double` |
| **string** | `str` | `string` | `String` | `string` |
| **boolean** | `bool` | `boolean` | `boolean` | `bool` |
| **array<int>** | `List[int]` | `number[]` | `int[]` | `vector<int>` |
| **array<string>** | `List[str]` | `string[]` | `String[]` | `vector<string>` |
| **matrix<int>** | `List[List[int]]` | `number[][]` | `int[][]` | `vector<vector<int>>` |

### 7.2 Type Parsing Logic

The wrapper generator must parse each type and generate appropriate input reading code:

```typescript
interface TypeParser {
  parseInput(type: string, language: string): string;
}

class PythonTypeParser implements TypeParser {
  parseInput(type: string, varName: string): string {
    switch (type) {
      case 'int':
        return `${varName} = int(input().strip())`;
      case 'float':
        return `${varName} = float(input().strip())`;
      case 'string':
        return `${varName} = input().strip()`;
      case 'boolean':
        return `${varName} = input().strip().lower() == 'true'`;
      case 'array<int>':
        return `${varName} = list(map(int, input().split()))`;
      case 'array<string>':
        return `${varName} = input().split()`;
      case 'matrix<int>':
        return `n = int(input())\n    ${varName} = [list(map(int, input().split())) for _ in range(n)]`;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }
}

// Similar parsers for Java, JavaScript, C++
```

---

## 8. Migration and Rollout Strategy

### 8.1 Phase 1: Database Migration (Week 1)

1. Add new fields to Question model with Prisma migration
2. Set default `executionMode = "full-program"` for all existing questions
3. Deploy database changes to production
4. Verify all existing questions still work

### 8.2 Phase 2: Backend Implementation (Week 2)

1. Implement WrapperService
2. Update TemplateService
3. Update API routes to handle executionMode
4. Add validation for function metadata
5. Write unit tests

### 8.3 Phase 3: Execution Engine Integration (Week 3)

1. Update DockerService to support dual mode
2. Test wrapper generation for all languages
3. Verify Docker container execution
4. Performance testing

### 8.4 Phase 4: Frontend Updates (Week 4)

1. Update question display components
2. Add mode badges and indicators
3. Update code editor templates
4. Add user guidance for Function Mode

### 8.5 Phase 5: Content Creation (Week 5)

1. Convert 10-20 popular questions to Function Mode
2. Create new Function Mode questions
3. User testing and feedback
4. Iterate based on feedback

### 8.6 Phase 6: Full Rollout (Week 6)

1. Enable Function Mode for all users
2. Documentation and tutorials
3. Monitor performance and errors
4. Scale based on usage

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
describe('WrapperService', () => {
  
  it('should generate Python wrapper for array + int parameters', () => {
    const userCode = 'def solution(arr, k):\n    return sorted(arr)[k-1]';
    const metadata = {
      params: [
        { name: 'arr', type: 'array<int>' },
        { name: 'k', type: 'int' }
      ],
      returnType: 'int',
      functionName: 'solution'
    };
    
    const wrapper = new WrapperService();
    const result = wrapper.generateWrapper(userCode, 'python', metadata, '5 3 8 1 9\n3');
    
    expect(result).toContain('arr = list(map(int, input().split()))');
    expect(result).toContain('k = int(input().strip())');
    expect(result).toContain('result = solution(arr, k)');
    expect(result).toContain('print(result)');
  });

  it('should generate Java wrapper with correct class detection', () => {
    const userCode = 'class Solution {\n    public static int solution(int[] arr, int k) {\n        return arr[k-1];\n    }\n}';
    const metadata = {
      params: [
        { name: 'arr', type: 'array<int>' },
        { name: 'k', type: 'int' }
      ],
      returnType: 'int',
      functionName: 'solution'
    };
    
    const wrapper = new WrapperService();
    const result = wrapper.generateWrapper(userCode, 'java', metadata, '5 3 8 1 9\n3');
    
    expect(result).toContain('BufferedReader br');
    expect(result).toContain('Arrays.stream');
    expect(result).toContain('Solution solution = new Solution()');
  });
});
```

### 9.2 Integration Tests

```typescript
describe('Dual Mode Execution', () => {
  it('should execute Full Program Mode correctly', async () => {
    const code = `
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const arr = lines[0].split(' ').map(Number);
  const k = parseInt(lines[1]);
  console.log(arr.sort((a,b) => a-b)[k-1]);
});
`;
    
    const result = await executeCode(code, 'javascript', '5 3 8 1 9\n3', '5', 'full-program');
    expect(result.verdict).toBe('AC');
    expect(result.output.trim()).toBe('5');
  });

  it('should execute Function Mode correctly', async () => {
    const code = `function solution(arr, k) {\n  return arr.sort((a,b) => a-b)[k-1];\n}`;
    const metadata = {
      params: [
        { name: 'arr', type: 'array<int>' },
        { name: 'k', type: 'int' }
      ],
      returnType: 'int',
      functionName: 'solution'
    };
    
    const result = await executeCode(code, 'javascript', '5 3 8 1 9\n3', '5', 'function', metadata);
    expect(result.verdict).toBe('AC');
    expect(result.output.trim()).toBe('5');
  });
});
```

### 9.3 End-to-End Tests

```typescript
describe('E2E: Dual Mode Question Submission', () => {
  it('should submit and evaluate Function Mode question', async () => {
    // Create Function Mode question
    const question = await createQuestion({
      title: 'Kth Smallest Element',
      executionMode: 'function',
      functionSignature: {
        python: 'def solution(arr: List[int], k: int) -> int:',
        java: 'public static int solution(int[] arr, int k)',
      },
      parameterTypes: {
        params: [
          { name: 'arr', type: 'array<int>' },
          { name: 'k', type: 'int' }
        ],
        returnType: 'int',
        functionName: 'solution'
      },
    });

    // Submit solution
    const submission = await submitSolution({
      questionId: question.id,
      code: 'def solution(arr, k):\n    return sorted(arr)[k-1]',
      language: 'python',
    });

    // Verify execution
    expect(submission.status).toBe('accepted');
    expect(submission.passedCount).toBe(submission.totalCount);
  });
});
```

---

## 10. Security Considerations

### 10.1 Code Injection Prevention

1. **Wrapper Isolation**: User code and wrapper code are clearly separated
2. **Input Validation**: All function metadata is validated before wrapper generation
3. **Sandboxing**: Docker containers remain isolated regardless of mode
4. **Resource Limits**: Same timeout/memory limits apply to both modes

### 10.2 Malicious Code Detection

```typescript
class SecurityValidator {
  validateUserCode(code: string, language: string, mode: ExecutionMode): ValidationResult {
    const issues: string[] = [];

    // In Function Mode, check for I/O operations
    if (mode === ExecutionMode.FUNCTION) {
      if (language === 'python' && /input\(|print\(/.test(code)) {
        issues.push('Function Mode does not allow input() or print() statements');
      }
      if (language === 'java' && /System\.in|System\.out/.test(code)) {
        issues.push('Function Mode does not allow System.in or System.out usage');
      }
      if (language === 'javascript' && /require\(['"]readline|process\.stdin|console\.log/.test(code)) {
        issues.push('Function Mode does not allow console I/O');
      }
    }

    // Check for system calls
    if (/os\.|subprocess|exec\(|eval\(/.test(code)) {
      issues.push('System calls and dynamic execution are not allowed');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
```

---

## 11. Performance Optimization

### 11.1 Wrapper Caching

Cache generated wrappers to avoid regeneration:

```typescript
class WrapperCache {
  private cache: Map<string, string> = new Map();

  getCacheKey(
    language: string,
    metadata: FunctionMetadata,
    input: string
  ): string {
    return `${language}:${JSON.stringify(metadata)}:${input}`;
  }

  getWrapper(
    language: string,
    metadata: FunctionMetadata,
    input: string
  ): string | null {
    const key = this.getCacheKey(language, metadata, input);
    return this.cache.get(key) || null;
  }

  setWrapper(
    language: string,
    metadata: FunctionMetadata,
    input: string,
    wrapper: string
  ): void {
    const key = this.getCacheKey(language, metadata, input);
    this.cache.set(key, wrapper);
  }
}
```

### 11.2 Parallel Execution

Run test cases in parallel for both modes:

```typescript
async function evaluateSubmission(submission: Submission): Promise<Result> {
  const testCases = await getTestCases(submission.questionId);
  
  // Execute all test cases in parallel
  const results = await Promise.all(
    testCases.map(testCase => 
      executeCode(
        submission.code,
        submission.language,
        testCase.input,
        testCase.output,
        submission.question.executionMode,
        submission.question.parameterTypes
      )
    )
  );
  
  // Aggregate results
  return aggregateResults(results);
}
```

---

## 12. Error Handling and User Feedback

### 12.1 Error Types

| Error Type | Message | Cause |
|------------|---------|-------|
| **Compilation Error** | "Your code has syntax errors" | CE verdict |
| **Runtime Error** | "Your code crashed during execution" | RE verdict |
| **Wrong Answer** | "Output doesn't match expected" | WA verdict |
| **Time Limit Exceeded** | "Code took too long" | TLE verdict |
| **Memory Limit Exceeded** | "Code used too much memory" | MLE verdict |
| **Function Signature Mismatch** | "Function signature doesn't match requirements" | Function Mode only |

### 12.2 Helpful Error Messages

```typescript
function generateUserFriendlyError(
  result: ExecutionResult,
  mode: ExecutionMode
): string {
  if (result.verdict === 'CE') {
    return `Compilation Error:\n${result.error}`;
  }
  
  if (result.verdict === 'RE') {
    if (mode === ExecutionMode.FUNCTION && result.error.includes('missing')) {
      return `Function Signature Error: Make sure your function name and parameters match the required signature.`;
    }
    return `Runtime Error:\n${result.error}`;
  }
  
  if (result.verdict === 'TLE') {
    return `Time Limit Exceeded: Your solution took longer than ${result.timeLimit}ms. Try optimizing your algorithm.`;
  }
  
  if (result.verdict === 'MLE') {
    return `Memory Limit Exceeded: Your solution used more than ${result.memoryLimit}MB. Try reducing memory usage.`;
  }
  
  if (result.verdict === 'WA') {
    return `Wrong Answer: Your output doesn't match the expected output.\nExpected: ${result.expectedOutput}\nGot: ${result.output}`;
  }
  
  return 'Unknown error occurred';
}
```

---

## 13. Monitoring and Analytics

### 13.1 Metrics to Track

1. **Execution Mode Distribution**
   - % of submissions in Full Program Mode
   - % of submissions in Function Mode

2. **Error Rate by Mode**
   - CE/RE/TLE/MLE/WA rates for each mode
   - Compare error patterns between modes

3. **Performance Metrics**
   - Average execution time for each mode
   - Wrapper generation time
   - Docker container overhead

4. **User Behavior**
   - Mode preference by user level (beginner/intermediate/advanced)
   - Question completion rate by mode
   - Template usage vs custom implementation

### 13.2 Logging Strategy

```typescript
class ExecutionLogger {
  logExecution(data: {
    submissionId: string;
    questionId: string;
    userId: string;
    language: string;
    executionMode: ExecutionMode;
    verdict: string;
    runtime: number;
    memory: number;
    wrapperGenerated: boolean;
    wrapperGenerationTime?: number;
  }) {
    logger.info('Code Execution', {
      ...data,
      timestamp: new Date().toISOString(),
    });
    
    // Send to analytics service
    analytics.track('code_execution', data);
  }
}
```

---

## 14. Documentation and User Guidance

### 14.1 Platform Documentation

Create comprehensive guides:

1. **"Understanding Execution Modes"**
   - What is Full Program Mode?
   - What is Function Mode?
   - When to use each mode?

2. **"Function Mode Guide"**
   - How to write solutions in Function Mode
   - Common mistakes to avoid
   - Language-specific tips

3. **"Template Reference"**
   - Template examples for all languages
   - How templates are generated
   - Customizing templates

### 14.2 In-Platform Tooltips

```typescript
const ExecutionModeTooltip = () => {
  return (
    <Tooltip>
      <h4>Function Mode</h4>
      <p>
        In Function Mode, you only need to implement the solution function.
        The platform automatically handles:
      </p>
      <ul>
        <li>Reading input from test cases</li>
        <li>Parsing input into function parameters</li>
        <li>Calling your function</li>
        <li>Validating output</li>
      </ul>
      <p>
        <strong>Focus on the algorithm, not the I/O!</strong>
      </p>
    </Tooltip>
  );
};
```

---

## 15. Future Enhancements

### 15.1 Phase 2 Features (Post-Launch)

1. **Multi-Function Support**
   - Allow questions requiring multiple helper functions
   - Class-based solutions with multiple methods

2. **Interactive Input**
   - Support for interactive problems where program responds to judge queries
   - Chess engines, game playing algorithms

3. **Custom Data Structures**
   - Tree nodes, linked list nodes, graph representations
   - Automatic serialization/deserialization

4. **Debugging Mode**
   - Step-through execution with variable inspection
   - Show intermediate values for failed test cases

5. **AI Code Assistance**
   - Suggest optimizations for TLE submissions
   - Detect common algorithmic patterns
   - Provide hints based on failed test cases

### 15.2 Advanced Type System

```typescript
// Future: Support for custom types
interface AdvancedTypes {
  'tree<int>': {
    definition: 'Binary tree with integer values',
    serialization: 'level-order with null markers',
    example: '[1,2,3,null,null,4,5]'
  };
  'linkedlist<int>': {
    definition: 'Singly linked list',
    serialization: 'comma-separated values',
    example: '1,2,3,4,5'
  };
  'graph<int>': {
    definition: 'Adjacency list representation',
    serialization: 'number of nodes, then edges',
    example: '5\n0 1\n1 2\n2 3\n3 4'
  };
}
```

---

## 16. Risk Assessment and Mitigation

### 16.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Wrapper generation bugs | High | Medium | Extensive unit testing, gradual rollout |
| Docker overhead increase | Medium | Low | Performance benchmarking, caching |
| Type system limitations | Medium | Medium | Start with basic types, extend gradually |
| Security vulnerabilities | High | Low | Code review, security audit |
| Database migration issues | High | Low | Thorough testing, rollback plan |

### 16.2 User Experience Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User confusion about modes | Medium | High | Clear UI indicators, documentation, tooltips |
| Template generation errors | High | Medium | Smart fallbacks, error reporting |
| Increased error rates | Medium | Medium | Better error messages, user guidance |
| Performance degradation | Medium | Low | Caching, optimization, monitoring |

---

## 17. Success Criteria

### 17.1 Technical Metrics

- ✅ 100% of test cases pass for wrapper-generated code
- ✅ <100ms overhead for wrapper generation
- ✅ <5% increase in Docker execution time
- ✅ Zero security vulnerabilities
- ✅ 99.9% uptime during rollout

### 17.2 User Metrics

- ✅ 30% of new questions use Function Mode
- ✅ 50% reduction in template-related errors
- ✅ 20% increase in question completion rate
- ✅ Positive user feedback (>4.0/5.0 rating)
- ✅ <2% increase in support tickets

### 17.3 Business Metrics

- ✅ Attract more beginner users
- ✅ Improve platform competitiveness vs LeetCode/HackerRank
- ✅ Enable creation of more diverse problem types
- ✅ Reduce content creation time for Function Mode questions

---

## 18. Rollback Plan

### 18.1 Quick Rollback Procedure

If critical issues arise:

1. **Database Rollback**: Revert migration, restore backup
2. **Code Rollback**: Deploy previous version via Git
3. **Feature Flag**: Disable Function Mode via environment variable
4. **Monitoring**: Watch error rates return to baseline

### 18.2 Gradual Degradation

If wrapper generation fails:

```typescript
class FallbackStrategy {
  async executeWithFallback(
    code: string,
    language: string,
    input: string,
    expectedOutput: string,
    executionMode: ExecutionMode,
    metadata?: FunctionMetadata
  ): Promise<ExecutionResult> {
    
    // Try Function Mode with wrapper
    if (executionMode === ExecutionMode.FUNCTION && metadata) {
      try {
        const wrapper = this.wrapperService.generateWrapper(code, language, metadata, input);
        return await this.dockerService.executeCode(wrapper, language, input, expectedOutput);
      } catch (error) {
        logger.error('Wrapper generation failed, falling back to Full Program Mode', error);
        
        // Fallback: Treat as Full Program Mode
        return await this.dockerService.executeCode(code, language, input, expectedOutput);
      }
    }
    
    // Full Program Mode
    return await this.dockerService.executeCode(code, language, input, expectedOutput);
  }
}
```

---

## 19. Timeline and Milestones

### Week 1: Foundation
- ✅ Database schema design
- ✅ Create migration scripts
- ✅ Design wrapper service architecture
- ✅ Write technical specification document

### Week 2: Backend Implementation
- ⬜ Implement WrapperService for all languages
- ⬜ Update TemplateService
- ⬜ Modify API routes
- ⬜ Write unit tests (80% coverage)

### Week 3: Execution Engine
- ⬜ Integrate WrapperService with DockerService
- ⬜ Test all 4 languages (Python, Java, JavaScript, C++)
- ⬜ Performance benchmarking
- ⬜ Docker container optimization

### Week 4: Frontend Development
- ⬜ Update QuestionDisplay component
- ⬜ Modify CodeEditor with mode awareness
- ⬜ Add mode badges and tooltips
- ⬜ Create user guidance modals

### Week 5: Testing and QA
- ⬜ Integration testing
- ⬜ End-to-end testing
- ⬜ Security audit
- ⬜ Performance testing under load
- ⬜ User acceptance testing (internal team)

### Week 6: Deployment and Monitoring
- ⬜ Gradual rollout (10% → 50% → 100%)
- ⬜ Monitor error rates and performance
- ⬜ Collect user feedback
- ⬜ Fix critical bugs
- ⬜ Documentation and tutorials

---

## 20. Conclusion

The Dual Execution Mode system represents a significant enhancement to Adyapan AI's coding platform. By supporting both Full Program Mode and Function Mode, we:

1. **Lower the barrier to entry** for beginners who struggle with I/O boilerplate
2. **Focus learning on algorithms** rather than language-specific I/O syntax
3. **Reduce template errors** by automating I/O handling in Function Mode
4. **Match industry standards** (LeetCode, HackerRank, Codeforces all support function-based submissions)
5. **Enable faster content creation** for Function Mode questions
6. **Maintain backward compatibility** with existing 544 questions

The architecture is designed to be:
- **Scalable**: Wrapper generation is stateless and cacheable
- **Secure**: Docker isolation applies to both modes
- **Maintainable**: Clear separation between modes
- **Extensible**: Easy to add new types and languages

This feature positions Adyapan AI as a modern, competitive DSA learning platform ready for production deployment.

---

## Appendix A: Database Migration Script

```sql
-- Migration: Add executionMode to Question table
ALTER TABLE "Question" 
ADD COLUMN "executionMode" TEXT DEFAULT 'full-program',
ADD COLUMN "functionSignature" JSONB,
ADD COLUMN "parameterTypes" JSONB;

-- Update existing questions to Full Program Mode
UPDATE "Question" 
SET "executionMode" = 'full-program'
WHERE "executionMode" IS NULL;

-- Add index for faster queries
CREATE INDEX "idx_question_execution_mode" 
ON "Question"("executionMode");

-- Verify migration
SELECT 
  "executionMode", 
  COUNT(*) as count 
FROM "Question" 
GROUP BY "executionMode";
```

## Appendix B: Example Function Mode Questions

### Example 1: Kth Smallest Element

```json
{
  "title": "Kth Smallest Element",
  "slug": "kth-smallest-element",
  "executionMode": "function",
  "difficulty": "medium",
  "statement": "Given an unsorted array and an integer k, find the kth smallest element.",
  "functionSignature": {
    "python": "def solution(arr: List[int], k: int) -> int:",
    "java": "public static int solution(int[] arr, int k)",
    "javascript": "function solution(arr, k) {",
    "cpp": "int solution(vector<int>& arr, int k) {"
  },
  "parameterTypes": {
    "params": [
      { "name": "arr", "type": "array<int>", "description": "Unsorted array" },
      { "name": "k", "type": "int", "description": "Position (1-indexed)" }
    ],
    "returnType": "int",
    "functionName": "solution"
  },
  "inputFormat": "First line: space-separated integers (array)\nSecond line: integer k",
  "outputFormat": "Single integer (kth smallest element)",
  "sampleInput": "5 3 8 1 9\n3",
  "sampleOutput": "5",
  "timeLimit": 2000,
  "memoryLimit": 256
}
```

### Example 2: Two Sum

```json
{
  "title": "Two Sum",
  "slug": "two-sum",
  "executionMode": "function",
  "difficulty": "easy",
  "statement": "Find indices of two numbers that add up to target.",
  "functionSignature": {
    "python": "def solution(arr: List[int], target: int) -> List[int]:",
    "java": "public static int[] solution(int[] arr, int target)",
    "javascript": "function solution(arr, target) {",
    "cpp": "vector<int> solution(vector<int>& arr, int target) {"
  },
  "parameterTypes": {
    "params": [
      { "name": "arr", "type": "array<int>" },
      { "name": "target", "type": "int" }
    ],
    "returnType": "array<int>",
    "functionName": "solution"
  },
  "sampleInput": "2 7 11 15\n9",
  "sampleOutput": "0 1"
}
```

---

## Appendix C: References

1. **LeetCode Architecture**: Function-based submissions with automatic I/O handling
2. **Codeforces**: Hybrid model supporting both modes
3. **HackerRank**: Function mode with strict signature matching
4. **Docker Best Practices**: Container security and resource management
5. **TypeScript Type System**: For parameter type validation

---

## Document Version

- **Version**: 1.0
- **Date**: 2026-07-28
- **Author**: Kiro AI Assistant
- **Status**: Draft - Ready for Review
- **Next Steps**: Begin implementation with database migration

---

**End of Technical Design Document**
