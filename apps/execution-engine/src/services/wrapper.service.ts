/**
 * Wrapper Service
 * 
 * Intelligently detects code format and automatically handles execution.
 * No templates needed - works with any valid solution approach.
 */

import { logger } from '../config/logger';

export interface FunctionParameter {
  name: string;
  type: string;
}

export interface FunctionSignature {
  functionName: string;
  className?: string;
  parameters: FunctionParameter[];
  returnType: string;
}

export interface CodeAnalysis {
  isFullProgram: boolean;
  hasMainFunction: boolean;
  hasInputHandling: boolean;
  detectedFunctions: string[];
  language: string;
}

export class WrapperService {
  /**
   * Automatically detect if code is full program or function-only
   */
  analyzeCode(code: string, language: string): CodeAnalysis {
    const normalizedCode = code.trim();
    const lowerCode = normalizedCode.toLowerCase();

    switch (language.toLowerCase()) {
      case 'python':
        return this.analyzePython(normalizedCode, lowerCode);
      case 'java':
        return this.analyzeJava(normalizedCode, lowerCode);
      case 'cpp':
      case 'c++':
        return this.analyzeCpp(normalizedCode, lowerCode);
      case 'javascript':
      case 'js':
        return this.analyzeJavaScript(normalizedCode, lowerCode);
      default:
        return {
          isFullProgram: true,
          hasMainFunction: false,
          hasInputHandling: false,
          detectedFunctions: [],
          language,
        };
    }
  }

