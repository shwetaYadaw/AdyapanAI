# Execution Engine Setup Guide

Complete guide to set up and run the new production-grade Execution Engine for the Adyapan AI DSA Platform.

## Overview

The Execution Engine is a standalone microservice that handles all code compilation, execution, and judging in isolated Docker containers. It replaces the previous Judge0-based system with a more secure, scalable, and customizable solution.

## Architecture

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────────┐
│   Backend   │─────▶│ Execution Engine │
└─────────────┘      └────────┬─────────┘
                              │
                     ┌────────┴────────┐
                     │                 │
                     ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │  Docker  │      │  Redis   │
              │ Sandbox  │      │  Queue   │
              └──────────┘      └──────────┘
```

## Prerequisites

Before setting up the Execution Engine, ensure you have:

1. **Docker** (20.10+)
   ```bash
   docker --version
   ```

2. **Redis** (6.0+)
   ```bash
   redis-cli ping
   ```

3. **Node.js** (20+)
   ```bash
   node --version
   ```

## Quick Start

### 1. Install Dependencies

```bash
# From project root
cd apps/execution-engine
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit configuration
# On Windows: notepad .env
# On Linux/Mac: nano .env
```

**Minimum required configuration:**

```env
NODE_ENV=development
PORT=8001
API_KEY=dev_secure_api_key_min_32_characters

REDIS_HOST=localhost
REDIS_PORT=6379

BACKEND_API_URL=http://localhost:5000
BACKEND_API_KEY=dev_backend_api_key_min_32_characters

ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Build Docker Runner Images

This is **critical** - the Execution Engine requires Docker images for each language:

```bash
# Build all language runners
npm run docker:build-runners
```

This will build:
- `adyapan/runner-cpp:latest`
- `adyapan/runner-java:latest`
- `adyapan/runner-python:latest`
- `adyapan/runner-javascript:latest`

**Verify images:**
```bash
docker images | grep adyapan/runner
```

### 4. Start Redis

If not already running:

**Windows:**
```bash
# Install Redis via Chocolatey
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

**Linux/Mac:**
```bash
sudo systemctl start redis
# or
redis-server
```

**Verify:**
```bash
redis-cli ping
# Should return: PONG
```

### 5. Start the Execution Engine

```bash
# Development mode (auto-reload)
npm run dev

# Or from project root
yarn dev:execution
```

**Expected output:**
```
╔═══════════════════════════════════════════════╗
║     ADYAPAN EXECUTION ENGINE                  ║
║  Environment : development                    ║
║  Port        : 8001                           ║
║  URL         : http://localhost:8001          ║
║  Docker      : Connected                      ║
║  Redis       : Connected                      ║
╚═══════════════════════════════════════════════╝
```

### 6. Verify Setup

Test the health endpoint:

```bash
curl http://localhost:8001/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Execution Engine is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.2
}
```

## Backend Integration

### 1. Update Backend Environment

Add to `apps/backend/.env`:

```env
EXECUTION_ENGINE_URL=http://localhost:8001
EXECUTION_ENGINE_API_KEY=dev_secure_api_key_min_32_characters
```

### 2. Update Execution Engine Environment

The API key in the Execution Engine's `.env` must match the one in Backend's `.env`:

**Backend `.env`:**
```env
EXECUTION_ENGINE_API_KEY=dev_secure_api_key_min_32_characters
```

**Execution Engine `.env`:**
```env
API_KEY=dev_secure_api_key_min_32_characters
BACKEND_API_KEY=dev_backend_api_key_min_32_characters
```

### 3. Start All Services

```bash
# From project root
yarn dev:all

# Or start individually:
yarn dev:backend       # Port 5000
yarn dev:web           # Port 3000
yarn dev:execution     # Port 8001
```

## Testing the Integration

### 1. Test Run Code (Synchronous)

```bash
curl -X POST http://localhost:8001/api/execute/run \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev_secure_api_key_min_32_characters" \
  -d '{
    "code": "print(\"Hello from Execution Engine!\")",
    "language": "python",
    "input": ""
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "output": "Hello from Execution Engine!",
    "error": "",
    "runtime": 120,
    "memory": 15,
    "verdict": "AC",
    "timeout": false
  }
}
```

### 2. Test Submit Code (Asynchronous)

```bash
curl -X POST http://localhost:8001/api/execute/submit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev_secure_api_key_min_32_characters" \
  -d '{
    "submissionId": "test-123",
    "code": "n = int(input())\nprint(n * 2)",
    "language": "python",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "10",
        "isHidden": false
      }
    ]
  }'
