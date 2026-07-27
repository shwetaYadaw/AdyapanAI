# Migration Guide: Judge0 → Execution Engine

Guide for migrating from the Judge0-based execution system to the new production-grade Execution Engine.

## Why Migrate?

The new Execution Engine provides:

✅ **Better Security** - Full Docker isolation vs. process isolation  
✅ **No External Dependencies** - Self-hosted vs. Judge0 API dependency  
✅ **More Control** - Customizable runners and limits  
✅ **Better Integration** - Built specifically for Adyapan  
✅ **Scalability** - Independent microservice architecture  
✅ **Cost Effective** - No API subscription fees  
✅ **Extensibility** - Easy to add new languages  

## Architecture Changes

### Before (Judge0)
```
Backend → Judge0 API → Execute Code → Return Result
```

### After (Execution Engine)
```
Backend → Execution Engine → Docker Sandbox → Return Result
                ↓
           Redis Queue (Async)
```

## Migration Steps

### Step 1: Set Up Execution Engine

Follow the [EXECUTION_ENGINE_SETUP.md](./EXECUTION_ENGINE_SETUP.md) guide to:

1. Install dependencies
2. Configure environment variables
3. Build Docker runner images
4. Start the Execution Engine service

### Step 2: Update Backend Configuration

#### Add New Environment Variables

Update `apps/backend/.env`:

```env
# Add these lines
EXECUTION_ENGINE_URL=http://localhost:8001
EXECUTION_ENGINE_API_KEY=your_secure_api_key_here

# Keep Judge0 config for gradual migration (optional)
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=
```

### Step 3: Code Changes

#### Option A: Complete Migration (Recommended)

The new submission routes (`apps/backend/src/routes/submission.routes.ts`) already use the Execution Engine. Update your frontend to use these new endpoints:

**Old endpoints (Judge0):**
```
POST /api/v1/problems/:id/run
POST /api/v1/problems/:id/submit
```

**New endpoints (Execution Engine):**
```
POST /api/v1/submissions/:problemId/run
POST /api/v1/submissions/:problemId/submit
GET  /api/v1/submissions/:submissionId
GET  /api/v1/submissions/user/history
```

#### Option B: Gradual Migration

Keep both systems running and gradually migrate:

1. **Phase 1**: Use Execution Engine for new submissions
2. **Phase 2**: Test extensively
3. **Phase 3**: Migrate all traffic to Execution Engine
4. **Phase 4**: Remove Judge0 code

### Step 4: Update Frontend API Calls

#### Before (Judge0 via Backend)

```typescript
// Run code
const response = await fetch('/api/v1/problems/:id/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code,
    language,
    input,
  }),
});
```

#### After (Execution Engine)

```typescript
// Run code (same interface, just different endpoint)
const response = await fetch('/api/v1/submissions/:problemId/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code,
    language,
    input,
  }),
});
```

**The response format is similar**, so minimal frontend changes are needed!

### Step 5: Update Problem Routes (Optional)

If you want to keep using the `/api/v1/problems/:id/run` endpoints but switch to Execution Engine, update the judge service import:

**Before:**
```typescript
// apps/backend/src/routes/problem.routes.ts
import { JudgeService } from '../services/judge.service';
const judge = new JudgeService();
```

**After:**
```typescript
// apps/backend/src/routes/problem.routes.ts
import { executionEngineService } from '../services/executionEngine.service';

// Replace judge.runTestCase() calls with:
const result = await executionEngineService.runCode(code, language, input);
```

### Step 6: Database Compatibility

The new Execution Engine uses the same database schema - **no migrations needed**!

The `Submission` and `SubmissionResult` models remain unchanged.

### Step 7: Testing

#### Test Individual Execution

```bash
# Test run code
curl -X POST http://localhost:8001/api/execute/run \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "code": "print(\"Hello\")",
    "language": "python",
    "input": ""
  }'
```

#### Test Backend Integration

