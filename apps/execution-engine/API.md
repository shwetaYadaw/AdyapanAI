# Execution Engine API Documentation

Complete API reference for the Adyapan Execution Engine.

## Base URL

```
http://localhost:8001 (Development)
https://execute.adyapan.com (Production)
```

## Authentication

All API endpoints (except `/health`) require an API key in the request header:

```http
X-API-Key: your_api_key_here
```

## Response Format

All responses follow this standard format:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Endpoints

### 1. Run Code

Execute code with custom input (synchronous).

**Endpoint:** `POST /api/execute/run`

**Headers:**
```http
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "input": "",
  "timeLimit": 5,
  "memoryLimit": 256
}
```

**Parameters:**
- `code` (string, required): Source code to execute
- `language` (string, required): Programming language (cpp, java, python, javascript)
- `input` (string, optional): Standard input for the program
- `timeLimit` (number, optional): Time limit in seconds (default: 5)
- `memoryLimit` (number, optional): Memory limit in MB (default: 256)

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "Hello, World!",
    "error": "",
    "runtime": 120,
    "memory": 15,
    "verdict": "AC",
    "timeout": false
  }
}
```

**Response Fields:**
- `output` (string): Program output (stdout)
- `error` (string): Error output (stderr)
- `runtime` (number): Execution time in milliseconds
- `memory` (number): Memory used in MB
- `verdict` (string): Execution verdict (AC, WA, TLE, MLE, RE, CE)
- `timeout` (boolean): Whether execution timed out

**Example with cURL:**
```bash
curl -X POST http://localhost:8001/api/execute/run \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "code": "print(\"Hello, World!\")",
    "language": "python",
    "input": ""
  }'
```

---

### 2. Submit Code (Async)

Submit code for asynchronous judging against test cases.

**Endpoint:** `POST /api/execute/submit`

**Headers:**
```http
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:**
```json
{
  "submissionId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "def solve(n):\n    return n * 2\n\nif __name__ == '__main__':\n    n = int(input())\n    print(solve(n))",
  "language": "python",
  "testCases": [
    {
      "input": "5",
      "expectedOutput": "10",
      "isHidden": false
    },
    {
      "input": "10",
      "expectedOutput": "20",
      "isHidden": true
    }
  ],
  "timeLimit": 5,
  "memoryLimit": 256,
  "callbackUrl": "https://api.adyapan.com/callback"
}
```

**Parameters:**
- `submissionId` (string, required): Unique submission identifier
- `code` (string, required): Source code to judge
- `language` (string, required): Programming language
- `testCases` (array, required): Array of test cases
  - `input` (string): Test case input
  - `expectedOutput` (string): Expected output
  - `isHidden` (boolean): Whether test case is hidden
- `timeLimit` (number, optional): Time limit in seconds
- `memoryLimit` (number, optional): Memory limit in MB
- `callbackUrl` (string, optional): URL to receive result callback

**Response:**
```json
{
  "success": true,
  "message": "Submission enqueued successfully",
  "data": {
    "submissionId": "550e8400-e29b-41d4-a716-446655440000",
    "jobId": "1",
    "status": "queued"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8001/api/execute/submit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d @submission.json
```

---

### 3. Judge Code (Sync)

Judge code synchronously and wait for result.

**Endpoint:** `POST /api/execute/judge`

**Headers:**
```http
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:**
```json
{
  "code": "def solve(n):\n    return n * 2\n\nif __name__ == '__main__':\n    n = int(input())\n    print(solve(n))",
  "language": "python",
  "testCases": [
    {
      "input": "5",
      "expectedOutput": "10",
      "isHidden": false
    },
    {
      "input": "10",
      "expectedOutput": "20",
      "isHidden": true
    }
  ],
  "timeLimit": 5,
  "memoryLimit": 256
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verdict": "AC",
    "totalTests": 2,
    "passedTests": 2,
    "failedTests": 0,
    "runtime": 250,
    "memory": 30,
    "testResults": [
      {
        "testNumber": 1,
        "passed": true,
        "input": "5",
        "expectedOutput": "10",
        "actualOutput": "10",
        "runtime": 125,
        "memory": 15,
        "error": "",
        "verdict": "AC"
      },
      {
        "testNumber": 2,
        "passed": true,
        "input": "[Hidden]",
        "actualOutput": "20",
        "runtime": 125,
        "memory": 15,
        "error": "",
        "verdict": "AC"
      }
    ],
    "compilationError": null
  }
}
```

**Verdict Types:**
- `AC` - Accepted (all test cases passed)
- `WA` - Wrong Answer
- `TLE` - Time Limit Exceeded
- `MLE` - Memory Limit Exceeded
- `RE` - Runtime Error
- `CE` - Compilation Error

---

### 4. Get Submission Status

Get status of a queued submission.

**Endpoint:** `GET /api/execute/status/:jobId`

**Headers:**
```http
X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "completed",
    "progress": 100,
    "result": {
      "verdict": "AC",
      "totalTests": 10,
      "passedTests": 10,
      "failedTests": 0,
      "runtime": 1250,
      "memory": 45,
      "testResults": [ /* ... */ ]
    },
    "attemptsMade": 1,
    "failedReason": null,
    "finishedOn": 1699999999999,
    "processedOn": 1699999999998
  }
}
```

**Status Values:**
- `waiting` - Job is in queue
- `active` - Job is being processed
- `completed` - Job completed successfully
- `failed` - Job failed
- `delayed` - Job is delayed
- `not_found` - Job not found

---

### 5. Get Supported Languages

Get list of supported programming languages.

**Endpoint:** `GET /api/execute/languages`

**Headers:**
```http
X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "languages": ["cpp", "java", "python", "javascript"],
    "count": 4
  }
}
```

---

### 6. Get Queue Statistics

Get execution queue statistics.

**Endpoint:** `GET /api/execute/stats`

**Headers:**
```http
X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "counts": {
      "waiting": 5,
      "active": 2,
      "completed": 1523,
      "failed": 12,
      "delayed": 0
    },
    "jobs": {
      "completed": 100,
      "failed": 5,
      "active": 2,
      "waiting": 5
    }
  }
}
```

---

### 7. Health Check

Basic health check (no authentication required).

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "Execution Engine is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

---

### 8. Detailed Health Check

Detailed health check including Docker, Redis, and services.

**Endpoint:** `GET /health/detailed`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600.5,
    "services": {
      "docker": {
        "status": "healthy",
        "message": "Docker daemon is accessible"
      },
      "redis": {
        "status": "healthy",
        "message": "Redis is connected"
      },
      "judge": {
        "healthy": true,
        "message": "Docker service is healthy"
      }
    }
  }
}
```