  /**
   * Analyze Python code
   */
  private analyzePython(code: string, lowerCode: string): CodeAnalysis {
    const hasInput = /input\s*\(/.test(code);
    const hasPrint = /print\s*\(/.test(code);
    const hasMainGuard = /__name__\s*==\s*['"]__main__['"]/.test(code);
    
    // Detect function definitions
    const functionMatches = code.match(/def\s+(\w+)\s*\(/g);
    const detectedFunctions = functionMatches 
      ? functionMatches.map(m => m.match(/def\s+(\w+)/)?.[1] || '').filter(Boolean)
      : [];

    // It's a full program if it has input/output at module level
    const isFullProgram = (hasInput || hasPrint) && !hasMainGuard;
    
    return {
      isFullProgram,
      hasMainFunction: hasMainGuard,
      hasInputHandling: hasInput,
      detectedFunctions,
      language: 'python',
    };
  }

  /**
   * Analyze Java code
   */
  private analyzeJava(code: string, lowerCode: string): CodeAnalysis {
    const hasMainMethod = /public\s+static\s+void\s+main\s*\(/.test(code);
    const hasScanner = /Scanner|BufferedReader/.test(code);
    const hasSystemOut = /System\.out\.print/.test(code);
    
    const functionMatches = code.match(/public\s+\w+\s+(\w+)\s*\(/g);
    const detectedFunctions = functionMatches 
      ? functionMatches.map(m => m.match(/public\s+\w+\s+(\w+)/)?.[1] || '').filter(Boolean)
      : [];

    const isFullProgram = hasMainMethod;
    
    return {
      isFullProgram,
      hasMainFunction: hasMainMethod,
      hasInputHandling: hasScanner,
      detectedFunctions,
      language: 'java',
    };
  }

  /**
   * Analyze C++ code
   */
  private analyzeCpp(code: string, lowerCode: string): CodeAnalysis {
    const hasMainFunction = /int\s+main\s*\(/.test(code);
    const hasCin = /cin\s*>>/.test(code);
    const hasCout = /cout\s*<</.test(code);
    
    const functionMatches = code.match(/\w+\s+(\w+)\s*\([^)]*\)\s*{/g);
    const detectedFunctions = functionMatches 
      ? functionMatches.map(m => m.match(/\w+\s+(\w+)\s*\(/)?.[1] || '').filter(f => f !== 'main')
      : [];

    const isFullProgram = hasMainFunction;
    
    return {
      isFullProgram,
      hasMainFunction,
      hasInputHandling: hasCin,
      detectedFunctions,
      language: 'cpp',
    };
  }

  /**
   * Analyze JavaScript code
   */
  private analyzeJavaScript(code: string, lowerCode: string): CodeAnalysis {
    const hasRequire = /require\s*\(/.test(code);
    const hasReadline = /readline/.test(lowerCode);
    const hasConsoleLog = /console\.log/.test(code);
    const hasProcessStdin = /process\.stdin/.test(code);
    
    const functionMatches = code.match(/function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\(/g);
    const detectedFunctions = functionMatches 
      ? functionMatches.map(m => (m.match(/function\s+(\w+)/) || m.match(/const\s+(\w+)/))?.[1] || '').filter(Boolean)
      : [];

    const isFullProgram = hasReadline || hasProcessStdin;
    
    return {
      isFullProgram,
      hasMainFunction: false,
      hasInputHandling: hasReadline || hasProcessStdin,
      detectedFunctions,
      language: 'javascript',
    };
  }

  /**
   * Wrap user code with boilerplate if needed (only for function-only code)
   */
  wrapFunctionCode(
    userCode: string,
    language: string,
    signature: FunctionSignature,
    testInput: string
  ): string {
    logger.debug(`Wrapping ${language} code for function mode`);

    switch (language.toLowerCase()) {
      case 'python':
        return this.wrapPython(userCode, signature, testInput);
      case 'java':
        return this.wrapJava(userCode, signature, testInput);
      case 'cpp':
      case 'c++':
        return this.wrapCpp(userCode, signature, testInput);
      case 'javascript':
      case 'js':
        return this.wrapJavaScript(userCode, signature, testInput);
      default:
        throw new Error(`Function mode not supported for language: ${language}`);
    }
  }

  /**
   * Python wrapper generator
   */
  private wrapPython(userCode: string, signature: FunctionSignature, testInput: string): string {
    const { functionName, parameters, returnType } = signature;
    const className = signature.className || 'Solution';

    // Generate input parsing code
    const inputParsing = this.generatePythonInputParsing(parameters);

    // Generate output formatting code
    const outputFormatting = this.generatePythonOutputFormatting(returnType);

    const wrapper = `
import sys
from typing import List, Optional

# User's code
${userCode}

# Platform wrapper
if __name__ == "__main__":
    # Parse input
${inputParsing}
    
    # Create instance and call function
    solution = ${className}()
    result = solution.${functionName}(${parameters.map(p => p.name).join(', ')})
    
    # Format and print output
${outputFormatting}
`;

    return wrapper;
  }

  /**
   * Java wrapper generator
   */
  private wrapJava(userCode: string, signature: FunctionSignature, testInput: string): string {
    const { functionName, parameters, returnType } = signature;
    const className = signature.className || 'Solution';

    // Generate input parsing code
    const inputParsing = this.generateJavaInputParsing(parameters);

    // Generate output formatting code
    const outputFormatting = this.generateJavaOutputFormatting(returnType);

    const wrapper = `
import java.util.*;
import java.io.*;

${userCode}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Parse input
${inputParsing}
        
        // Create instance and call function
        ${className} solution = new ${className}();
        ${this.getJavaTypeString(returnType)} result = solution.${functionName}(${parameters.map(p => p.name).join(', ')});
        
        // Format and print output
${outputFormatting}
        
        scanner.close();
    }
}
`;

    return wrapper;
  }

  /**
   * C++ wrapper generator
   */
  private wrapCpp(userCode: string, signature: FunctionSignature, testInput: string): string {
    const { functionName, parameters, returnType } = signature;
    const className = signature.className || 'Solution';

    // Generate input parsing code
    const inputParsing = this.generateCppInputParsing(parameters);

    // Generate output formatting code
    const outputFormatting = this.generateCppOutputFormatting(returnType);

    const wrapper = `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

${userCode}

int main() {
    // Parse input
${inputParsing}
    
    // Create instance and call function
    Solution solution;
    ${this.getCppTypeString(returnType)} result = solution.${functionName}(${parameters.map(p => p.name).join(', ')});
    
    // Format and print output
${outputFormatting}
    
    return 0;
}
`;

    return wrapper;
  }

  /**
   * JavaScript wrapper generator
   */
  private wrapJavaScript(userCode: string, signature: FunctionSignature, testInput: string): string {
    const { functionName, parameters } = signature;

    // Generate input parsing code
    const inputParsing = this.generateJavaScriptInputParsing(parameters);

    const wrapper = `
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

${userCode}

let lines = [];
rl.on('line', (line) => {
    lines.push(line.trim());
});

rl.on('close', () => {
    // Parse input
${inputParsing}
    
    // Call function
    const result = ${functionName}(${parameters.map(p => p.name).join(', ')});
    
    // Format and print output
    if (Array.isArray(result)) {
        console.log(result.join(' '));
    } else {
        console.log(result);
    }
});
`;

    return wrapper;
  }

  /**
   * Generate Python input parsing code
   */
  private generatePythonInputParsing(parameters: FunctionParameter[]): string {
    let code = '';
    let lineIndex = 0;

    for (const param of parameters) {
      const indent = '    ';
      if (param.type === 'int') {
        code += `${indent}${param.name} = int(input())\n`;
      } else if (param.type === 'float' || param.type === 'double') {
        code += `${indent}${param.name} = float(input())\n`;
      } else if (param.type === 'string') {
        code += `${indent}${param.name} = input().strip()\n`;
      } else if (param.type === 'int[]' || param.type === 'List[int]') {
        code += `${indent}${param.name} = list(map(int, input().split()))\n`;
      } else if (param.type === 'float[]' || param.type === 'List[float]') {
        code += `${indent}${param.name} = list(map(float, input().split()))\n`;
      } else if (param.type === 'string[]' || param.type === 'List[str]') {
        code += `${indent}${param.name} = input().split()\n`;
      } else {
        // Default: read as string
        code += `${indent}${param.name} = input().strip()\n`;
      }
      lineIndex++;
    }

    return code;
  }

  /**
   * Generate Python output formatting code
   */
  private generatePythonOutputFormatting(returnType: string): string {
    const indent = '    ';
    if (returnType.includes('[]') || returnType.includes('List')) {
      return `${indent}print(' '.join(map(str, result)))`;
    } else if (returnType === 'void' || returnType === 'None') {
      return `${indent}# No return value`;
    } else {
      return `${indent}print(result)`;
    }
  }

  /**
   * Generate Java input parsing code
   */
  private generateJavaInputParsing(parameters: FunctionParameter[]): string {
    let code = '';
    const indent = '        ';

    for (const param of parameters) {
      if (param.type === 'int') {
        code += `${indent}int ${param.name} = scanner.nextInt();\n`;
      } else if (param.type === 'long') {
        code += `${indent}long ${param.name} = scanner.nextLong();\n`;
      } else if (param.type === 'double' || param.type === 'float') {
        code += `${indent}double ${param.name} = scanner.nextDouble();\n`;
      } else if (param.type === 'String') {
        code += `${indent}String ${param.name} = scanner.next();\n`;
      } else if (param.type === 'int[]') {
        code += `${indent}int n_${param.name} = scanner.nextInt();\n`;
        code += `${indent}int[] ${param.name} = new int[n_${param.name}];\n`;
        code += `${indent}for (int i = 0; i < n_${param.name}; i++) {\n`;
        code += `${indent}    ${param.name}[i] = scanner.nextInt();\n`;
        code += `${indent}}\n`;
      } else if (param.type === 'String[]') {
        code += `${indent}int n_${param.name} = scanner.nextInt();\n`;
        code += `${indent}String[] ${param.name} = new String[n_${param.name}];\n`;
        code += `${indent}for (int i = 0; i < n_${param.name}; i++) {\n`;
        code += `${indent}    ${param.name}[i] = scanner.next();\n`;
        code += `${indent}}\n`;
      } else {
        code += `${indent}String ${param.name} = scanner.next();\n`;
      }
    }

    return code;
  }

  /**
   * Generate Java output formatting code
   */
  private generateJavaOutputFormatting(returnType: string): string {
    const indent = '        ';
    if (returnType === 'int[]') {
      return `${indent}for (int i = 0; i < result.length; i++) {\n${indent}    System.out.print(result[i]);\n${indent}    if (i < result.length - 1) System.out.print(" ");\n${indent}}\n${indent}System.out.println();`;
    } else if (returnType === 'String[]') {
      return `${indent}for (int i = 0; i < result.length; i++) {\n${indent}    System.out.print(result[i]);\n${indent}    if (i < result.length - 1) System.out.print(" ");\n${indent}}\n${indent}System.out.println();`;
    } else if (returnType === 'void') {
      return `${indent}// No return value`;
    } else {
      return `${indent}System.out.println(result);`;
    }
  }

  /**
   * Generate C++ input parsing code
   */
  private generateCppInputParsing(parameters: FunctionParameter[]): string {
    let code = '';
    const indent = '    ';

    for (const param of parameters) {
      if (param.type === 'int') {
        code += `${indent}int ${param.name};\n${indent}cin >> ${param.name};\n`;
      } else if (param.type === 'long') {
        code += `${indent}long ${param.name};\n${indent}cin >> ${param.name};\n`;
      } else if (param.type === 'double' || param.type === 'float') {
        code += `${indent}double ${param.name};\n${indent}cin >> ${param.name};\n`;
      } else if (param.type === 'string') {
        code += `${indent}string ${param.name};\n${indent}cin >> ${param.name};\n`;
      } else if (param.type === 'vector<int>' || param.type === 'int[]') {
        code += `${indent}int n_${param.name};\n${indent}cin >> n_${param.name};\n`;
        code += `${indent}vector<int> ${param.name}(n_${param.name});\n`;
        code += `${indent}for (int i = 0; i < n_${param.name}; i++) {\n`;
        code += `${indent}    cin >> ${param.name}[i];\n`;
        code += `${indent}}\n`;
      } else if (param.type === 'vector<string>' || param.type === 'string[]') {
        code += `${indent}int n_${param.name};\n${indent}cin >> n_${param.name};\n`;
        code += `${indent}vector<string> ${param.name}(n_${param.name});\n`;
        code += `${indent}for (int i = 0; i < n_${param.name}; i++) {\n`;
        code += `${indent}    cin >> ${param.name}[i];\n`;
        code += `${indent}}\n`;
      } else {
        code += `${indent}string ${param.name};\n${indent}cin >> ${param.name};\n`;
      }
    }

    return code;
  }

  /**
   * Generate C++ output formatting code
   */
  private generateCppOutputFormatting(returnType: string): string {
    const indent = '    ';
    if (returnType === 'vector<int>' || returnType === 'int[]') {
      return `${indent}for (int i = 0; i < result.size(); i++) {\n${indent}    cout << result[i];\n${indent}    if (i < result.size() - 1) cout << " ";\n${indent}}\n${indent}cout << endl;`;
    } else if (returnType === 'vector<string>' || returnType === 'string[]') {
      return `${indent}for (int i = 0; i < result.size(); i++) {\n${indent}    cout << result[i];\n${indent}    if (i < result.size() - 1) cout << " ";\n${indent}}\n${indent}cout << endl;`;
    } else if (returnType === 'void') {
      return `${indent}// No return value`;
    } else {
      return `${indent}cout << result << endl;`;
    }
  }

  /**
   * Generate JavaScript input parsing code
   */
  private generateJavaScriptInputParsing(parameters: FunctionParameter[]): string {
    let code = '';
    const indent = '    ';
    let lineIndex = 0;

    for (const param of parameters) {
      if (param.type === 'number' || param.type === 'int') {
        code += `${indent}const ${param.name} = parseInt(lines[${lineIndex}]);\n`;
      } else if (param.type === 'float' || param.type === 'double') {
        code += `${indent}const ${param.name} = parseFloat(lines[${lineIndex}]);\n`;
      } else if (param.type === 'string') {
        code += `${indent}const ${param.name} = lines[${lineIndex}];\n`;
      } else if (param.type === 'number[]' || param.type === 'int[]') {
        code += `${indent}const ${param.name} = lines[${lineIndex}].split(' ').map(Number);\n`;
      } else if (param.type === 'string[]') {
        code += `${indent}const ${param.name} = lines[${lineIndex}].split(' ');\n`;
      } else {
        code += `${indent}const ${param.name} = lines[${lineIndex}];\n`;
      }
      lineIndex++;
    }

    return code;
  }

  /**
   * Get Java type string from generic type
   */
  private getJavaTypeString(type: string): string {
    const typeMap: { [key: string]: string } = {
      'int': 'int',
      'long': 'long',
      'double': 'double',
      'float': 'float',
      'String': 'String',
      'int[]': 'int[]',
      'String[]': 'String[]',
      'void': 'void',
    };
    return typeMap[type] || type;
  }

  /**
   * Get C++ type string from generic type
   */
  private getCppTypeString(type: string): string {
    const typeMap: { [key: string]: string } = {
      'int': 'int',
      'long': 'long',
      'double': 'double',
      'float': 'float',
      'string': 'string',
      'int[]': 'vector<int>',
      'string[]': 'vector<string>',
      'vector<int>': 'vector<int>',
      'vector<string>': 'vector<string>',
      'void': 'void',
    };
    return typeMap[type] || type;
  }

  /**
   * Check if execution mode is function mode
   */
  static isFunctionMode(executionMode: string): boolean {
    return executionMode?.toLowerCase() === 'function';
  }

  /**
   * Validate function signature
   */
  validateFunctionSignature(signature: FunctionSignature): boolean {
    if (!signature.functionName || signature.functionName.trim() === '') {
      logger.error('Function name is required');
      return false;
    }

    if (!Array.isArray(signature.parameters)) {
      logger.error('Parameters must be an array');
      return false;
    }

    if (!signature.returnType || signature.returnType.trim() === '') {
      logger.error('Return type is required');
      return false;
    }

    for (const param of signature.parameters) {
      if (!param.name || !param.type) {
        logger.error('Parameter name and type are required');
        return false;
      }
    }

    return true;
  }
}
