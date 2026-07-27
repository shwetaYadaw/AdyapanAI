# Code Submission & Execution System

## Overview

This document describes the enhanced code submission system that supports dynamic test case generation, flexible output comparison, and comprehensive execution logging.

---

## Key Features

### 1. **Dynamic Test Case Generation**
- Automatically generates test cases based on problem algorithms
- Uses proper min() calculations for problems like "Find Smallest Number"
- Supports visible and hidden test case generation
- Automatic verification of generated test cases

### 2. **Flexible Output Comparison**
Multiple levels of output comparison to handle various formatting:
- Exact trim match
- Line-by-line comparison (ignoring empty lines and whitespace)
- Multiple space normalization
- Numeric comparison for problems with numeric output

### 3. **Comprehensive Execution Logging**
Enhanced logging system with structured debug output:
- `[SUBMIT DEBUG]` - Shows question info and test case count
- `[TC X/Y]` - Shows each test case execution result
- `[FAILED]` - Shows first failure with expected vs actual output
- `[PASS/FAIL VERDICT]` - Final result summary

### 4. **Anti-Cheat Detection**
- Detects hardcoded output values in submitted code
- Prevents cheating by checking for patterns like `return "value"`
- Works across JavaScript, Python, Java, C++

---

## API Endpoints

### 1. POST `/problems/:id/submit`
Submit a solution to be executed against all test cases.

**Request:**
```json
{
  "code": "def solution(s, d):\n    ...",
  "language": "python"
}
```

**Response:**
```json
{
  "message": "Submission enqueued successfully",
  "data": {
    "submissionId": "uuid",
    "status": "pending"
  }
}
```

**Process:**
1. Code is checked for hardcoding
2. Submission record is created
3. Task is enqueued for async processing
4. Returns immediately with submission ID

---

### 2. GET `/problems/submissions/:id`
Retrieve submission status with detailed logs and results.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "status": "accepted|wrong_answer|compile_error|runtime_error|time_limit_exceeded",
    "language": "python",
    "runtime": 150,
    "passedCount": 5,
    "totalCount": 5,
    "score": 100,
    "verdict": "✅ ACCEPTED",
    "errorMessage": null,
    "executionLogs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: q123 | Language: python | Code Length: 256 bytes"
      },
      {
        "timestamp": "2024-01-20T10:30:45.130Z",
        "message": "[SUBMIT DEBUG] Total Test Cases: 5"
      },
      {
        "timestamp": "2024-01-20T10:30:45.140Z",
        "message": "[TC 1/5] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.290Z",
        "message": "[TC 1/5] ✅ PASSED | Runtime: 150ms | Input: 9 2"
      },
      {
        "timestamp": "2024-01-20T10:30:45.900Z",
        "message": "[TC 2/5] ✅ PASSED | Runtime: 160ms | Input: 20 3"
      },
      {
        "timestamp": "2024-01-20T10:30:46.500Z",
        "message": "✅ ACCEPTED | Passed: 5/5 | Runtime: 160ms"
      }
    ],
    "result": {
      "submissionId": "uuid",
      "status": "accepted",
      "runtime": 160,
      "memory": 24,
      "passedCount": 5,
      "totalCount": 5,
      "score": 100,
      "errorMessage": null
    },
    "createdAt": "2024-01-20T10:30:45.000Z"
  }
}
```

---

### 3. GET `/problems/execution-logs/:submissionId`
Get detailed execution logs for a specific submission.

**Response:**
```json
{
  "message": "Execution logs retrieved successfully",
  "data": {
    "submissionId": "uuid",
    "totalLogs": 8,
    "logs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: q123 | Language: python | Code Length: 256 bytes"
      },
      {
        "timestamp": "2024-01-20T10:30:45.130Z",
        "message": "[SUBMIT DEBUG] Total Test Cases: 5"
      },
      {
        "timestamp": "2024-01-20T10:30:45.140Z",
        "message": "[TC 1/5] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.290Z",
        "message": "[TC 1/5] ✅ PASSED | Runtime: 150ms | Input: 9 2"
      },
      {
        "timestamp": "2024-01-20T10:30:46.500Z",
        "message": "[FAILED] Test Case 3/5 | Status: wrong_answer"
      },
      {
        "timestamp": "2024-01-20T10:30:46.510Z",
        "message": "[FAILED] Expected Output: \"159\" | Actual Output: \"195\" | Error: Wrong Answer"
      }
    ]
  }
}
```

---

### 4. POST `/problems/generate-test-cases`
Generate dynamic test cases for a problem (admin endpoint).

**Request:**
```json
{
  "problemSlug": "smallest-number-with-given-digit-sum",
  "visibleCount": 6,
  "hiddenCount": 18
}
```

**Response:**
```json
{
  "message": "Test cases generated and updated successfully",
  "data": {
    "problemSlug": "smallest-number-with-given-digit-sum",
    "testCaseCount": 24,
    "visibleCount": 6,
    "hiddenCount": 18,
    "testCases": [
      {
        "input": "9 2",
        "expectedOutput": "18",
        "isHidden": false,
        "type": "visible"
      },
      ...
    ]
  }
}
```

---

## Test Case Generation

### For "Smallest Number with Given Digit Sum"

The test case generator uses proper algorithm validation:

```
Algorithm: Greedy Right-to-Left Fill

