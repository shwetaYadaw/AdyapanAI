# Execution Engine Deployment Guide

Complete guide for deploying the Adyapan Execution Engine in production.

## Prerequisites

- Docker Engine 20.10+
- Redis 6.0+
- Node.js 20+
- Linux server (Ubuntu 22.04 LTS recommended)
- At least 4GB RAM, 2 CPU cores

## Production Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Verify installations
docker --version
docker-compose --version
node --version
redis-cli ping
```

### 2. Clone and Setup

```bash
# Clone repository
cd /opt
git clone <repository-url>
cd adyapan/apps/execution-engine

# Install dependencies
npm install --production

# Build TypeScript
npm run build
```

### 3. Build Docker Images

```bash
# Build all language runner images
npm run docker:build-runners

# Verify images
docker images | grep adyapan/runner
```

Expected output:
```
adyapan/runner-cpp         latest
adyapan/runner-java        latest
adyapan/runner-python      latest
adyapan/runner-javascript  latest
```

### 4. Configure Environment

```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

Production environment:
```env
NODE_ENV=production
PORT=8001
API_KEY=<generate-strong-random-key>

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>

DEFAULT_CPU_TIME_LIMIT=5
DEFAULT_MEMORY_LIMIT=256
DEFAULT_MAX_PROCESSES=20
DEFAULT_MAX_FILE_SIZE=10

DOCKER_SOCKET_PATH=/var/run/docker.sock
DOCKER_NETWORK=execution-network
AUTO_CLEANUP=true
CLEANUP_INTERVAL=300000

LOG_LEVEL=info
LOG_FILE_PATH=/var/log/execution-engine/execution-engine.log

ALLOWED_ORIGINS=https://adyapan.com,https://www.adyapan.com

BACKEND_API_URL=https://api.adyapan.com
BACKEND_API_KEY=<backend-api-key>
```

### 5. Create Systemd Service

Create `/etc/systemd/system/execution-engine.service`:

```ini
[Unit]
Description=Adyapan Execution Engine
After=network.target redis.service docker.service
Requires=redis.service docker.service

[Service]
Type=simple
User=node
Group=docker
WorkingDirectory=/opt/adyapan/apps/execution-engine
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/execution-engine/stdout.log
StandardError=append:/var/log/execution-engine/stderr.log

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/adyapan/apps/execution-engine/temp /var/log/execution-engine

# Resource Limits
LimitNOFILE=65536
LimitNPROC=4096
MemoryLimit=4G
CPUQuota=200%

[Install]
WantedBy=multi-user.target
```

### 6. Setup Logging

```bash
# Create log directory
sudo mkdir -p /var/log/execution-engine
sudo chown node:docker /var/log/execution-engine

# Setup log rotation
sudo nano /etc/logrotate.d/execution-engine
```

Add:
```
/var/log/execution-engine/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 node docker
    sharedscripts
    postrotate
        systemctl reload execution-engine > /dev/null 2>&1 || true
    endscript
}
```

### 7. Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable execution-engine

# Start service
sudo systemctl start execution-engine

# Check status
sudo systemctl status execution-engine

# View logs
sudo journalctl -u execution-engine -f
```

### 8. Configure Firewall

```bash
# UFW
sudo ufw allow 8001/tcp comment 'Execution Engine'

# Or iptables
sudo iptables -A INPUT -p tcp --dport 8001 -j ACCEPT
```

### 9. Nginx Reverse Proxy (Optional)

```nginx
upstream execution_engine {
    least_conn;
    server localhost:8001;
    # Add more instances for load balancing
    # server localhost:8002;
    # server localhost:8003;
}

