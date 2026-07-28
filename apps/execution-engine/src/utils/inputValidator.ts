/**
 * Input Validator & Sanitizer
 * Ensures input is properly formatted before sending to user code
 */

import { logger } from '../config/logger';

export class InputValidator {
  /**
   * Validate and sanitize input to prevent hanging/parsing issues
   */
  static validateInput(input: string): { valid: boolean; sanitized: string; error?: string } {
    try {
      // Remove null bytes and other problematic characters
      let sanitized = input
        .replace(/\0/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

      // Ensure input ends with exactly one newline
      sanitized = sanitized.trimEnd() + '\n';

      // Check for excessively long input
      if (sanitized.length > 10 * 1024 * 1024) { // 10MB limit
        return {
          valid: false,
          sanitized: '',
          error: 'Input exceeds maximum size (10MB)',
        };
      }

      // Ensure no invalid UTF-8 sequences
      const encoded = Buffer.from(sanitized, 'utf8');
      const decoded = encoded.toString('utf8');
      
      if (decoded !== sanitized) {
        logger.warn('Input contained invalid UTF-8 sequences');
        sanitized = decoded;
      }

      return {
        valid: true,
        sanitized,
      };
    } catch (error: any) {
      logger.error('Input validation error:', error);
      return {
        valid: false,
        sanitized: '',
        error: error.message || 'Invalid input format',
      };
    }
  }

  /**
   * Ensure input ends with proper line termination for Scanner/BufferedReader
   */
  static ensureProperTermination(input: string): string {
    const trimmed = input.trimEnd();
    if (trimmed.length === 0) {
      return '\n';
    }
    return trimmed + '\n';
  }

  /**
   * Validate test case input/output pairs
   */
  static validateTestCase(input: string, expectedOutput: string): { valid: boolean; error?: string } {
    if (input === null || input === undefined) {
      return { valid: false, error: 'Input is null or undefined' };
    }

    if (expectedOutput === null || expectedOutput === undefined) {
      return { valid: false, error: 'Expected output is null or undefined' };
    }

    // Basic validation
    if (typeof input !== 'string') {
      return { valid: false, error: 'Input must be a string' };
    }

    if (typeof expectedOutput !== 'string') {
      return { valid: false, error: 'Expected output must be a string' };
    }

    return { valid: true };
  }
}
