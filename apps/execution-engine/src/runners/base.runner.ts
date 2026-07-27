import { dockerService } from '../services/docker.service';
import { ExecutionResult, Language, LanguageConfig } from '../types';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export abstract class BaseRunner {
  protected config: LanguageConfig;
  protected language: Language;

  constructor(language: Language, config: LanguageConfig) {
    this.language = language;
    this.config = config;
  }

  /**
   * Execute code with input
   */
  async execute(
    code: string,
    input: string = '',
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    const workspace = await dockerService.createTempWorkspace();

    try {
      // Write code to file
      const filename = `Main${this.config.fileExtension}`;
      const filePath = path.join(workspace, filename);
      await fs.writeFile(filePath, code, 'utf8');

      logger.info('Executing code:', {
        language: this.language,
        workspace,
        filename,
        codeLength: code.length,
        inputLength: input.length,
      });

      // Compile if needed
      if (this.config.needsCompilation && this.config.compileCommand) {
        const compileResult = await this.compile(workspace, filename, timeLimit, memoryLimit);
        
        if (compileResult.verdict !== 'accepted') {
          return compileResult;
        }
      }

      // Run the code
      return await this.run(workspace, filename, input, timeLimit, memoryLimit);
    } finally {
      // Cleanup workspace
      await dockerService.cleanupWorkspace(workspace);
    }
  }

  /**
   * Compile the code (for compiled languages)
   */
  protected async compile(
    workspace: string,
    filename: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    if (!this.config.compileCommand) {
      throw new Error('Compile command not defined for this language');
    }

    const cmd = this.config.compileCommand(filename);

    logger.info('Compiling code:', { language: this.language, cmd });

    const result = await dockerService.executeInContainer(
      {
        image: this.config.image,
        cmd,
        workDir: '/workspace',
        timeout: timeLimit || this.config.timeout,
        memory: memoryLimit ? `${memoryLimit}m` : '512m',
        cpuLimit: 1.0,
        networkDisabled: true,
        readOnly: false,
        binds: [`${workspace}:/workspace`],
      },
      ''
    );

    // Check compilation result
    if (result.exitCode !== 0) {
      return {
        ...result,
        verdict: 'compilation_error',
        compilationLog: result.stderr || result.output,
      };
    }

    return {
      ...result,
      verdict: 'accepted',
      compilationLog: result.stderr,
    };
  }

  /**
   * Run the compiled/interpreted code
   */
  protected async run(
    workspace: string,
    filename: string,
    input: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    const cmd = this.config.runCommand(filename);

    logger.info('Running code:', { language: this.language, cmd });

    const result = await dockerService.executeInContainer(
      {
        image: this.config.image,
        cmd,
        workDir: '/workspace',
        timeout: timeLimit || this.config.timeout,
        memory: memoryLimit ? `${memoryLimit}m` : '256m',
        cpuLimit: 1.0,
        networkDisabled: true,
        readOnly: false,
        binds: [`${workspace}:/workspace`],
      },
      input
    );

    return result;
  }

  /**
   * Get language name
   */
  getLanguage(): Language {
    return this.language;
  }
}
