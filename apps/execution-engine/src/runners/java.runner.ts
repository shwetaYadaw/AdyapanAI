import { BaseRunner } from './base.runner';
import { getLanguageConfig } from '../config/languages';
import { ExecutionResult } from '../types';

export class JavaRunner extends BaseRunner {
  constructor() {
    super('java', getLanguageConfig('java'));
  }

  /**
   * Override execute to handle Java class name extraction
   */
  async execute(
    code: string,
    input: string = '',
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    // Extract class name from code
    const className = this.extractClassName(code);
    
    if (!className) {
      return {
        output: '',
        stderr: 'No public class found in the code',
        exitCode: 1,
        runtime: 0,
        memory: 0,
        verdict: 'compilation_error',
        compilationLog: 'Java code must contain a public class',
      };
    }

    // Temporarily override config to use correct filename
    const originalExtension = this.config.fileExtension;
    this.config.fileExtension = '.java'; // Ensure .java extension
    
    const result = await super.execute(code, input, timeLimit, memoryLimit);
    
    this.config.fileExtension = originalExtension;
    
    return result;
  }

  /**
   * Extract public class name from Java code
   */
  private extractClassName(code: string): string | null {
    // Match: public class ClassName
    const match = code.match(/public\s+class\s+(\w+)/);
    return match ? match[1] : 'Main';
  }
}
