# API Examples & Workflows

## 1. Submit a Solution

### Request
```bash
curl -X POST http://localhost:5000/problems/prob-123/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "code": "def smallestNumberWithDigitSum(s, d):\n    if s < 1 or s > 9 * d:\n        return \"-1\"\n    result = [0] * d\n    result[0] = 1\n    remaining = s - 1\n    for i in range(d - 1, -1, -1):\n        if remaining == 0:\n            break\n        add = min(9, remaining)\n        result[i] += add\n        remaining -= add\n    result[0] += remaining\n    return \"\".join(map(str, result))",
    "language": "python"
  }'
```

### Response (Success)
```json
{
  "success": true,
  "message": "Submission enqueued successfully",
  "data": {
    "submissionId": "sub-uuid-12345",
    "status": "pending"
  }
}
```

### Response (Cheat Detected)
```json
{
  "success": true,
  "message": "Cheat detected, submission rejected.",
  "data": {
    "id": "sub-uuid-12345",
    "status": "wrong_answer",
    "errorMessage": "Cheat Detected: Hardcoded output values found.",
    "language": "python",
    "code": "...",
    "createdAt": "2024-01-20T10:30:45.000Z"
  }
}
```

---

## 2. Check Submission Status

### Immediate Response (Still Processing)
```bash
curl -X GET http://localhost:5000/problems/submissions/sub-uuid-12345 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Response (Pending)
```json
{
  "success": true,
  "data": {
    "id": "sub-uuid-12345",
    "status": "pending",
    "language": "python",
    "runtime": 0,
    "passedCount": 0,
    "totalCount": 0,
    "score": 0,
    "verdict": "⏳ PENDING",
    "errorMessage": null,
    "executionLogs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: smallest-number | Language: python | Code Length: 512 bytes"
      }
    ],
    "result": null,
    "createdAt": "2024-01-20T10:30:45.000Z"
  }
}
```

### Response (Accepted)
```json
{
  "success": true,
  "data": {
    "id": "sub-uuid-12345",
    "status": "accepted",
    "language": "python",
    "runtime": 1250,
    "passedCount": 24,
    "totalCount": 24,
    "score": 100,
    "verdict": "✅ ACCEPTED",
    "errorMessage": null,
    "executionLogs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: smallest-number | Language: python | Code Length: 512 bytes"
      },
      {
        "timestamp": "2024-01-20T10:30:45.130Z",
        "message": "[SUBMIT DEBUG] Total Test Cases: 24"
      },
      {
        "timestamp": "2024-01-20T10:30:45.140Z",
        "message": "[TC 1/24] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.290Z",
        "message": "[TC 1/24] ✅ PASSED | Runtime: 150ms | Input: 0 1"
      },
      {
        "timestamp": "2024-01-20T10:30:45.300Z",
        "message": "[TC 2/24] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.450Z",
        "message": "[TC 2/24] ✅ PASSED | Runtime: 150ms | Input: 1 1"
      },
      {
        "timestamp": "2024-01-20T10:30:46.500Z",
        "message": "✅ ACCEPTED | Passed: 24/24 | Runtime: 1250ms"
      }
    ],
    "result": {
      "submissionId": "sub-uuid-12345",
      "status": "accepted",
      "runtime": 1250,
      "memory": 24,
      "passedCount": 24,
      "totalCount": 24,
      "score": 100,
      "errorMessage": null
    },
    "createdAt": "2024-01-20T10:30:45.000Z"
  }
}
```

### Response (Wrong Answer)
```json
{
  "success": true,
  "data": {
    "id": "sub-uuid-12345",
    "status": "wrong_answer",
    "language": "python",
    "runtime": 160,
    "passedCount": 2,
    "totalCount": 24,
    "score": 8,
    "verdict": "❌ WRONG ANSWER",
    "errorMessage": "Wrong Answer on test case 3",
    "executionLogs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: smallest-number | Language: python | Code Length: 512 bytes"
      },
      {
        "timestamp": "2024-01-20T10:30:45.130Z",
        "message": "[SUBMIT DEBUG] Total Test Cases: 24"
      },
      {
        "timestamp": "2024-01-20T10:30:45.290Z",
        "message": "[TC 1/24] ✅ PASSED | Runtime: 150ms | Input: 0 1"
      },
      {
        "timestamp": "2024-01-20T10:30:45.450Z",
        "message": "[TC 2/24] ✅ PASSED | Runtime: 160ms | Input: 1 1"
      },
      {
        "timestamp": "2024-01-20T10:30:45.610Z",
        "message": "[TC 3/24] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.760Z",
        "message": "[FAILED] Test Case 3/24 | Status: wrong_answer"
      },
      {
        "timestamp": "2024-01-20T10:30:45.770Z",
        "message": "[FAILED] Expected Output: \"18\" | Actual Output: \"81\" | Error: Wrong Answer"
      }
    ],
    "result": {
      "submissionId": "sub-uuid-12345",
      "status": "wrong_answer",
      "runtime": 160,
      "memory": 24,
      "passedCount": 2,
      "totalCount": 24,
      "score": 8,
      "errorMessage": "Wrong Answer on test case 3"
    },
    "createdAt": "2024-01-20T10:30:45.000Z"
  }
}
```



### Response (Compilation Error)
```json
{
  "success": true,
  "data": {
    "id": "sub-uuid-12345",
    "status": "compile_error",
    "language": "java",
    "runtime": 0,
    "passedCount": 0,
    "totalCount": 24,
    "score": 0,
    "verdict": "❌ COMPILE ERROR",
    "errorMessage": "invalid method declaration; return type required",
    "executionLogs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: smallest-number | Language: java | Code Length: 512 bytes"
      },
      {
        "timestamp": "2024-01-20T10:30:45.130Z",
        "message": "[SUBMIT DEBUG] Total Test Cases: 24"
      },
      {
        "timestamp": "2024-01-20T10:30:45.140Z",
        "message": "[TC 1/24] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.200Z",
        "message": "[FAILED] Test Case 1/24 | Status: compile_error"
      },
      {
        "timestamp": "2024-01-20T10:30:45.210Z",
        "message": "[FAILED] Compilation Error: invalid method declaration; return type required"
      }
    ],
    "result": {
      "submissionId": "sub-uuid-12345",
      "status": "compile_error",
      "runtime": 0,
      "memory": 0,
      "passedCount": 0,
      "totalCount": 24,
      "score": 0,
      "errorMessage": "invalid method declaration; return type required"
    },
    "createdAt": "2024-01-20T10:30:45.000Z"
  }
}
```

---

## 3. View Execution Logs

### Request
```bash
curl -X GET http://localhost:5000/problems/execution-logs/sub-uuid-12345 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Response
```json
{
  "success": true,
  "message": "Execution logs retrieved successfully",
  "data": {
    "submissionId": "sub-uuid-12345",
    "totalLogs": 8,
    "logs": [
      {
        "timestamp": "2024-01-20T10:30:45.123Z",
        "message": "[SUBMIT DEBUG] Question ID: smallest-number | Language: python | Code Length: 512 bytes"
      },
      {
        "timestamp": "2024-01-20T10:30:45.130Z",
        "message": "[SUBMIT DEBUG] Total Test Cases: 24"
      },
      {
        "timestamp": "2024-01-20T10:30:45.140Z",
        "message": "[TC 1/24] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.290Z",
        "message": "[TC 1/24] ✅ PASSED | Runtime: 150ms | Input: 0 1"
      },
      {
        "timestamp": "2024-01-20T10:30:45.300Z",
        "message": "[TC 2/24] Starting execution..."
      },
      {
        "timestamp": "2024-01-20T10:30:45.450Z",
        "message": "[TC 2/24] ✅ PASSED | Runtime: 160ms | Input: 1 1"
      },
      {
        "timestamp": "2024-01-20T10:30:46.450Z",
        "message": "[TC 3/24] ✅ PASSED | Runtime: 155ms | Input: 9 2"
      },
      {
        "timestamp": "2024-01-20T10:30:46.500Z",
        "message": "✅ ACCEPTED | Passed: 24/24 | Runtime: 1250ms"
      }
    ]
  }
}
```

