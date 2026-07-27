# Execution Engine Deployment Checklist

Complete checklist for deploying the Execution Engine from development to production.

## Pre-Deployment Checklist

### ☐ Environment Setup

- [ ] Docker installed and running (version 20.10+)
- [ ] Redis installed and running (version 6.0+)
- [ ] Node.js installed (version 20+)
- [ ] Git repository access configured
- [ ] Server meets minimum requirements (4GB RAM, 2 CPU cores)

### ☐ Build Docker Images

```bash
cd apps/execution-engine
npm run docker:build-runners
```

- [ ] `adyapan/runner-cpp:latest` built successfully
- [ ] `adyapan/runner-java:latest` built successfully
- [ ] `adyapan/runner-python:latest` built successfully
- [ ] `adyapan/runner-javascript:latest` built successfully

Verify:
```bash
docker images | grep adyapan/runner
```

### ☐ Configuration

- [ ] `.env` file created from `.env.example`
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` configured (default: 8001)
- [ ] `API_KEY` generated (min 32 characters)
- [ ] `REDIS_HOST` and `REDIS_PORT` configured
- [ ] `DOCKER_SOCKET_PATH` verified
- [ ] `BACKEND_API_URL` configured
- [ ] `BACKEND_API_KEY` set and matches backend
- [ ] `ALLOWED_ORIGINS` configured for production domains
- [ ] `LOG_LEVEL` set appropriately (info/warn)

### ☐ Backend Configuration

- [ ] Backend `.env` updated with:
  - `EXECUTION_ENGINE_URL=http://localhost:8001`
  - `EXECUTION_ENGINE_API_KEY=<matching_api_key>`
- [ ] Backend routes updated to use new submission endpoints
- [ ] Backend `executionEngine.service.ts` configured

### ☐ Dependencies

```bash
cd apps/execution-engine
npm install --production
npm run build
```

- [ ] All dependencies installed
- [ ] TypeScript compiled successfully
- [ ] `dist/` directory created

## Testing Checklist

### ☐ Local Testing

#### Health Checks
- [ ] Basic health check works:
  ```bash
  curl http://localhost:8001/health
  ```
- [ ] Detailed health check shows all services healthy:
  ```bash
  curl http://localhost:8001/health/detailed
  ```
- [ ] Docker images check passes:
  ```bash
  curl http://localhost:8001/health/docker
  ```

#### Execution Tests
- [ ] Python execution works:
  ```bash
  curl -X POST http://localhost:8001/api/execute/run \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your_api_key" \
    -d '{"code":"print(\"Hello\")","language":"python","input":""}'
  ```

- [ ] C++ execution works:
  ```bash
  curl -X POST http://localhost:8001/api/execute/run \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your_api_key" \
    -d '{"code":"#include <iostream>\nusing namespace std;\nint main() { cout << \"Hello\" << endl; return 0; }","language":"cpp","input":""}'
  ```

- [ ] Java execution works:
  ```bash
  curl -X POST http://localhost:8001/api/execute/run \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your_api_key" \
    -d '{"code":"public class Solution { public static void main(String[] args) { System.out.println(\"Hello\"); } }","language":"java","input":""}'
  ```

- [ ] JavaScript execution works:
  ```bash
  curl -X POST http://localhost:8001/api/execute/run \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your_api_key" \
    -d '{"code":"console.log(\"Hello\")","language":"javascript","input":""}'
  ```

#### Judge Tests
- [ ] Submission judging works (sync):
  ```bash
  curl -X POST http://localhost:8001/api/execute/judge \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your_api_key" \
    -d '{"code":"n = int(input())\nprint(n * 2)","language":"python","testCases":[{"input":"5","expectedOutput":"10","isHidden":false}]}'
  ```

- [ ] Async submission works:
  ```bash
  curl -X POST http://localhost:8001/api/execute/submit \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your_api_key" \
    -d '{"submissionId":"test-123","code":"print(input())","language":"python","testCases":[{"input":"hello","expectedOutput":"hello","isHidden":false}]}'
  ```

- [ ] Queue status retrieval works:
  ```bash
  curl -H "X-API-Key: your_api_key" http://localhost:8001/api/execute/stats
  ```

#### Error Handling Tests
- [ ] Invalid API key rejected (401)
- [ ] Invalid language rejected (400)
- [ ] Compilation error handled correctly
- [ ] Runtime error handled correctly
- [ ] Time limit exceeded handled correctly