```bash
# Test via backend (old endpoint)
curl -X POST http://localhost:5000/api/v1/problems/:problemId/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "code": "print(\"Hello\")",
    "language": "python",
    "input": ""
  }'

# Test via backend (new endpoint)
curl -X POST http://localhost:5000/api/v1/submissions/:problemId/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "code": "print(\"Hello\")",
    "language": "python",
    "input": ""
  }'
```

#### Test Complete Flow

1. Go to http://localhost:3000
2. Navigate to a problem page
3. Write code and click "Run Code"
4. Check Execution Engine logs for request
5. Verify output is displayed correctly
6. Click "Submit" and verify submission is judged
7. Check submission history

### Step 8: Monitor and Verify

#### Check Execution Engine Health

```bash
curl http://localhost:8001/health/detailed
```

#### Monitor Queue

```bash
curl -H "X-API-Key: your_api_key" http://localhost:8001/api/execute/stats
```

#### Check Logs

```bash
# Execution Engine logs
cd apps/execution-engine
tail -f logs/execution-engine.log

# Backend logs (look for execution engine calls)
cd apps/backend
# Check console output
```

## Feature Comparison

| Feature | Judge0 | Execution Engine |
|---------|--------|------------------|
| **Docker Isolation** | ❌ | ✅ |
| **Self-Hosted** | ⚠️ Complex | ✅ Easy |
| **API Dependency** | ✅ External | ✅ Internal |
| **Custom Runners** | ❌ | ✅ |
| **Resource Limits** | ✅ | ✅ |
| **Anti-Cheat** | ❌ | ✅ |
| **Queue System** | ❌ | ✅ |
| **Async Execution** | ⚠️ Polling | ✅ Native |
| **Callback Support** | ❌ | ✅ |
| **Language Support** | 60+ | 4 (Extensible) |
| **Cost** | $$$$ | Free |

## API Mapping

### Run Code

#### Judge0 (via Backend)
```typescript
// Old: judge.service.ts → Judge0 API
POST /submissions?wait=true
{
  source_code: base64(code),
  language_id: 71,
  stdin: base64(input),
  cpu_time_limit: 5
}
```

#### Execution Engine
```typescript
// New: executionEngine.service.ts → Execution Engine
POST /api/execute/run
{
  code: code,
  language: "python",
  input: input,
  timeLimit: 5
}
```

### Submit Code

#### Judge0 (via Backend)
```typescript
// Old: Sequential test case execution
for (const testCase of testCases) {
  const result = await judge.runTestCase(code, language, testCase.input, testCase.expectedOutput);
  results.push(result);
}
```

#### Execution Engine
```typescript
// New: Batch execution in Docker with queue
POST /api/execute/submit
{
  submissionId: "uuid",
  code: code,
  language: "python",
  testCases: [...],
  timeLimit: 5
}
// Returns immediately, result sent via callback
```

## Language Mapping

| Judge0 ID | Language | Execution Engine |
|-----------|----------|------------------|
| 76 | C++ (GCC 13.2) | `cpp` |
| 91 | Java (OpenJDK 17) | `java` |
| 71 | Python 3.11 | `python` |
| 93 | Node.js 20 | `javascript` |

## Breaking Changes

### 1. Language Names

**Before:**
```typescript
language: 'javascript' // or 'js'
language: 'python' // or 'py'
language: 'cpp' // or 'c++'
```

**After:**
```typescript
language: 'javascript' // Only 'javascript'
language: 'python' // Only 'python'
language: 'cpp' // Only 'cpp'
language: 'java' // Only 'java'
```

### 2. Verdict Format

**Before (Judge0):**
```typescript
status: {
  id: 3,
  description: "Accepted"
}
```

**After (Execution Engine):**
```typescript
verdict: "AC" // AC, WA, TLE, MLE, RE, CE
```

### 3. Response Structure

