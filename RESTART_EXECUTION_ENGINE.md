# Restart Execution Engine

After making changes to the execution engine code, you need to restart it:

## Option 1: Using npm (Recommended)

```bash
cd apps/execution-engine
npm run dev
```

## Option 2: Kill and restart

**Windows:**
```cmd
# Find the process
netstat -ano | findstr :8001

# Kill it (replace PID with actual process ID)
taskkill /F /PID <PID>

# Restart
cd apps/execution-engine
npm run dev
```

**Linux/Mac:**
```bash
# Find and kill
lsof -ti:8001 | xargs kill -9

# Restart
cd apps/execution-engine
npm run dev
```

## Option 3: From project root

```bash
# Kill all node processes (nuclear option)
# Windows: taskkill /F /IM node.exe
# Linux/Mac: killall node

# Restart everything
yarn dev:all
```

## Verify it's running

```bash
curl http://localhost:8001/health
```

Should return: `{"success":true,"message":"Execution Engine is running",...}`