### ☐ Backend Integration Testing

- [ ] Backend can communicate with Execution Engine
- [ ] Run code endpoint works through backend:
  ```bash
  curl -X POST http://localhost:5000/api/v1/submissions/:problemId/run \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer your_jwt" \
    -d '{"code":"print(1)","language":"python","input":""}'
  ```

- [ ] Submit endpoint works through backend:
  ```bash
  curl -X POST http://localhost:5000/api/v1/submissions/:problemId/submit \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer your_jwt" \
    -d '{"code":"print(1)","language":"python"}'
  ```

- [ ] Submission results are stored in database
- [ ] Submission callback updates database correctly
- [ ] XP rewards work for accepted submissions

### ☐ Frontend Testing

- [ ] Navigate to problem page
- [ ] Write code in Monaco editor
- [ ] Click "Run Code" - output displays correctly
- [ ] Click "Submit" - submission is created
- [ ] Submission status updates in real-time
- [ ] View submission history
- [ ] All verdicts display correctly (AC, WA, TLE, etc.)

## Production Deployment Checklist

### ☐ Server Setup

- [ ] Production server provisioned
- [ ] SSH access configured
- [ ] Firewall rules configured:
  ```bash
  sudo ufw allow 8001/tcp
  sudo ufw allow from <backend-ip> to any port 8001
  ```
- [ ] Docker installed and configured
- [ ] Redis installed and secured
- [ ] Log directory created:
  ```bash
  sudo mkdir -p /var/log/execution-engine
  sudo chown node:docker /var/log/execution-engine
  ```

### ☐ Application Deployment

- [ ] Code deployed to server:
  ```bash
  cd /opt
  git clone <repo-url>
  cd adyapan/apps/execution-engine
  ```

- [ ] Production dependencies installed:
  ```bash
  npm install --production
  npm run build
  ```

- [ ] Docker images built on server:
  ```bash
  npm run docker:build-runners
  ```

- [ ] Production `.env` configured
- [ ] Permissions set correctly:
  ```bash
  sudo chown -R node:docker /opt/adyapan/apps/execution-engine
  ```

### ☐ Systemd Service

- [ ] Service file created at `/etc/systemd/system/execution-engine.service`
- [ ] Service enabled:
  ```bash
  sudo systemctl enable execution-engine
  ```
- [ ] Service started:
  ```bash
  sudo systemctl start execution-engine
  ```
- [ ] Service status verified:
  ```bash
  sudo systemctl status execution-engine
  ```
- [ ] Service logs accessible:
  ```bash
  sudo journalctl -u execution-engine -f
  ```

### ☐ Logging

- [ ] Log directory exists and is writable
- [ ] Log rotation configured (`/etc/logrotate.d/execution-engine`)
- [ ] Log files are being created
- [ ] Log level appropriate for production
- [ ] Logs are readable:
  ```bash
  tail -f /var/log/execution-engine/execution-engine.log
  ```

### ☐ Monitoring

- [ ] Health check endpoint accessible
- [ ] Monitoring system configured (optional):
  - [ ] Prometheus metrics (if implemented)
  - [ ] Grafana dashboard (if implemented)
  - [ ] Alert rules configured
- [ ] Queue stats monitoring setup
- [ ] Docker resource monitoring setup

### ☐ Load Balancer / Reverse Proxy

If using Nginx or similar:

- [ ] Nginx installed and configured
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Upstream configuration added
- [ ] Proxy settings configured
- [ ] Rate limiting configured
- [ ] Nginx reloaded:
  ```bash
  sudo nginx -t
  sudo systemctl reload nginx
  ```

### ☐ Security

- [ ] Strong API keys generated (32+ characters)
- [ ] API keys stored securely (environment variables, not code)
- [ ] Firewall configured to restrict access
- [ ] Docker socket permissions verified
- [ ] Redis password configured
- [ ] Rate limiting enabled
- [ ] HTTPS configured (if public-facing)
- [ ] CORS origins restricted to production domains
- [ ] Security headers enabled (Helmet.js)

### ☐ Backup

- [ ] Configuration backup strategy in place
- [ ] Redis backup configured:
  ```bash
  # Add to crontab
  0 2 * * * redis-cli SAVE && cp /var/lib/redis/dump.rdb /backup/redis-$(date +\%Y\%m\%d).rdb
  ```
