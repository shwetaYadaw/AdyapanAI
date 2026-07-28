# Execution Engine Test

## 1. Start the Execution Engine

```bash
cd e:\AdyapanAI\AdyapanAI\apps\execution-engine
npm run start
```

Or in development mode:
```bash
npm run dev
```

## 2. Test Health Check

```bash
curl http://localhost:8001/health
```

Expected: `{"success":true,"message":"Execution Engine is running",...}`

## 3. Test Java Execution (Simple)

```bash
curl -X POST http://localhost:8001/api/execute/run ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: your_api_key" ^
  -d "{\"code\":\"import java.util.*; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); int n = sc.nextInt(); System.out.println(n * 2); } }\",\"language\":\"java\",\"input\":\"5\"}"
```

Expected output: `10`

## 4. Test Java Execution (Combinations Problem)

Save this to a file `test-java.json`:
```json
{
  "code": "import java.io.*; import java.util.*; public class Main { static void generate(int[] arr, int r, int index, int start, int[] temp) { if (index == r) { for (int i = 0; i < r; i++) { System.out.print(temp[i]); if (i < r - 1) System.out.print(\" \"); } System.out.println(); return; } for (int i = start; i <= arr.length - (r - index); i++) { temp[index] = arr[i]; generate(arr, r, index + 1, i + 1, temp); } } public static void main(String[] args) throws IOException { BufferedReader br = new BufferedReader(new InputStreamReader(System.in)); String[] parts = br.readLine().trim().split(\"\\\\s+\"); int[] arr = new int[parts.length]; for (int i = 0; i < parts.length; i++) { arr[i] = Integer.parseInt(parts[i]); } int r = Integer.parseInt(br.readLine().trim()); generate(arr, r, 0, 0, new int[r]); br.close(); } }",
  "language": "java",
  "input": "1 2 3 4\n2"
}
```

Then test:
```bash
curl -X POST http://localhost:8001/api/execute/run ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: your_api_key" ^
  --data-binary "@test-java.json"
```

Expected output:
```
1 2
1 3
1 4
2 3
2 4
3 4
```

## 5. Check Logs

If there are errors, check:
```bash
type logs\execution-engine.log
```

## Common Issues

### Issue: "Connection refused"
**Solution:** Execution engine not running. Start it with `npm run start`

### Issue: "API key invalid"
**Solution:** Check the API key matches in:
- Execution engine `.env`: `API_KEY=xxx`
- Backend `.env`: `EXECUTION_ENGINE_API_KEY=xxx`

### Issue: "Docker daemon not accessible"
**Solution:** Start Docker Desktop

### Issue: "Container timeout"
**Solution:** Increase timeout in `src/config/languages.ts`

### Issue: "NumberFormatException" in Java
**Solution:** Input format mismatch. Check the input validator is working.
