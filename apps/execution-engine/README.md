# Adyapan Execution Engine

Production-grade online code execution and judging system for the Adyapan AI DSA Platform.

## Overview

The Execution Engine is a standalone microservice responsible for securely compiling, executing, and judging user-submitted code in isolated Docker containers. It supports multiple programming languages and provides both synchronous and asynchronous execution modes.

## Features

- ✅ **Multi-Language Support**: C++, Java, Python, JavaScript
- ✅ **Docker Sandboxing**: Every execution runs in an isolated container
- ✅ **Resource Limiting**: CPU, memory, process, and time limits
- ✅ **Secure Execution**: No internet access, restricted file system, dropped capabilities
- ✅ **Async Queue Processing**: Bull queue with Redis for scalable submission handling
- ✅ **Anti-Cheat Detection**: Hardcoded output detection
- ✅ **Comprehensive Logging**: Winston-based logging with file rotation
- ✅ **Health Monitoring**: Detailed health checks for Docker, Redis, and services
- ✅ **Rate Limiting**: Protection against abuse
- ✅ **Auto Cleanup**: Automatic cleanup of orphaned containers and temporary files

## Architecture

```
Frontend
    │
    ▼
Backend API
    │
    ▼
Execution Engine (This Service)
    │
    ├─── Docker Sandbox
    │    ├── C++ Runner
    │    ├── Java Runner
    │    ├── Python Runner
    │    └── JavaScript Runner
    │
    ├─── Judge Engine
    │    ├── Run Code (Sync)
    │    ├── Submit Code (Async)
    │    └── Test Case Judging
    │
    └─── Queue System (Bull + Redis)
         ├── Job Processing
         ├── Result Callbacks
         └── Backend Integration
```

## Installation

### Prerequisites

- Node.js >= 20.0.0
- Docker Engine
- Redis Server

### Setup

1. **Install dependencies**:
   ```bash
   cd apps/execution-engine
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build Docker runner images**:
   ```bash
   npm run docker:build-runners
   ```

4. **Start the service**:
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `8001` |
| `API_KEY` | API key for authentication | Required |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | - |
| `DEFAULT_CPU_TIME_LIMIT` | CPU time limit (seconds) | `5` |
| `DEFAULT_MEMORY_LIMIT` | Memory limit (MB) | `256` |
| `DEFAULT_MAX_PROCESSES` | Max processes per container | `20` |
| `DOCKER_SOCKET_PATH` | Docker socket path | `/var/run/docker.sock` |
| `AUTO_CLEANUP` | Enable auto cleanup | `true` |
| `CLEANUP_INTERVAL` | Cleanup interval (ms) | `300000` |
| `BACKEND_API_URL` | Backend API URL | Required |
| `BACKEND_API_KEY` | Backend API key | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

## API Endpoints

### Execute

#### POST `/api/execute/run`
Execute code with custom input (synchronous).

**Request**:
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "input": "",
  "timeLimit": 5,
  "memoryLimit": 256
}
```

**Response**:
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

#### POST `/api/execute/submit`
Submit code for async judging (enqueues job).

**Request**:
```json
{
  "submissionId": "uuid",
  "code": "def solve(n): return n * 2",
  "language": "python",
  "testCases": [
    {
      "input": "5",
      "expectedOutput": "10",
      "isHidden": false
    }
  ],
  "timeLimit": 5,
  "memoryLimit": 256
}
```

**Response**:
```json
{
  "success": true,
  "message": "Submission enqueued successfully",
  "data": {
    "submissionId": "uuid",
    "jobId": "job-id",
    "status": "queued"
  }
}
```

#### POST `/api/execute/judge`
Judge code synchronously (wait for result).

**Request**: Same as `/submit`

**Response**:
```json
{
  "success": true,
  "data": {
    "verdict": "AC",
    "totalTests": 10,
    "passedTests": 10,
    "failedTests": 0,
    "runtime": 1250,
    "memory": 45,
    "testResults": [
      {
        "testNumber": 1,
        "passed": true,
        "input": "5",
        "expectedOutput": "10",
        "actualOutput": "10",
        "runtime": 125,
        "memory": 15,
        "verdict": "AC"
      }
    ]
  }
}
```

#### GET `/api/execute/status/:jobId`
Get status of queued submission.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "job-id",
    "status": "completed",
    "progress": 100,
    "result": { /* JudgmentResult */ },
    "finishedOn": 1234567890
  }
}
```

#### GET `/api/execute/languages`
Get supported languages.

**Response**:
```json
{
  "success": true,
  "data": {
    "languages": ["cpp", "java", "python", "javascript"],
    "count": 4
  }
}
```

#### GET `/api/execute/stats`
Get queue statistics.

### Health

#### GET `/health`
Basic health check.

#### GET `/health/detailed`
Detailed health check (Docker, Redis, Judge service).

#### GET `/health/docker`
Check Docker images.

## Verdicts

- `AC` - Accepted
- `WA` - Wrong Answer
- `TLE` - Time Limit Exceeded
- `MLE` - Memory Limit Exceeded
- `RE` - Runtime Error
- `CE` - Compilation Error

## Security Features

1. **Docker Isolation**: Every execution runs in a fresh, isolated container
2. **Resource Limits**:
   - CPU time limit
   - Memory limit
   - Process limit
   - File size limit
3. **Network Isolation**: No internet access (`NetworkMode: 'none'`)
4. **Capability Dropping**: All Linux capabilities dropped
5. **Read-only Root**: Restricted file system access
6. **Non-root User**: Executions run as unprivileged user
7. **Auto Cleanup**: Containers and temp files cleaned automatically

## Integration with Backend

The Execution Engine automatically sends results back to the backend API:

```typescript
// Backend should implement this endpoint
POST /api/submissions/:submissionId/result

{
  "submissionId": "uuid",
  "status": "accepted",
  "runtime": 1250,
  "memory": 45,
  "passedCount": 10,
  "totalCount": 10,
  "testResults": [...]
}
```

## Scaling

The Execution Engine is designed for horizontal scaling:

1. **Stateless**: No local state, can run multiple instances
2. **Queue-based**: Bull queue handles distribution
3. **Redis**: Shared queue state across instances
4. **Docker**: Isolated executions per container
5. **Load Balancing**: Use nginx/ALB to distribute traffic

## Monitoring

### Logs

Logs are written to:
- Console (development)
- File: `logs/execution-engine.log` (production)

### Metrics

- Queue statistics: `/api/execute/stats`
- Health status: `/health/detailed`
- Docker images: `/health/docker`

## Maintenance

### Cleanup Orphaned Containers

```bash
npm run docker:clean
```

### Rebuild Docker Images

```bash
npm run docker:build-runners
```

### Manual Cleanup

```bash
docker system prune -af --filter "label=adyapan-runner=true"
```

## Development

```bash
# Start in development mode
npm run dev

# Build
npm run build

# Lint
npm run lint

# Test
npm test
```

## Troubleshooting

### Docker Connection Issues

```bash
# Check Docker is running
docker ps

# Check socket permissions
ls -la /var/run/docker.sock
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Check Redis connection
redis-cli -h localhost -p 6379
```

### Container Not Cleaned Up

```bash
# List all containers
docker ps -a --filter "label=adyapan-runner=true"

# Remove manually
docker rm -f <container-id>
```

## License

MIT
