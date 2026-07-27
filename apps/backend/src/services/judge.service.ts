import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Standard Judge0 language IDs (matches common environments)
const LANGUAGE_MAP: Record<string, number> = {
  'javascript': 93, // Node.js 18.15.0
  'js': 93,
  'typescript': 94, // TypeScript 5.0.3
  'ts': 94,
  'python': 71, // Python 3.11.2
  'py': 71,
  'cpp': 76, // C++ (GCC 13.2.0)
  'c++': 76,
  'c': 75, // C (GCC 13.2.0)
  'java': 91, // Java (OpenJDK 17.0.6)
  'go': 95, // Go (1.20.3)
  'golang': 95,
  'csharp': 51, // C# (Mono 6.12.0.122)
  'c#': 51
};

export class JudgeService {
  async runTestCase(
    code: string,
    language: string,
    input: string,
    expectedOutput: string | undefined,
    timeLimitMs = 5000
  ): Promise<{
    passed: boolean;
    actualOutput: string;
    runtime: number;
    errorType?: 'compile_error' | 'runtime_error' | 'time_limit_exceeded';
    errorMessage?: string;
  }> {
    const lang = language.toLowerCase();
    const languageId = LANGUAGE_MAP[lang];

    if (!languageId) {
      return {
        passed: false,
        actualOutput: '',
        runtime: 0,
        errorType: 'compile_error',
        errorMessage: `Unsupported language: ${language}`,
      };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (env.JUDGE0_API_KEY) {
        headers['x-rapidapi-key'] = env.JUDGE0_API_KEY;
        try {
          const url = new URL(env.JUDGE0_API_URL);
          headers['x-rapidapi-host'] = url.hostname;
        } catch {
          // Fallback if URL parsing fails
        }
      }

      // Convert timeLimitMs to seconds for Judge0
      const cpuTimeLimit = Math.max(0.5, timeLimitMs / 1000);

      const response = await axios.post(
        `${env.JUDGE0_API_URL.replace(/\/$/, '')}/submissions?wait=true`,
        {
          source_code: Buffer.from(code).toString('base64'),
          language_id: languageId,
          stdin: Buffer.from(input).toString('base64'),
          ...(expectedOutput !== undefined
            ? { expected_output: Buffer.from(expectedOutput).toString('base64') }
            : {}),
          cpu_time_limit: cpuTimeLimit,
        },
        {
          headers,
          timeout: timeLimitMs + 5000, // safety buffer for network request
        }
      );

      const result = response.data;
      const statusId = result.status?.id;

      // Decode Base64 outputs returned by Judge0
      const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf8') : '';
      const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf8') : '';
      const compileOutput = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf8') : '';
      const message = result.message ? Buffer.from(result.message, 'base64').toString('utf8') : '';

      // Runtime is returned in seconds (string) by Judge0, convert to ms
      const runtime = result.time ? Math.round(parseFloat(result.time) * 1000) : 0;

      // Debug log for Judge0 response
      logger.debug(`[JUDGE0] Status: ${statusId}, Runtime: ${runtime}ms, Code: ${result.status?.description || 'unknown'}`);

      if (statusId === 3) {
        // Accepted
        return {
          passed: true,
          actualOutput: stdout,
          runtime,
        };
      }

      if (statusId === 4) {
        // Wrong Answer
        return {
          passed: false,
          actualOutput: stdout,
          runtime,
          errorType: undefined,
          errorMessage: 'Wrong Answer',
        };
      }

      if (statusId === 5) {
        // Time Limit Exceeded
        return {
          passed: false,
          actualOutput: stdout,
          runtime,
          errorType: 'time_limit_exceeded',
          errorMessage: `Time Limit Exceeded: Execution took longer than ${timeLimitMs}ms`,
        };
      }

      if (statusId === 6) {
        // Compilation Error
        return {
          passed: false,
          actualOutput: '',
          runtime: 0,
          errorType: 'compile_error',
          errorMessage: compileOutput || 'Compilation Error',
        };
      }

      // Any runtime errors (status 7 to 12) or other failures
      return {
        passed: false,
        actualOutput: stdout,
        runtime,
        errorType: 'runtime_error',
        errorMessage: stderr || message || result.status?.description || 'Runtime Error',
      };

    } catch (err: any) {
      logger.warn('Judge0 API unreachable, attempting local child_process execution fallback...', err.message || err);
      
      const lang = language.toLowerCase();
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');
      
      const tmpDir = path.resolve(__dirname, '../../.tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      const uniqueId = `exec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      let runCmd = '';
      let cleanUpFiles: string[] = [];

      try {
        if (lang === 'javascript' || lang === 'js') {
          const tmpFile = path.join(tmpDir, `${uniqueId}.js`);
          fs.writeFileSync(tmpFile, code);
          cleanUpFiles.push(tmpFile);
          runCmd = `node "${tmpFile}"`;
        } else if (lang === 'python' || lang === 'py') {
          const tmpFile = path.join(tmpDir, `${uniqueId}.py`);
          fs.writeFileSync(tmpFile, code);
          cleanUpFiles.push(tmpFile);
          runCmd = `python "${tmpFile}"`;
        } else if (lang === 'cpp' || lang === 'c++') {
          const srcFile = path.join(tmpDir, `${uniqueId}.cpp`);
          const binFile = path.join(tmpDir, `${uniqueId}.exe`);
          fs.writeFileSync(srcFile, code);
          cleanUpFiles.push(srcFile, binFile);
          try {
            execSync(`g++ -O3 "${srcFile}" -o "${binFile}"`, { stdio: 'pipe' });
          } catch (compileErr: any) {
            return {
              passed: false,
              actualOutput: '',
              runtime: 0,
              errorType: 'compile_error',
              errorMessage: compileErr.stderr?.toString() || 'Compilation Error',
            };
          }
          runCmd = `"${binFile}"`;
        } else if (lang === 'java') {
          const srcFile = path.join(tmpDir, `Main.java`);
          fs.writeFileSync(srcFile, code);
          cleanUpFiles.push(srcFile, path.join(tmpDir, 'Main.class'));
          try {
            execSync(`javac "${srcFile}"`, { stdio: 'pipe' });
          } catch (compileErr: any) {
            return {
              passed: false,
              actualOutput: '',
              runtime: 0,
              errorType: 'compile_error',
              errorMessage: compileErr.stderr?.toString() || 'Compilation Error',
            };
          }
          runCmd = `java -cp "${tmpDir}" Main`;
        } else {
          throw new Error(`Unsupported language fallback: ${language}`);
        }

        const startTime = Date.now();
        const stdout = execSync(runCmd, {
          input: input,
          timeout: timeLimitMs,
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        });
        const runtime = Date.now() - startTime;

        // Enhanced output comparison that handles multiple formats
        const compareOutputs = (actual: string, expected: string): boolean => {
          if (!expected) return false;
          
          // Method 1: Exact trim match
          if (actual.trim() === expected.trim()) return true;
          
          // Method 2: Line-by-line comparison ignoring empty lines and leading/trailing spaces
          const actualLines = actual.trim().split('\n').map(l => l.trim()).filter(l => l);
          const expectedLines = expected.trim().split('\n').map(l => l.trim()).filter(l => l);
          
          if (actualLines.length === expectedLines.length) {
            return actualLines.every((line, i) => line === expectedLines[i]);
          }
          
          // Method 3: Normalize whitespace and compare
          const normalizeSpaces = (str: string) => str.trim().replace(/\s+/g, ' ');
          if (normalizeSpaces(actual) === normalizeSpaces(expected)) return true;
          
          // Method 4: Compare as numbers (for numeric output)
          const actualNum = parseFloat(actual.trim());
          const expectedNum = parseFloat(expected.trim());
          if (!isNaN(actualNum) && !isNaN(expectedNum) && actualNum === expectedNum) return true;
          
          return false;
        };

        const cleanStdout = stdout.trim();
        const cleanExpected = expectedOutput?.trim() || '';
        
        // A custom run has no expected result. It is successful when the code executes.
        // Submissions always provide an expected result.
        const passed = !expectedOutput || compareOutputs(cleanStdout, cleanExpected);

        return {
          passed,
          actualOutput: cleanStdout,
          runtime,
          errorMessage: passed ? undefined : 'Wrong Answer'
        };
      } catch (execErr: any) {
        if (execErr.code === 'ETIMEDOUT') {
          return {
            passed: false,
            actualOutput: '',
            runtime: timeLimitMs,
            errorType: 'time_limit_exceeded',
            errorMessage: `Time Limit Exceeded: Execution took longer than ${timeLimitMs}ms`,
          };
        }
        return {
          passed: false,
          actualOutput: '',
          runtime: 0,
          errorType: 'runtime_error',
          errorMessage: execErr.stderr?.toString() || execErr.message || 'Runtime Error',
        };
      } finally {
        for (const file of cleanUpFiles) {
          try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
          } catch {}
        }
      }
    }
  }
}