server {
    listen 80;
    server_name execute.adyapan.com;

    # SSL configuration (use certbot)
    # listen 443 ssl http2;
    # ssl_certificate /etc/letsencrypt/live/execute.adyapan.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/execute.adyapan.com/privkey.pem;

    location / {
        proxy_pass http://execution_engine;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for long-running executions
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    location /health {
        proxy_pass http://execution_engine;
        access_log off;
    }
}
```

## Docker Compose Deployment (Alternative)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  execution-engine:
    build: .
    container_name: execution-engine
    restart: unless-stopped
    ports:
      - "8001:8001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./temp:/app/temp
      - ./logs:/app/logs
    depends_on:
      - redis
    networks:
      - execution-network

  redis:
    image: redis:7-alpine
    container_name: execution-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - execution-network

networks:
  execution-network:
    driver: bridge

volumes:
  redis-data:
```

Deploy:
```bash
docker-compose up -d
docker-compose logs -f
```

## Horizontal Scaling

### Multiple Instances

1. **Clone service for multiple ports:**

```bash
# Instance 1 (port 8001)
cp /etc/systemd/system/execution-engine.service /etc/systemd/system/execution-engine@8001.service

# Instance 2 (port 8002)
cp /etc/systemd/system/execution-engine.service /etc/systemd/system/execution-engine@8002.service

# Edit each service file to use different ports
```

2. **Update Nginx load balancer:**

```nginx
upstream execution_engine {
    least_conn;
    server localhost:8001 weight=1;
    server localhost:8002 weight=1;
    server localhost:8003 weight=1;
}
```

### Redis Cluster

For high availability, use Redis Cluster or Sentinel:

```bash
# Install Redis Sentinel
sudo apt install redis-sentinel

# Configure sentinel
sudo nano /etc/redis/sentinel.conf
```

## Monitoring

### Health Checks

```bash
# Basic health
curl http://localhost:8001/health

# Detailed health
curl http://localhost:8001/health/detailed

# Docker images
curl -H "X-API-Key: your-key" http://localhost:8001/health/docker

# Queue stats
curl -H "X-API-Key: your-key" http://localhost:8001/api/execute/stats
```

### Prometheus Metrics (Optional)

Install prometheus exporter:

```bash
npm install prom-client

# Add to src/server.ts
import promClient from 'prom-client';

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

### Log Monitoring

```bash
# Real-time logs
tail -f /var/log/execution-engine/execution-engine.log

# Error logs only
grep -i error /var/log/execution-engine/execution-engine.log

# Failed executions
grep -i "verdict.*RE\|CE\|TLE" /var/log/execution-engine/execution-engine.log
```

## Maintenance

### Regular Tasks

```bash
# Cleanup old logs (automated by logrotate)
sudo logrotate -f /etc/logrotate.d/execution-engine

# Cleanup Docker images
npm run docker:clean

# Cleanup orphaned containers (automated by service)
docker ps -a --filter "label=adyapan-runner=true" -q | xargs docker rm -f

# Clear temp files
find /opt/adyapan/apps/execution-engine/temp -type d -mtime +1 -exec rm -rf {} +

# Redis memory cleanup
redis-cli FLUSHALL
```

### Updates

```bash
# Pull latest code
cd /opt/adyapan
git pull origin main

# Install dependencies
cd apps/execution-engine
npm install --production

# Rebuild
npm run build

# Rebuild Docker images
npm run docker:build-runners

# Restart service
sudo systemctl restart execution-engine

# Verify
curl http://localhost:8001/health
```

## Security Hardening

### 1. Docker Security

```bash
# Enable Docker user namespace remapping
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "userns-remap": "default",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### 2. Firewall Rules

```bash
# Allow only backend server to access execution engine
sudo ufw deny 8001
sudo ufw allow from <backend-server-ip> to any port 8001
```

### 3. Rate Limiting

Implement rate limiting in Nginx:

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/execute {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://execution_engine;
}
```

### 4. API Key Rotation

```bash
# Generate new API key
openssl rand -hex 32

# Update .env
nano /opt/adyapan/apps/execution-engine/.env

# Restart service
sudo systemctl restart execution-engine
```

## Troubleshooting

### Service won't start

```bash
# Check logs
sudo journalctl -u execution-engine -n 50

# Check permissions
ls -la /var/run/docker.sock
sudo usermod -aG docker node

# Check ports
sudo netstat -tlnp | grep 8001
```

### Docker issues

```bash
# Check Docker daemon
sudo systemctl status docker

# Test Docker access
docker ps

# Check images
docker images | grep adyapan
```

### Redis connection issues

```bash
# Check Redis
redis-cli ping

# Check connections
redis-cli CLIENT LIST

# Monitor Redis
redis-cli MONITOR
```

### High memory usage

```bash
# Check container stats
docker stats

# Cleanup containers
npm run docker:clean

# Check temp directory
du -sh /opt/adyapan/apps/execution-engine/temp

# Clear temp files
rm -rf /opt/adyapan/apps/execution-engine/temp/*
```

## Backup

### Configuration Backup

```bash
# Backup config
tar -czf execution-engine-config-$(date +%Y%m%d).tar.gz \
  /opt/adyapan/apps/execution-engine/.env \
  /opt/adyapan/apps/execution-engine/docker \
  /etc/systemd/system/execution-engine.service
```

### Redis Backup

```bash
# Manual backup
redis-cli SAVE

# Copy RDB file
cp /var/lib/redis/dump.rdb /backup/redis-$(date +%Y%m%d).rdb

# Automated backup (add to crontab)
0 2 * * * redis-cli SAVE && cp /var/lib/redis/dump.rdb /backup/redis-$(date +\%Y\%m\%d).rdb
```

## Performance Tuning

### System Limits

```bash
# Increase file descriptors
sudo nano /etc/security/limits.conf
```

Add:
```
*    soft nofile 65536
*    hard nofile 65536
node soft nofile 65536
node hard nofile 65536
```

### Docker Performance

```bash
# Increase Docker concurrent operations
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "max-concurrent-downloads": 10,
  "max-concurrent-uploads": 10
}
```

### Redis Performance

```bash
# Edit Redis config
sudo nano /etc/redis/redis.conf
```

Optimize:
```
maxmemory 2gb
maxmemory-policy allkeys-lru
tcp-backlog 511
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/adyapan/adyapan
- Documentation: https://docs.adyapan.com
- Email: support@adyapan.com
