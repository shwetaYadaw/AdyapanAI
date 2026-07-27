import Docker from 'dockerode';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { LanguageConfig } from '../config/languages';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

export interface ExecutionResult {
  output: string;
  error: string;
  exitCode: number;
  runtime: number; // milliseconds
  memory: number; // MB
  timeout: boolean;
  verdict: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';
}

export class DockerService {
  private docker: Docker;
  private tempDir: string;

  constructor() {
    // Handle Windows Docker Desktop (named pipe) vs Linux (unix socket)
    const dockerOptions = process.platform === 'win32'
      ? { socketPath: '//./pipe/docker_engine' }
      : { socketPath: env.DOCKER_SOCKET_PATH || '/var/run/docker.sock' };
    
    this.docker = new Docker(dockerOptions);
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create temp directory:', error);
    }
  }

  /**
   * Execute code in an isolated Docker container
   */
  async executeCode(
    code: string,
    language: LanguageConfig,
    input: string,
    expectedOutput?: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<ExecutionResult> {
    const executionId = uuidv4();
    const workDir = path.join(this.tempDir, executionId);
    const timeout = timeLimit || language.timeout;
    const memory = memoryLimit || language.memoryLimit;

    try {
      // Create execution directory
      await fs.mkdir(workDir, { recursive: true });

      // Write source code file
      const fileName = this.getFileName(language, code);
      const filePath = path.join(workDir, fileName);
      await fs.writeFile(filePath, code, 'utf-8');

      // Write input file
      const inputPath = path.join(workDir, 'input.txt');
      await fs.writeFile(inputPath, input, 'utf-8');

      logger.debug(`Executing ${language.name} code in container: ${executionId}`);

      // Create container
      // Convert Windows path to Docker-compatible format
      const dockerWorkDir = process.platform === 'win32' 
        ? workDir.replace(/\\/g, '/').replace(/^([A-Z]):/, (_, drive) => `/${drive.toLowerCase()}`)
        : workDir;

      // Windows Docker Desktop has limited security options support
      const isWindows = process.platform === 'win32';

      const container = await this.docker.createContainer({
        Image: language.dockerImage,
        name: `adyapan-exec-${executionId}`,
        Cmd: ['/bin/sh', '-c', 'sleep infinity'], // Keep container alive for exec commands
        HostConfig: {
          Memory: memory * 1024 * 1024, // Convert MB to bytes
          MemorySwap: memory * 1024 * 1024, // Prevent swap usage
          NanoCpus: 1000000000, // 1 CPU
          PidsLimit: env.DEFAULT_MAX_PROCESSES,
          NetworkMode: 'none', // No internet access
          Binds: [`${dockerWorkDir}:/app:rw`],
          AutoRemove: false,
          ReadonlyRootfs: false,
          // Skip advanced security options on Windows
          ...(isWindows ? {} : {
            CapDrop: ['ALL'], // Drop all capabilities for security
            SecurityOpt: ['no-new-privileges'],
          }),
        },
        WorkingDir: '/app',
        Tty: false,
        OpenStdin: false,
        StdinOnce: false,
        AttachStdout: true,
        AttachStderr: true,
        Labels: {
          'adyapan-runner': 'true',
          'execution-id': executionId,
        },
      });

      // Compilation phase (if needed)
      if (language.compileCommand) {
        // For Java, detect class name and use it
        let compileCmd = language.compileCommand;
        let runCmd = language.runCommand;
        let javaClassName = 'Main'; // default
        
        if (language.id === 'java' && code) {
          const classMatch = code.match(/class\s+(\w+)/);
          if (classMatch && classMatch[1]) {
            javaClassName = classMatch[1];
            compileCmd = `javac -d /app /app/${javaClassName}.java`;
            runCmd = `java -cp /app ${javaClassName}`;
            logger.info(`[Java] Detected class name: ${javaClassName}`);
          }
        }
        
        const compileResult = await this.runInContainer(container, compileCmd, '', timeout);
        
        if (compileResult.exitCode !== 0) {
          await this.cleanup(container, workDir);
          return {
            output: '',
            error: compileResult.error || compileResult.output || 'Compilation failed',
            exitCode: compileResult.exitCode,
            runtime: compileResult.runtime,
            memory: 0,
            timeout: false,
            verdict: 'CE',
          };
        }
        
        // Store dynamic run command for later use
        if (language.id === 'java' && runCmd !== language.runCommand) {
          (language as any)._dynamicRunCommand = runCmd;
        }
      }

      // Execution phase
      const startTime = Date.now();
      const actualRunCommand = (language as any)._dynamicRunCommand || language.runCommand;
      const execResult = await this.runInContainer(container, actualRunCommand, input, timeout);
      const runtime = Date.now() - startTime;

      // Get memory stats
      const stats = await container.stats({ stream: false });
      const memoryUsed = Math.round((stats.memory_stats.usage || 0) / (1024 * 1024));

      // Determine verdict
      let verdict: ExecutionResult['verdict'] = 'AC';
      
      if (execResult.timeout) {
        verdict = 'TLE';
      } else if (execResult.exitCode !== 0) {
        verdict = 'RE';
      } else if (memoryUsed > memory) {
        verdict = 'MLE';
      } else if (expectedOutput && !this.compareOutputs(execResult.output, expectedOutput)) {
        verdict = 'WA';
      }

      await this.cleanup(container, workDir);

      return {
        output: execResult.output.trim(),
        error: execResult.error.trim(),
        exitCode: execResult.exitCode,
        runtime,
        memory: memoryUsed,
        timeout: execResult.timeout,
        verdict,
      };

    } catch (error: any) {
      logger.error(`Execution failed for ${executionId}:`, error);
      
      // Cleanup on error
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch {}

      return {
        output: '',
        error: error.message || 'Internal execution error',
        exitCode: -1,
        runtime: 0,
        memory: 0,
        timeout: false,
        verdict: 'RE',
      };
    }
  }

  /**
   * Run command inside container with timeout
   */
  private async runInContainer(
    container: Docker.Container,
    command: string,
    input: string,
    timeout: number
  ): Promise<{ output: string; error: string; exitCode: number; runtime: number; timeout: boolean }> {
    const startTime = Date.now();
    let isTimeout = false;
    let timeoutHandle: NodeJS.Timeout | null = null;

    try {
      // Ensure container is running
      const containerInfo = await container.inspect();
      if (!containerInfo.State.Running) {
        await container.start();
      }

      // Create execution inside running container
      const exec = await container.exec({
        Cmd: input ? ['/bin/sh', '-c', `cat /app/input.txt | ${command}`] : ['/bin/sh', '-c', command],
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: false,
      });

      // Set timeout
      timeoutHandle = setTimeout(async () => {
        isTimeout = true;
        try {
          await container.kill();
        } catch (err) {
          logger.warn('Failed to kill container on timeout:', err);
        }
      }, timeout * 1000);

      // Start execution and collect output
      const stream = await exec.start({ Detach: false, Tty: false });

      const outputPromise = new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        // Use demuxStream to properly separate stdout and stderr
        container.modem.demuxStream(
          stream,
          { write: (chunk: Buffer) => { stdout += chunk.toString('utf-8'); } },
          { write: (chunk: Buffer) => { stderr += chunk.toString('utf-8'); } }
        );

        stream.on('end', () => {
          resolve({ stdout, stderr });
        });

        stream.on('error', (err) => {
          reject(err);
        });
      });

      const { stdout, stderr } = await outputPromise;

      // Clear timeout
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      // Get exit code
      const inspectExec = await exec.inspect();
      const exitCode = inspectExec.ExitCode || 0;

      const runtime = Date.now() - startTime;

      return {
        output: stdout,
        error: stderr,
        exitCode,
        runtime,
        timeout: isTimeout,
      };

    } catch (error: any) {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      return {
        output: '',
        error: error.message || 'Execution error',
        exitCode: -1,
        runtime: Date.now() - startTime,
        timeout: isTimeout,
      };
    }
  }

  /**
   * Cleanup container and temporary files
   */
  private async cleanup(container: Docker.Container, workDir: string): Promise<void> {
    try {
      // Stop and remove container
      try {
        await container.stop({ t: 1 });
      } catch {}
      
      try {
        await container.remove({ force: true });
      } catch {}

      // Remove temporary directory
      if (env.AUTO_CLEANUP) {
        await fs.rm(workDir, { recursive: true, force: true });
      }
    } catch (error) {
      logger.warn('Cleanup warning:', error);
    }
  }

  /**
   * Compare actual output with expected output
   */
  private compareOutputs(actual: string, expected: string): boolean {
    // Normalize whitespace
    const normalize = (str: string) => str.trim().replace(/\s+/g, ' ');
    
    const normalizedActual = normalize(actual);
    const normalizedExpected = normalize(expected);

    // Exact match after normalization
    if (normalizedActual === normalizedExpected) {
      return true;
    }

    // Line by line comparison
    const actualLines = actual.trim().split('\n').map(l => l.trim());
    const expectedLines = expected.trim().split('\n').map(l => l.trim());

    if (actualLines.length !== expectedLines.length) {
      return false;
    }

    return actualLines.every((line, i) => line === expectedLines[i]);
  }

  /**
   * Get file name based on language
   * For Java, detect class name from code (Main or Solution)
   */
  private getFileName(language: LanguageConfig, code?: string): string {
    switch (language.id) {
      case 'java':
        // Detect class name from code
        if (code) {
          const classMatch = code.match(/class\s+(\w+)/);
          if (classMatch && classMatch[1]) {
            return `${classMatch[1]}.java`;
          }
        }
        // Default to Main.java
        return 'Main.java';
      case 'cpp':
        return 'solution.cpp';
      case 'python':
        return 'solution.py';
      case 'javascript':
        return 'solution.js';
      default:
        return `solution.${language.extension}`;
    }
  }

  /**
   * Check if Docker images are available
   */
  async checkDockerImages(images: string[]): Promise<{ available: boolean; missing: string[] }> {
    const missing: string[] = [];

    for (const image of images) {
      try {
        await this.docker.getImage(image).inspect();
      } catch {
        missing.push(image);
      }
    }

    return {
      available: missing.length === 0,
      missing,
    };
  }

  /**
   * Periodic cleanup of orphaned containers
   */
  async cleanupOrphanedContainers(): Promise<void> {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: {
          label: ['adyapan-runner=true'],
        },
      });

      for (const containerInfo of containers) {
        try {
          const container = this.docker.getContainer(containerInfo.Id);
          await container.stop({ t: 1 });
          await container.remove({ force: true });
          logger.info(`Cleaned up orphaned container: ${containerInfo.Id}`);
        } catch (error) {
          logger.warn(`Failed to cleanup container ${containerInfo.Id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Cleanup job failed:', error);
    }
  }
}