---

## 4. Generate Test Cases

### Request
```bash
curl -X POST http://localhost:5000/problems/generate-test-cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "problemSlug": "smallest-number-with-given-digit-sum",
    "visibleCount": 6,
    "hiddenCount": 18
  }'
```

### Response
```json
{
  "success": true,
  "message": "Test cases generated and updated successfully",
  "data": {
    "problemSlug": "smallest-number-with-given-digit-sum",
    "testCaseCount": 24,
    "visibleCount": 6,
    "hiddenCount": 18,
    "testCases": [
      {
        "input": "0 1",
        "expectedOutput": "-1",
        "isHidden": false,
        "type": "visible"
      },
      {
        "input": "1 1",
        "expectedOutput": "1",
        "isHidden": false,
        "type": "visible"
      },
      {
        "input": "9 2",
        "expectedOutput": "18",
        "isHidden": false,
        "type": "visible"
      },
      {
        "input": "20 3",
        "expectedOutput": "299",
        "isHidden": false,
        "type": "visible"
      },
      {
        "input": "15 3",
        "expectedOutput": "159",
        "isHidden": false,
        "type": "visible"
      },
      {
        "input": "5 2",
        "expectedOutput": "14",
        "isHidden": false,
        "type": "visible"
      },
      {
        "input": "1 2",
        "expectedOutput": "-1",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "2 1",
        "expectedOutput": "2",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "10 2",
        "expectedOutput": "19",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "27 3",
        "expectedOutput": "999",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "5 1",
        "expectedOutput": "5",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "18 2",
        "expectedOutput": "99",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "2 2",
        "expectedOutput": "-1",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "3 1",
        "expectedOutput": "3",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "11 2",
        "expectedOutput": "29",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "25 3",
        "expectedOutput": "889",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "12 2",
        "expectedOutput": "39",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "9 1",
        "expectedOutput": "9",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "30 4",
        "expectedOutput": "3999",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "50 5",
        "expectedOutput": "59999",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "45 5",
        "expectedOutput": "99999",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "1 10",
        "expectedOutput": "1000000000",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "9 10",
        "expectedOutput": "1000000008",
        "isHidden": true,
        "type": "hidden"
      },
      {
        "input": "91 10",
        "expectedOutput": "-1",
        "isHidden": true,
        "type": "edge"
      }
    ]
  }
}
```