For s (digit sum) and d (digit count):

1. Validity Check:
   - If d < 1 or d > 1000: return "-1"
   - If s < 0 or s > 9000: return "-1"
   - If d == 1 and s == 0: return "-1"
   - If s < 1 or s > 9*d: return "-1"

2. Construction:
   - Initialize digits[d] = {0, 0, ..., 0}
   - digits[0] = 1 (first digit must be >= 1)
   - remaining = s - 1
   
3. Fill Right-to-Left:
   - For i from d-1 down to 1:
     - add = min(9, remaining)
     - digits[i] += add
     - remaining -= add
   
4. Add Leftover:
   - digits[0] += remaining

5. Convert to String:
   - Join all digits
```

### Example: s=20, d=3

```
Step 1: Initialize
  digits = [0, 0, 0]
  remaining = 0

Step 2: Set first digit
  digits = [1, 0, 0]
  remaining = 19

Step 3: Fill from right
  i=2: add=min(9,19)=9 → digits=[1,0,9], remaining=10
  i=1: add=min(9,10)=9 → digits=[1,9,9], remaining=1
  
Step 4: Add leftover
  digits[0] += 1 → digits=[2,9,9]
  
Step 5: Result = "299"
```

### Generated Test Cases

**Visible Cases (6):**
- Edge: s=0, d=1 → "-1"
- Single: s=1, d=1 → "1"
- 2-digit: s=9, d=2 → "18"
- 3-digit: s=20, d=3 → "299"
- 3-digit: s=15, d=3 → "159"
- 2-digit: s=5, d=2 → "14"

**Hidden Cases (18):**
- Edge cases (impossible scenarios)
- Single digit cases (d=1)
- Two digit cases (d=2)
- Three digit cases (d=3)
- Four+ digit cases (d=4, 5)

**Coverage:**
- All validity branches
- Edge cases (0 sum, impossible sums)
- Maximum digit constraints
- First digit handling
- Large d values

---

## Output Comparison Algorithm

The system uses flexible output comparison with 4 methods:

### Method 1: Exact Trim Match
```
if (actual.trim() === expected.trim()) return true;
```

### Method 2: Line-by-Line Comparison
```
- Split by newline
- Trim each line
- Remove empty lines
- Compare line-by-line
```

### Method 3: Whitespace Normalization
```
- Normalize multiple spaces to single space
- Trim input
- Compare normalized strings
```

### Method 4: Numeric Comparison
```
- Parse both as floats
- Compare numeric values
- Handles "18", " 18 ", "18.0" as equivalent
```

---

## Execution Logging

### Log Levels

1. **[SUBMIT DEBUG]** - Initial submission info
2. **[TC X/Y]** - Test case progress
3. **[FAILED]** - Failure details
4. **Verdict** - Final result

### Example Log Flow

```
[SUBMIT DEBUG] Question ID: smallest-number | Language: javascript | Code Length: 512 bytes
[SUBMIT DEBUG] Total Test Cases: 24

[TC 1/24] Starting execution...
[TC 1/24] ✅ PASSED | Runtime: 45ms | Input: 9 2

[TC 2/24] Starting execution...
[TC 2/24] ✅ PASSED | Runtime: 52ms | Input: 20 3

[TC 3/24] Starting execution...
[FAILED] Test Case 3/24 | Status: wrong_answer
[FAILED] Expected Output: "1" | Actual Output: "2" | Error: Wrong Answer