```

### 3. Test from Frontend

1. Start all services (`yarn dev:all`)
2. Open browser: http://localhost:3000
3. Navigate to a coding problem
4. Write code and click "Run Code" or "Submit"
5. Check execution engine logs to see requests

## API Endpoints

The Execution Engine provides these endpoints:

### Public (No Auth)
- `GET /health` - Health check
- `GET /health/detailed` - Detailed health check

### Protected (Requires API Key)
- `POST /api/execute/run` - Run code with custom input
- `POST /api/execute/submit` - Submit for async judging
- `POST /api/execute/judge` - Judge synchronously
- `GET /api/execute/status/:jobId` - Get submission status
- `GET /api/execute/languages` - Get supported languages
- `GET /api/execute/stats` - Get queue statistics

See [API.md](apps/execution-engine/API.md) for complete documentation.

## Supported Languages

| Language   | Version | Docker Image |
|------------|---------|--------------|
| C++        | GCC 13.2 | adyapan/runner-cpp |
| Java       | OpenJDK 17 | adyapan/runner-java |
| Python     | 3.11 | adyapan/runner-python |
| JavaScript | Node 20 | adyapan/runner-javascript |

## Security Features

✅ **Docker Isolation** - Every execution in a fresh container  
✅ **Resource Limits** - CPU, memory, process, and time limits  
✅ **Network Isolation** - No internet access for user code  
✅ **File System Restrictions** - Read-only root filesystem  
✅ **Capability Dropping** - All Linux capabilities dropped  
✅ **Non-root Execution** - Code runs as unprivileged user  
✅ **Anti-Cheat** - Hardcoded output detection  
✅ **Auto Cleanup** - Automatic container and file cleanup  

## Monitoring & Debugging

### View Logs

```bash
# Execution engine logs
cd apps/execution-engine
tail -f logs/execution-engine.log

# Or if using console logging (development)
# Logs appear in terminal where npm run dev was executed
```

### Check Queue Status

```bash
curl -H "X-API-Key: your_api_key" http://localhost:8001/api/execute/stats
```

### Check Docker Containers

```bash
# List running execution containers
docker ps --filter "label=adyapan-runner=true"

# Should be empty when no executions are running
# Containers are auto-cleaned after execution
```

### Check Redis Queue

```bash
redis-cli

# Check queue length
LLEN bull:execution-queue:wait

# Monitor commands
MONITOR
```

## Troubleshooting

### Issue: "Docker daemon is not accessible"

**Solution:**
```bash
# Check Docker is running
docker ps

# Windows: Start Docker Desktop

# Linux: Start Docker service
sudo systemctl start docker
```

### Issue: "Redis connection failed"

**Solution:**
```bash
# Check Redis is running
redis-cli ping

# Start Redis
# Windows: redis-server
# Linux: sudo systemctl start redis
```

### Issue: "Docker images not found"

**Solution:**
```bash
# Build images
cd apps/execution-engine
npm run docker:build-runners

# Verify
docker images | grep adyapan/runner
```

### Issue: "API key invalid"

**Solution:**
Make sure the API key matches in both:
- Backend `.env`: `EXECUTION_ENGINE_API_KEY`
- Execution Engine `.env`: `API_KEY`

### Issue: "Containers not cleaned up"

**Solution:**
```bash
# Manual cleanup
npm run docker:clean

# Or
docker ps -a --filter "label=adyapan-runner=true" -q | xargs docker rm -f
```

### Issue: "High memory usage"

**Solution:**
```bash
# Check Docker stats
docker stats

# Clean up temp files
rm -rf apps/execution-engine/temp/*

# Restart execution engine
```

## Development Tips

### Adding a New Language

1. Create Dockerfile in `docker/<language>/Dockerfile`
2. Add language config in `src/config/languages.ts`
3. Build Docker image
4. Test execution

### Testing Individual Features

```bash
# Test C++ execution
curl -X POST http://localhost:8001/api/execute/run \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "code": "#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello C++\" << endl; return 0; }",
    "language": "cpp",
    "input": ""
  }'

# Test Java execution
curl -X POST http://localhost:8001/api/execute/run \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "code": "public class Solution { public static void main(String[] args) { System.out.println(\"Hello Java\"); } }",
    "language": "java",
    "input": ""
  }'
```

### Running Tests

```bash
cd apps/execution-engine
npm test
```

## Performance Tuning

### For Development

```env
# .env
DEFAULT_CPU_TIME_LIMIT=10
DEFAULT_MEMORY_LIMIT=512
CLEANUP_INTERVAL=600000
```

### For Production

```env
# .env
DEFAULT_CPU_TIME_LIMIT=5
DEFAULT_MEMORY_LIMIT=256
CLEANUP_INTERVAL=300000
AUTO_CLEANUP=true
LOG_LEVEL=warn
```

## Next Steps

1. **Review API Documentation**: Read [API.md](apps/execution-engine/API.md)
2. **Review Deployment Guide**: Read [DEPLOYMENT.md](apps/execution-engine/DEPLOYMENT.md)
3. **Test All Languages**: Try running code in all supported languages
4. **Test Submissions**: Create a problem and submit solutions
5. **Monitor Performance**: Check queue stats and Docker resource usage

## Additional Resources

- **Execution Engine README**: `apps/execution-engine/README.md`
- **API Documentation**: `apps/execution-engine/API.md`
- **Deployment Guide**: `apps/execution-engine/DEPLOYMENT.md`
- **Backend Integration**: `apps/backend/src/services/executionEngine.service.ts`

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check execution engine logs: `apps/execution-engine/logs/`
- Review Docker logs: `docker logs <container-id>`

## Summary

✅ **Standalone Service** - Runs independently from backend and AI service  
✅ **Docker Sandboxing** - Every execution in isolated container  
✅ **Multiple Languages** - C++, Java, Python, JavaScript  
✅ **Async Queue** - Scalable job processing with Bull + Redis  
✅ **Secure** - Resource limits, network isolation, anti-cheat  
✅ **Production-Ready** - Logging, monitoring, auto-cleanup  
✅ **Well-Documented** - Comprehensive API and deployment docs  

🎉 **Your execution engine is now ready to judge code like LeetCode!**
