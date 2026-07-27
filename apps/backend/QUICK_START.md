# Backend Quick Start Guide

## Setup

### 1. Install Dependencies
```bash
cd apps/backend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/adyapan_db
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_api_key_here
PORT=5000
```

### 3. Initialize Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the Server
```bash
npm run dev
```

---

## Test Submission Flow

### Step 1: Create a Problem
```bash
# Load the smallest number problem with dynamic test cases
npm run ts-node -- src/scripts/updateSmallestNumberProblem.ts
```

### Step 2: Submit a Solution
```bash
curl -X POST http://localhost:5000/problems/[PROBLEM_ID]/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "code": "def smallestNumberWithDigitSum(s, d):\n    if s < 1 or s > 9 * d:\n        return \"-1\"\n    result = [0] * d\n    result[0] = 1\n    remaining = s - 1\n    for i in range(d - 1, -1, -1):\n        if remaining == 0:\n            break\n        add = min(9, remaining)\n        result[i] += add\n        remaining -= add\n    result[0] += remaining\n    return \"\".join(map(str, result))",
    "language": "python"
  }'
```

Response:
```json
{
  "message": "Submission enqueued successfully",
  "data": {
    "submissionId": "uuid-12345",
    "status": "pending"
  }
}
```

### Step 3: Check Submission Status
```bash
curl -X GET http://localhost:5000/problems/submissions/uuid-12345 \
  -H "Authorization: Bearer [TOKEN]"
```

### Step 4: View Execution Logs
```bash
curl -X GET http://localhost:5000/problems/execution-logs/uuid-12345 \
  -H "Authorization: Bearer [TOKEN]"
```

---

## Key Services

### 1. TestCaseGeneratorService
```typescript
import { testCaseGeneratorService } from '../services/testCaseGenerator.service';

// Generate and verify test cases
const testCases = testCaseGeneratorService.generateAndVerifyTestCases({
  problemSlug: 'smallest-number-with-given-digit-sum',
  visibleCount: 6,
  hiddenCount: 18,
});

// Output:
// [TEST CASE GENERATOR] Generating test cases for "Smallest Number..."
// [VISIBLE] Input: 0 1 → Output: -1
// [HIDDEN] Input: 1 2 → Output: -1
// [VERIFY COMPLETE] 24/24 test cases verified successfully
```

### 2. JudgeService
```typescript
import { JudgeService } from '../services/judge.service';

const judge = new JudgeService();

const result = await judge.runTestCase(
  code,           // User's code as string
  'python',       // Language
  '9 2',          // Input
  '18',           // Expected output
  2000            // Time limit (ms)
);

// Output:
// {
//   passed: true,
//   actualOutput: '18',
//   runtime: 145,
//   errorMessage: undefined
// }
```

### 3. QueueService
```typescript
import { queueService } from '../services/queue.service';

// Enqueue a submission
await queueService.enqueue({
  submissionId: 'sub-123',
  problemId: 'prob-456',
  code: 'def solution(s, d): ...',
  language: 'python'
});

// Automatically processes in background
// Creates execution logs
// Updates submission result
// Stores final verdict
```

---

## Execution Log Examples

### Successful Submission
```
[SUBMIT DEBUG] Question ID: smallest-number | Language: python | Code Length: 512 bytes
[SUBMIT DEBUG] Total Test Cases: 24
[TC 1/24] Starting execution...
[TC 1/24] ✅ PASSED | Runtime: 45ms | Input: 0 1
[TC 2/24] Starting execution...
[TC 2/24] ✅ PASSED | Runtime: 50ms | Input: 1 1
[TC 3/24] Starting execution...
[TC 3/24] ✅ PASSED | Runtime: 48ms | Input: 9 2
...
✅ ACCEPTED | Passed: 24/24 | Runtime: 1250ms
```

### Failed Submission
```
[SUBMIT DEBUG] Question ID: smallest-number | Language: python | Code Length: 256 bytes
[SUBMIT DEBUG] Total Test Cases: 24
[TC 1/24] Starting execution...
[TC 1/24] ✅ PASSED | Runtime: 45ms | Input: 0 1
[TC 2/24] Starting execution...
[TC 2/24] ✅ PASSED | Runtime: 50ms | Input: 1 1
[TC 3/24] Starting execution...
[FAILED] Test Case 3/24 | Status: wrong_answer
[FAILED] Expected Output: "18" | Actual Output: "81" | Error: Wrong Answer

❌ WRONG_ANSWER | Passed: 2/24 | Runtime: 50ms
```