❌ WRONG_ANSWER | Passed: 2/24 | Runtime: 52ms
```

---

## Error Handling

### Submission Errors

1. **COMPILE_ERROR**
   - Syntax errors in code
   - Invalid imports/includes
   - Type mismatches

2. **RUNTIME_ERROR**
   - Null pointer dereferences
   - Array index out of bounds
   - Division by zero

3. **TIME_LIMIT_EXCEEDED**
   - Execution exceeds configured limit
   - Infinite loops
   - Too slow algorithm

4. **WRONG_ANSWER**
   - Output doesn't match expected
   - Logic errors in implementation

5. **CHEAT_DETECTED**
   - Hardcoded output values
   - Anti-cheat patterns matched

---

## Architecture

### Components

1. **QueueService** (`queue.service.ts`)
   - Manages async submission queue
   - Processes submissions sequentially
   - Creates execution logs
   - Updates submission results

2. **JudgeService** (`judge.service.ts`)
   - Executes code via Judge0 API or local fallback
   - Handles base64 encoding/decoding
   - Returns execution results
   - Supports 13+ languages

3. **TestCaseGeneratorService** (`testCaseGenerator.service.ts`)
   - Generates dynamic test cases
   - Validates test case correctness
   - Provides proper min() calculations
   - Tracks unique test inputs

4. **Problem Routes** (`problem.routes.ts`)
   - Handles submission endpoints
   - Anti-cheat detection
   - Response formatting
   - User authorization

---

## Database Schema

### ExecutionLog
```sql
CREATE TABLE execution_log (
  id UUID PRIMARY KEY,
  submissionId UUID REFERENCES submission(id),
  logMessage TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### SubmissionResult
```sql
CREATE TABLE submission_result (
  id UUID PRIMARY KEY,
  submissionId UUID REFERENCES submission(id),
  status VARCHAR(50),
  errorMessage TEXT,
  runtime INT,
  memory INT,
  passedCount INT,
  totalCount INT,
  score INT
);
```

---

## Example Workflow

### 1. Submit Solution
```
POST /problems/p123/submit
{
  "code": "def solution(s, d): ...",
  "language": "python"
}

Response:
{
  "submissionId": "sub-abc123",
  "status": "pending"
}
```

### 2. Poll Status
```
GET /problems/submissions/sub-abc123

Response (while pending):
{
  "status": "pending",
  "passedCount": 0,
  "totalCount": 0,
  "executionLogs": [...]
}

Response (after completion):
{
  "status": "accepted",
  "passedCount": 24,
  "totalCount": 24,
  "score": 100,
  "verdict": "✅ ACCEPTED",
  "runtime": 245,
  "executionLogs": [...]
}
```

### 3. View Detailed Logs
```
GET /problems/execution-logs/sub-abc123

Response:
{
  "submissionId": "sub-abc123",
  "totalLogs": 32,
  "logs": [
    {
      "timestamp": "2024-01-20T10:30:45.123Z",
      "message": "[SUBMIT DEBUG] ..."
    },
    ...
  ]
}
```

---

## Performance Considerations

### Async Processing
- Submissions are queued and processed asynchronously
- Client gets immediate response with submission ID
- Can poll for results without blocking

### Test Case Limits
- Visible test cases: ~6 (fast feedback)
- Hidden test cases: ~18 (comprehensive testing)
- Total: ~24 test cases per problem

### Time Limits
- Default: 2000ms per submission
- Configurable per problem
- Judge0 API timeout: +5000ms buffer

### Memory Limits
- Default: 256MB
- Tracked but mocked in current implementation
- Can be enforced per problem

---

## Supported Languages

| Language | Version | ID |
|----------|---------|-----|
| JavaScript | Node.js 18.15.0 | 93 |
| TypeScript | 5.0.3 | 94 |
| Python | 3.11.2 | 71 |
| C++ | GCC 13.2.0 | 76 |
| C | GCC 13.2.0 | 75 |
| Java | OpenJDK 17.0.6 | 91 |
| Go | 1.20.3 | 95 |
| C# | Mono 6.12.0 | 51 |

---

## Troubleshooting

### Issue: Submission stuck on "pending"
- Check queue service is running
- Verify database connections
- Check Judge0 API availability

### Issue: All test cases failing
- Check code syntax for language
- Verify input/output format
- Check time/memory limits

### Issue: Inconsistent pass/fail
- Check output comparison flexibility
- Verify whitespace handling
- Check numeric precision

---

## Future Enhancements

1. **Streaming Logs** - Real-time log updates via WebSocket
2. **Custom Validators** - Problem-specific output validation
3. **Partial Credit** - Award points for passing subset of tests
4. **Test Performance Metrics** - Track avg runtime per test case
5. **Code Plagiarism Detection** - Detect similar submissions
6. **Submission History Analytics** - Track improvement over time

---

## Related Files

- `/src/services/queue.service.ts` - Queue processing
- `/src/services/judge.service.ts` - Code execution
- `/src/services/testCaseGenerator.service.ts` - Dynamic test case generation
- `/src/routes/problem.routes.ts` - API endpoints
- `/src/scripts/updateSmallestNumberProblem.ts` - Problem setup script
- `/prisma/schema.prisma` - Database schema

---

Generated: January 2024
Last Updated: January 2024