---

### 9. Docker Images Check

Check available Docker runner images.

**Endpoint:** `GET /health/docker`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalImages": 25,
    "adyapanRunners": 4,
    "runners": [
      {
        "id": "sha256:abc123...",
        "tags": ["adyapan/runner-cpp:latest"],
        "size": 1234567890,
        "created": 1699999999
      },
      {
        "id": "sha256:def456...",
        "tags": ["adyapan/runner-java:latest"],
        "size": 2345678901,
        "created": 1699999999
      },
      {
        "id": "sha256:ghi789...",
        "tags": ["adyapan/runner-python:latest"],
        "size": 987654321,
        "created": 1699999999
      },
      {
        "id": "sha256:jkl012...",
        "tags": ["adyapan/runner-javascript:latest"],
        "size": 1876543210,
        "created": 1699999999
      }
    ]
  }
}
```

---

## Language-Specific Examples

### C++

```json
{
  "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    cout << n * 2 << endl;\n    return 0;\n}",
  "language": "cpp",
  "input": "5",
  "timeLimit": 5,
  "memoryLimit": 256
}
```

### Java

```json
{
  "code": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(n * 2);\n        sc.close();\n    }\n}",
  "language": "java",
  "input": "5",
  "timeLimit": 5,
  "memoryLimit": 512
}
```

### Python

```json
{
  "code": "n = int(input())\nprint(n * 2)",
  "language": "python",
  "input": "5",
  "timeLimit": 5,
  "memoryLimit": 256
}
```

### JavaScript

```json
{
  "code": "const readline = require('readline');\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nrl.on('line', (line) => {\n    const n = parseInt(line);\n    console.log(n * 2);\n    rl.close();\n});",
  "language": "javascript",
  "input": "5",
  "timeLimit": 5,
  "memoryLimit": 256
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing API key |
| 403 | Forbidden - Invalid API key |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Docker or Redis down |

---

## Rate Limits

- **Execution endpoints:** 30 requests per minute
- **Submission endpoints:** 10 requests per minute
- **Other endpoints:** No limit

Rate limit headers:
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1699999999
```

---

## Webhook Callbacks

When `callbackUrl` is provided in submission, the engine sends a POST request with the result:

**Callback Request:**
```http
POST https://your-callback-url
Content-Type: application/json

{
  "submissionId": "550e8400-e29b-41d4-a716-446655440000",
  "result": {
    "verdict": "AC",
    "totalTests": 10,
    "passedTests": 10,
    "failedTests": 0,
    "runtime": 1250,
    "memory": 45,
    "testResults": [ /* ... */ ]
  }
}
```

---

## Integration Example (Backend)

```typescript
import axios from 'axios';

const EXECUTION_ENGINE_URL = 'http://localhost:8001';
const API_KEY = 'your_api_key';

async function judgeSubmission(code: string, language: string, testCases: any[]) {
  try {
    const response = await axios.post(
      `${EXECUTION_ENGINE_URL}/api/execute/judge`,
      {
        code,
        language,
        testCases,
        timeLimit: 5,
        memoryLimit: 256,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        timeout: 60000,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Execution failed:', error);
    throw error;
  }
}
```

---

## SDK (Coming Soon)

JavaScript/TypeScript SDK for easy integration:

```typescript
import { ExecutionEngine } from '@adyapan/execution-engine-sdk';

const engine = new ExecutionEngine({
  baseURL: 'http://localhost:8001',
  apiKey: 'your_api_key',
});

const result = await engine.judge({
  code: 'print("Hello")',
  language: 'python',
  testCases: [{ input: '', expectedOutput: 'Hello' }],
});
```

---

## Support

For API support and questions:
- GitHub: https://github.com/adyapan/adyapan
- Documentation: https://docs.adyapan.com
- Email: api@adyapan.com
