import { DockerService, ExecutionResult } from './docker.service';
import { WrapperService, FunctionSignature } from './wrapper.service';
import { getLanguageConfig } from '../config/languages';
import { logger } from '../config/logger';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ExecutionOptions {
  executionMode?: 'fullProgram' | 'function';
  functionSignature?: FunctionSignature;
}

export interface JudgmentResult {
  verdict: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  runtime: number; // Total runtime in ms
  memory: number; // Peak memory in MB
  testResults: TestCaseResult[];
  compilationError?: string;
}

export interface TestCaseResult {
  testNumber: number;
  passed: boolean;
  input: string;
  expectedOutput?: string;
  actualOutput: string;
  runtime: number;
  memory: number;
  error?: string;
  verdict: string;
}

export class JudgeService {
  private dockerService: DockerService;
  private wrapperService: WrapperService;

  constructor() {
    this.dockerService = new DockerService();
    this.wrapperService = new WrapperService();
  }

  /**
   * Run code against sample test cases (for "Run Code" feature)
   * Always runs code as-is (no automatic wrapping)
   */
  async runCode(
    code: string,
    language: string,
    input: string,
    timeLimit?: number,
    memoryLimit?: number,
    options?: ExecutionOptions
  ): Promise<ExecutionResult> {
    logger.info(`Running code for language: ${language}`);

    const langConfig = getLanguageConfig(language);
    if (!langConfig) {
      return {
        output: '',
        error: `Unsupported language: ${language}`,
        exitCode: -1,
        runtime: 0,
        memory: 0,
        timeout: false,
        verdict: 'CE',
      };
    }

    // Only wrap if explicitly requested with valid signature
    let codeToExecute = code;
    if (options?.executionMode === 'function' && options?.functionSignature) {
      try {
        if (!this.wrapperService.validateFunctionSignature(options.functionSignature)) {
          return {
            output: '',
            error: 'Invalid function signature',
            exitCode: -1,
            runtime: 0,
            memory: 0,
            timeout: false,
            verdict: 'CE',
          };
        }
        codeToExecute = this.wrapperService.wrapFunctionCode(
          code,
          language,
          options.functionSignature,
          input
        );
        logger.debug('Code wrapped for function mode');
      } catch (error: any) {
        logger.error(`Error wrapping code: ${error.message}`);
        return {
          output: '',
          error: `Wrapper error: ${error.message}`,
          exitCode: -1,
          runtime: 0,
          memory: 0,
          timeout: false,
          verdict: 'CE',
        };
      }
    }

    return this.dockerService.executeCode(
      codeToExecute,
      langConfig,
      input,
      undefined, // No expected output for run mode
      timeLimit,
      memoryLimit
    );
  }

