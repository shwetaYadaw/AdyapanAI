# How to Test the Template Fix

## Quick Test Steps

### 1. Restart Backend (Required)
```bash
cd e:\AdyapanAI\AdyapanAI
yarn dev:backend
```

Wait until you see:
```
✅ Backend server running on port 5000
```

### 2. Open Frontend
If not already running:
```bash
yarn dev:web
```

Navigate to: http://localhost:3000

### 3. Login as Student
- Email: Any student account
- Go to: Coding Portal

### 4. Test Previously Failing Questions

#### Test Case 1: "Merge Overlapping Intervals"
**Before:** ❌ Execution error or wrong output  
**After:** ✅ Should work in all 4 languages

**Sample Input:**
```
1 3 2 6 8 10 15 18
```

**Expected Output:**
```
1 6
8 10
15 18
```

**Test Steps:**
1. Select "Merge Overlapping Intervals" from question list
2. Select Java language
3. Write solution or use provided template
4. Click "Run Code"
5. Verify sample test cases pass
6. Click "Submit"
7. Verify all 25 test cases pass

#### Test Case 2: "Space Optimization Using Bit Manipulations"
**Before:** ✅ Already worked (had specific template)  
**After:** ✅ Still works

**Sample Input:**
```
10 20
```

**Expected Output:**
```
10 12 14 15 16 18 20
```

#### Test Case 3: "Kth Smallest Element"
**Before:** ❌ Generic template failure  
**After:** ✅ Should work

**Sample Input:**
```
7 10 4 3 20 15
3
```

**Expected Output:**
```
7
```

### 5. Test All Languages

For any question, test all 4 language switchers:

1. **Python** → Should have proper stdin/stdout handling
2. **JavaScript** → Should use fs.readFileSync(0, 'utf-8')
3. **C++** → Should use stringstream parsing
4. **Java** → Should use BufferedReader with proper input parsing

---

## Expected Template Examples

### Python Template (Single Array)
```python
import sys

def functionName(nums):
    # Write your solution here
    return 0

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines: return
    nums = list(map(int, lines[0].split()))
    result = functionName(nums)
    print(result)

if __name__ == "__main__":
    solve()
```

### Java Template (Array + Integer)
```java
import java.util.*;
import java.io.*;

class Main {
    public static int functionName(int[] nums, int k) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String[] parts = line.trim().split("\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        String kLine = br.readLine();
        if (kLine == null) return;
        int k = Integer.parseInt(kLine.trim());
        int result = functionName(nums, k);
        System.out.println(result);
    }
}
```

---

## Common Issues and Solutions

### Issue 1: "Still showing execution error"
**Solution:** 
1. Make sure you restarted the backend after running the fix script
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh the page
4. Check if Docker Desktop is running

### Issue 2: "Templates look the same"
**Solution:**
1. Check if you're looking at the OLD seed file (`seedChallenges.ts`)
2. The fix is in the **database**, not the seed file
3. Templates are served from database via API

### Issue 3: "Java compilation error"
**Solution:**
1. Check if Java template has proper class name: `class Main`
2. Verify imports: `import java.util.*; import java.io.*;`
3. Check regex escaping: Use `\\s+` not `\s+`

### Issue 4: "Test cases still failing"
**Solution:**
1. Verify the solution logic is correct (templates only provide I/O)
2. Check if input format matches expected format
3. Test with sample input first before submitting

---

## Verification Commands

### Check Database for Specific Question
```bash
cd apps/backend
yarn ts-node -e "
import { prisma } from './src/config/prisma';
async function check() {
  const q = await prisma.question.findFirst({
    where: { title: { contains: 'Merge Overlapping' } },
    select: { title: true, templates: true }
  });
  if (!q) { console.log('Not found'); return; }
  console.log('Title:', q.title);
  const templates = Array.isArray(q.templates) ? q.templates : [];
  console.log('Languages:', templates.map((t: any) => t.language));
  console.log('Python has proper parsing?', templates.find((t: any) => t.language === 'python')?.code.includes('list(map(int'));
  await prisma.\$disconnect();
}
check();
"
```

### Count Updated Questions
```bash
cd apps/backend
yarn ts-node -e "
import { prisma } from './src/config/prisma';
async function count() {
  const all = await prisma.question.count();
  const questions = await prisma.question.findMany({ select: { templates: true } });
  const withTemplates = questions.filter(q => {
    const templates = Array.isArray(q.templates) ? q.templates : [];
    return templates.length === 4;
  });
  console.log('Total:', all);
  console.log('With 4 templates:', withTemplates.length);
  await prisma.\$disconnect();
}
count();
"
```

---

## Testing Checklist

### Basic Functionality
- [ ] Backend starts without errors
- [ ] Frontend loads without errors
- [ ] Can navigate to Coding Portal
- [ ] Can select any question
- [ ] Can see code template
- [ ] Can switch languages

### Template Quality
- [ ] Python template has `sys.stdin.read().splitlines()`
- [ ] JavaScript template has `fs.readFileSync(0, 'utf-8')`
- [ ] C++ template has `stringstream` and `getline(cin, line)`
- [ ] Java template has `BufferedReader` and `split("\\\\s+")`

### Execution
- [ ] Sample test cases pass
- [ ] Can submit solution
- [ ] All 25 test cases execute
- [ ] Results show passed/failed correctly
- [ ] Hidden test cases don't reveal input/output

### Edge Cases
- [ ] Empty input handled
- [ ] Single element arrays work
- [ ] Large inputs work
- [ ] Negative numbers parsed correctly
- [ ] Multi-line inputs work

---

## Success Criteria

✅ **ALL of the following must be true:**

1. "Merge Overlapping Intervals" works in all 4 languages
2. At least 10 different questions tested and working
3. All 4 language templates load correctly
4. Sample test cases pass consistently
5. Full submission (25 test cases) completes successfully
6. No "Execution Error: Internal server error" messages
7. Students can code in any language for any question

---

## Rollback Plan (If Needed)

If the fix causes issues:

1. **Re-run original seed:**
   ```bash
   cd apps/backend
   yarn ts-node src/scripts/seedChallenges.ts
   ```

2. **Restore from backup** (if you created one)

3. **Report issues** with specific:
   - Question title
   - Language used
   - Error message
   - Expected vs actual behavior

---

## Additional Resources

- **Full Technical Documentation:** `TEMPLATE_FIX_SUMMARY.md`
- **Fix Script:** `apps/backend/src/scripts/fixAllQuestionTemplates.ts`
- **Original Seed Script:** `apps/backend/src/scripts/seedChallenges.ts`
- **Execution Engine:** `apps/execution-engine/src/services/docker.service.ts`

---

**Last Updated:** January 28, 2025  
**Status:** ✅ Fix Applied - Ready for Testing