### Compilation Error
```
[SUBMIT DEBUG] Question ID: smallest-number | Language: java | Code Length: 512 bytes
[SUBMIT DEBUG] Total Test Cases: 24
[TC 1/24] Starting execution...
[FAILED] Test Case 1/24 | Status: compile_error
[FAILED] Compilation Error: Invalid syntax at line 5

❌ COMPILE_ERROR | Passed: 0/24 | Runtime: 0ms
```

---

## Database Queries

### Get Submission with Logs
```sql
SELECT 
  s.id,
  s.status,
  s.language,
  s.runtime,
  s.passedCount,
  s.totalCount,
  COUNT(el.id) as logCount
FROM submission s
LEFT JOIN execution_log el ON el.submissionId = s.id
WHERE s.id = 'uuid-12345'
GROUP BY s.id;
```

### Get User's Submissions
```sql
SELECT 
  s.id,
  s.status,
  s.language,
  s.runtime,
  s.passedCount,
  s.totalCount,
  ROUND((s.passedCount::float / s.totalCount) * 100, 0) as score,
  s.createdAt
FROM submission s
WHERE s.userId = 'user-123'
ORDER BY s.createdAt DESC
LIMIT 20;
```

### Get Problem Statistics
```sql
SELECT 
  p.id,
  p.title,
  COUNT(s.id) as totalSubmissions,
  SUM(CASE WHEN s.status = 'accepted' THEN 1 ELSE 0 END) as acceptedCount,
  ROUND(AVG(s.runtime), 0) as avgRuntime
FROM problem p
LEFT JOIN submission s ON s.problemId = p.id
GROUP BY p.id
ORDER BY totalSubmissions DESC;
```

---

## Testing

### Run Tests
```bash
npm test
```

### Test a Submission Manually
```typescript
// test-submission.ts
import { JudgeService } from './services/judge.service';

const judge = new JudgeService();

const pythonCode = `
def smallestNumberWithDigitSum(s, d):
    if s < 1 or s > 9 * d:
        return "-1"
    result = [0] * d
    result[0] = 1
    remaining = s - 1
    for i in range(d - 1, -1, -1):
        add = min(9, remaining)
        result[i] += add
        remaining -= add
    result[0] += remaining
    return ''.join(map(str, result))

# Read input
line = input().strip()
s, d = map(int, line.split())
print(smallestNumberWithDigitSum(s, d))
`;

(async () => {
  const result = await judge.runTestCase(
    pythonCode,
    'python',
    '9 2',
    '18',
    2000
  );
  
  console.log('Test Result:');
  console.log(`- Passed: ${result.passed}`);
  console.log(`- Output: ${result.actualOutput}`);
  console.log(`- Runtime: ${result.runtime}ms`);
  console.log(`- Error: ${result.errorMessage || 'None'}`);
})();
```

Run:
```bash
npx ts-node test-submission.ts
```

---

## Common Issues

### Issue: Judge0 API Unreachable
**Solution:** Falls back to local execution using Node.js/Python/G++/Javac
```
Judge0 API unreachable, attempting local child_process execution fallback...
```

### Issue: Timeout on Long-Running Code
```
Time Limit Exceeded: Execution took longer than 2000ms
```
**Solution:** Optimize algorithm or increase time limit in problem config

### Issue: Whitespace Mismatch
```
Expected: "18"
Actual: "18 \n"
```
**Solution:** Flexible comparison handles this automatically

---

## Performance Tips

1. **Parallel Execution**: Process multiple submissions simultaneously
   ```typescript
   // Currently sequential, can be made parallel with worker threads
   ```

2. **Caching**: Cache test case generation results
   ```typescript
   const cacheKey = `${problemSlug}-${visibleCount}-${hiddenCount}`;
   ```

3. **Database Indexes**: Add indexes on frequently queried columns
   ```sql
   CREATE INDEX idx_submission_userId ON submission(userId);
   CREATE INDEX idx_submission_status ON submission(status);
   CREATE INDEX idx_execution_log_submissionId ON execution_log(submissionId);
   ```

---

## Deployment

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "run", "start"]
```

### Environment Variables
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=...
PORT=5000
LOG_LEVEL=info
```

---

## Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Submission Queue Status
```bash
curl http://localhost:5000/admin/queue-status
```

### Database Connection
```bash
npx prisma db query "SELECT 1"
```

---

## Related Documentation

- [Full System Documentation](./SUBMISSION_SYSTEM.md)
- [Test Case Generation](./src/services/testCaseGenerator.service.ts)
- [Judge Service](./src/services/judge.service.ts)
- [Queue Service](./src/services/queue.service.ts)
- [Problem Routes](./src/routes/problem.routes.ts)

---

## Support

For issues or questions:
1. Check execution logs for error details
2. Review the full system documentation
3. Check Judge0 API status
4. Verify database connectivity
5. Check environment variables

---

Generated: January 2024
Version: 1.0.0