  /**
   * Submit code and judge against all test cases (for "Submit" feature)
   * Only wraps if explicitly in function mode with valid signature
   */
  async judgeSubmission(
    code: string,
    language: string,
    testCases: TestCase[],
    timeLimit?: number,
    memoryLimit?: number,
    options?: ExecutionOptions
  ): Promise<JudgmentResult> {
    logger.info(`Judging submission for language: ${language}, test cases: ${testCases.length}`);

    const langConfig = getLanguageConfig(language);
    if (!langConfig) {
      return {
        verdict: 'CE',
        totalTests: testCases.length,
        passedTests: 0,
        failedTests: testCases.length,
        runtime: 0,
        memory: 0,
        testResults: [],
        compilationError: `Unsupported language: ${language}`,
      };
    }

    // Validate function signature if explicitly in function mode
    const executionMode = options?.executionMode || 'fullProgram';
    if (executionMode === 'function') {
      if (!options?.functionSignature) {
        return {
          verdict: 'CE',
          totalTests: testCases.length,
          passedTests: 0,
          failedTests: testCases.length,
          runtime: 0,
          memory: 0,
          testResults: [],
          compilationError: 'Function signature is required for function mode',
        };
      }
      if (!this.wrapperService.validateFunctionSignature(options.functionSignature)) {
        return {
          verdict: 'CE',
          totalTests: testCases.length,
          passedTests: 0,
          failedTests: testCases.length,
          runtime: 0,
          memory: 0,
          testResults: [],
          compilationError: 'Invalid function signature',
        };
      }
    }

    const testResults: TestCaseResult[] = [];
    let totalRuntime = 0;
    let peakMemory = 0;
    let passedCount = 0;
    let failedCount = 0;
    let overallVerdict: JudgmentResult['verdict'] = 'AC';

    // Check for hardcoded outputs (anti-cheat) - only for full program mode
    // Function mode makes hardcoding detection more complex due to wrapper code
    if (executionMode !== 'function') {
      const visibleOutputs = testCases.filter(tc => !tc.isHidden).map(tc => tc.expectedOutput);
      if (this.detectHardcoding(code, visibleOutputs)) {
        return {
          verdict: 'WA',
          totalTests: testCases.length,
          passedTests: 0,
          failedTests: testCases.length,
          runtime: 0,
          memory: 0,
          testResults: [],
          compilationError: 'Cheat Detected: Hardcoded output values found.',
        };
      }
    }

    // Execute against each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      logger.debug(`Running test case ${i + 1}/${testCases.length}`);

      // Wrap code for function mode for each test case
      let codeToExecute = code;
      if (executionMode === 'function' && options?.functionSignature) {
        try {
          codeToExecute = this.wrapperService.wrapFunctionCode(
            code,
            language,
            options.functionSignature,
            testCase.input
          );
        } catch (error: any) {
          logger.error(`Error wrapping code for test case ${i + 1}: ${error.message}`);
          return {
            verdict: 'CE',
            totalTests: testCases.length,
            passedTests: 0,
            failedTests: testCases.length,
            runtime: 0,
            memory: 0,
            testResults: [],
            compilationError: `Wrapper error: ${error.message}`,
          };
        }
      }

      const result = await this.dockerService.executeCode(
        codeToExecute,
        langConfig,
        testCase.input,
        testCase.expectedOutput,
        timeLimit,
        memoryLimit
      );

      totalRuntime += result.runtime;
      peakMemory = Math.max(peakMemory, result.memory);

      const passed = result.verdict === 'AC';
      if (passed) {
        passedCount++;
      } else {
        failedCount++;
        // Update overall verdict to worst failure type
        if (overallVerdict === 'AC' || result.verdict === 'TLE' || result.verdict === 'MLE') {
          overallVerdict = result.verdict;
        }
      }

      testResults.push({
        testNumber: i + 1,
        passed,
        input: testCase.isHidden ? '[Hidden]' : testCase.input,
        expectedOutput: testCase.isHidden ? undefined : testCase.expectedOutput,
        actualOutput: result.output,
        runtime: result.runtime,
        memory: result.memory,
        error: result.error || undefined,
        verdict: result.verdict,
      });

      // Stop on first compilation error
      if (result.verdict === 'CE') {
        overallVerdict = 'CE';
        break;
      }

      // Stop on first runtime error or TLE (configurable behavior)
      if (result.verdict === 'RE' || result.verdict === 'TLE' || result.verdict === 'MLE') {
        overallVerdict = result.verdict;
        // Continue or break based on requirements
        // break; // Uncomment to stop on first error
      }
    }

    return {
      verdict: overallVerdict,
      totalTests: testCases.length,
      passedTests: passedCount,
      failedTests: failedCount,
      runtime: totalRuntime,
      memory: peakMemory,
      testResults,
      compilationError: overallVerdict === 'CE' ? testResults[0]?.error : undefined,
    };
  }

  /**
   * Detect hardcoded outputs (anti-cheat mechanism)
   */
  private detectHardcoding(code: string, expectedOutputs: string[]): boolean {
    const normalizedCode = code.replace(/\s+/g, '').toLowerCase();
    
    for (const output of expectedOutputs) {
      const cleanOutput = String(output).trim();
      if (!cleanOutput || cleanOutput.length === 0) continue;

      const patterns = [
        `return"${cleanOutput}"`,
        `return'${cleanOutput}'`,
        `return\`${cleanOutput}\``,
        `return${cleanOutput}`,
        `print("${cleanOutput}")`,
        `print('${cleanOutput}')`,
        `print(${cleanOutput})`,
        `console.log("${cleanOutput}")`,
        `console.log('${cleanOutput}')`,
        `console.log(${cleanOutput})`,
        `system.out.println("${cleanOutput}")`,
        `system.out.println('${cleanOutput}')`,
        `system.out.println(${cleanOutput})`,
        `cout<<"${cleanOutput}"`,
        `cout<<'${cleanOutput}'`,
        `cout<<${cleanOutput}`,
      ];

      const normalizedOutput = cleanOutput.replace(/\s+/g, '').toLowerCase();
      if (patterns.some(p => normalizedCode.includes(p.replace(/\s+/g, '').toLowerCase())) ||
          normalizedCode.includes(normalizedOutput)) {
        logger.warn('Hardcoding detected in submission');
        return true;
      }
    }

    return false;
  }

  /**
   * Get Docker service health status
   */
  async getHealthStatus(): Promise<{ healthy: boolean; message: string }> {
    try {
      const images = Object.values(getLanguageConfig('cpp') ? ['adyapan/runner-cpp:latest'] : []);
      await this.dockerService.checkDockerImages(images);
      return { healthy: true, message: 'Docker service is healthy' };
    } catch (error: any) {
      return { healthy: false, message: error.message || 'Docker service unavailable' };
    }
  }
}