---

## 5. Submission History

### Request
```bash
curl -X GET http://localhost:5000/problems/submissions/history \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "sub-uuid-12345",
      "userId": "user-123",
      "problemId": "prob-456",
      "code": "def solution(s, d): ...",
      "language": "python",
      "status": "accepted",
      "runtime": 1250,
      "passedCount": 24,
      "totalCount": 24,
      "errorMessage": null,
      "createdAt": "2024-01-20T10:30:45.000Z"
    },
    {
      "id": "sub-uuid-12346",
      "userId": "user-123",
      "problemId": "prob-456",
      "code": "def solution(s, d): ...",
      "language": "python",
      "status": "wrong_answer",
      "runtime": 160,
      "passedCount": 2,
      "totalCount": 24,
      "errorMessage": "Wrong Answer on test case 3",
      "createdAt": "2024-01-20T10:15:00.000Z"
    }
  ]
}
```

---

## Error Responses

### Unauthorized Access
```json
{
  "success": false,
  "message": "Unauthorized: You can only view your own submissions"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Submission not found"
}
```

### Invalid Request
```json
{
  "success": false,
  "message": "problemSlug is required"
}
```

### Unsupported Problem
```json
{
  "success": false,
  "message": "Dynamic test case generation not supported for problem slug: unsupported-problem"
}
```