**Before (Judge0 via judge.service):**
```typescript
{
  passed: boolean,
  actualOutput: string,
  runtime: number,
  errorType?: string,
  errorMessage?: string
}
```

**After (Execution Engine):**
```typescript
{
  output: string,
  error: string,
  runtime: number,
  memory: number,
  verdict: string,
  timeout: boolean
}
```

## Rollback Plan

If you need to rollback to Judge0:

### Option 1: Keep Both Systems

Keep Judge0 code and switch backend service:

```typescript
// apps/backend/src/routes/problem.routes.ts

// Rollback: Switch back to Judge0
import { JudgeService } from '../services/judge.service';
const judge = new JudgeService();

// Instead of:
// import { executionEngineService } from '../services/executionEngine.service';
```

### Option 2: Environment Variable Toggle

Add feature flag:

```typescript
// apps/backend/src/config/env.ts
USE_EXECUTION_ENGINE: z.boolean().default(true)

// In routes:
const result = env.USE_EXECUTION_ENGINE
  ? await executionEngineService.runCode(...)
  : await judge.runTestCase(...);
```

## Cleanup (After Successful Migration)

Once you're confident the Execution Engine is working:

### 1. Remove Judge0 Dependencies

```bash
cd apps/backend

# Remove Judge0 environment variables from .env
# Remove these lines:
# JUDGE0_API_URL=...
# JUDGE0_API_KEY=...
```

### 2. Remove Judge0 Service (Optional)

```bash
# If you were running Judge0 locally
docker-compose down judge0

# Or stop Judge0 service
sudo systemctl stop judge0
```

### 3. Update Documentation

Remove references to Judge0 in:
- README.md
- API documentation
- Setup guides

## Troubleshooting Migration

### Issue: "Cannot connect to Execution Engine"

**Check:**
1. Is Execution Engine running? `curl http://localhost:8001/health`
2. Is Docker running? `docker ps`
3. Is Redis running? `redis-cli ping`
4. Are API keys correct in both `.env` files?

### Issue: "Submissions failing with CE (Compilation Error)"

**Check:**
1. Are Docker images built? `docker images | grep adyapan/runner`
2. If not: `cd apps/execution-engine && npm run docker:build-runners`

### Issue: "Frontend still using old endpoints"

**Fix:**
Update frontend API client to use new submission routes:
```typescript
// Change this:
await api.post(`/problems/${id}/run`, ...)
// To this:
await api.post(`/submissions/${id}/run`, ...)
```

### Issue: "Different verdicts between Judge0 and Execution Engine"

This is expected due to different execution environments. The Execution Engine is more strict with:
- Resource limits
- Security restrictions
- Output formatting

**Solution:** Re-test your problems and adjust expected outputs if needed.

## Support

For migration issues:
- Check Execution Engine logs: `apps/execution-engine/logs/execution-engine.log`
- Check Backend logs for API calls
- Review [EXECUTION_ENGINE_SETUP.md](./EXECUTION_ENGINE_SETUP.md)
- Review [API.md](apps/execution-engine/API.md)

## Timeline Recommendation

**Week 1:**
- Set up Execution Engine
- Build Docker images
- Test locally with sample problems

**Week 2:**
- Deploy Execution Engine to staging
- Migrate 10% of traffic
- Monitor performance and errors

**Week 3:**
- Migrate 50% of traffic
- Fix any issues
- Update documentation

**Week 4:**
- Migrate 100% of traffic
- Remove Judge0 dependencies
- Celebrate! 🎉

## Summary

✅ **No Database Changes** - Same schema works with both systems  
✅ **Minimal API Changes** - Similar request/response formats  
✅ **Gradual Migration** - Can run both systems simultaneously  
✅ **Easy Rollback** - Keep Judge0 code for quick rollback  
✅ **Better Performance** - Docker isolation and async queue  
✅ **Cost Savings** - No Judge0 API subscription needed  

The migration is designed to be smooth and low-risk. Most changes are internal, and the API remains largely compatible.