- [ ] Docker images backed up
- [ ] Logs backup strategy in place

## Post-Deployment Checklist

### ☐ Verification

- [ ] Health check responds:
  ```bash
  curl https://execute.adyapan.com/health
  ```

- [ ] Detailed health check shows all green:
  ```bash
  curl https://execute.adyapan.com/health/detailed
  ```

- [ ] Test execution through production:
  ```bash
  curl -X POST https://execute.adyapan.com/api/execute/run \
    -H "Content-Type: application/json" \
    -H "X-API-Key: production_api_key" \
    -d '{"code":"print(\"Production test\")","language":"python","input":""}'
  ```

- [ ] Backend successfully communicates with Execution Engine
- [ ] Frontend successfully submits code
- [ ] Submissions are processed and stored
- [ ] Real users can submit code successfully

### ☐ Performance

- [ ] Response times acceptable (<2s for single execution)
- [ ] Queue processing rate acceptable
- [ ] Docker container cleanup working
- [ ] Memory usage within limits
- [ ] CPU usage reasonable
- [ ] No resource leaks detected

### ☐ Monitoring Setup

- [ ] Dashboard configured (if using)
- [ ] Alerts configured for:
  - [ ] Service down
  - [ ] High error rate
  - [ ] High queue length
  - [ ] High resource usage
  - [ ] Docker daemon issues
- [ ] Log aggregation configured (optional)
- [ ] Performance metrics tracked

### ☐ Documentation

- [ ] Deployment documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide accessible
- [ ] Runbook created for operations team
- [ ] Contact information updated

## Rollback Plan

### ☐ Rollback Preparation

- [ ] Previous version tagged in Git
- [ ] Rollback procedure documented
- [ ] Judge0 service still available (if needed)
- [ ] Database compatible with rollback

### ☐ Rollback Procedure (If Needed)

1. Stop Execution Engine:
   ```bash
   sudo systemctl stop execution-engine
   ```

2. Revert backend to use Judge0:
   ```bash
   # Update backend routes to use judge.service.ts
   ```

3. Restart backend:
   ```bash
   sudo systemctl restart backend
   ```

4. Verify Judge0 working

## Maintenance Checklist

### ☐ Daily Tasks

- [ ] Check service status
- [ ] Monitor error logs
- [ ] Check queue length
- [ ] Verify Docker containers cleaning up

### ☐ Weekly Tasks

- [ ] Review logs for patterns
- [ ] Check disk usage
- [ ] Verify backups
- [ ] Review performance metrics
- [ ] Clean up orphaned containers:
  ```bash
  npm run docker:clean
  ```

### ☐ Monthly Tasks

- [ ] Update dependencies
- [ ] Review and optimize Docker images
- [ ] Capacity planning review
- [ ] Security audit
- [ ] Update documentation

## Troubleshooting Reference

### Common Issues

**Service won't start:**
```bash
sudo journalctl -u execution-engine -n 50
sudo systemctl status execution-engine
```

**Docker issues:**
```bash
docker ps
docker logs <container-id>
sudo systemctl status docker
```

**Redis issues:**
```bash
redis-cli ping
redis-cli INFO
sudo systemctl status redis
```

**High memory usage:**
```bash
docker stats
npm run docker:clean
rm -rf /opt/adyapan/apps/execution-engine/temp/*
```

## Sign-off

### ☐ Stakeholder Approvals

- [ ] Development team tested and approved
- [ ] QA team tested and approved
- [ ] Operations team trained and ready
- [ ] Security team reviewed
- [ ] Product owner approved

### ☐ Go-Live

- [ ] All checklist items completed
- [ ] Team notified of deployment
- [ ] Support team briefed
- [ ] Monitoring alerts active
- [ ] Documentation published

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________  

---

## Quick Reference

**Health Check:**
```bash
curl https://execute.adyapan.com/health
```

**Service Control:**
```bash
sudo systemctl status execution-engine
sudo systemctl restart execution-engine
sudo journalctl -u execution-engine -f
```

**Docker Management:**
```bash
docker ps --filter "label=adyapan-runner=true"
npm run docker:clean
```

**Logs:**
```bash
tail -f /var/log/execution-engine/execution-engine.log
```

**Queue Stats:**
```bash
curl -H "X-API-Key: $API_KEY" https://execute.adyapan.com/api/execute/stats
```

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

Mark items as you complete them. Keep this checklist for future deployments and updates.
