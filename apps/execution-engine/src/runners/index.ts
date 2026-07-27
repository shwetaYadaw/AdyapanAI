import { Language } from '../types';
import { BaseRunner } from './base.runner';
import { CppRunner } from './cpp.runner';
import { JavaRunner } from './java.runner';
import { PythonRunner } from './python.runner';
import { JavaScriptRunner } from './javascript.runner';

// Runner registry
const runners: Map<Language, BaseRunner> = new Map();

// Initialize runners
runners.set('cpp', new CppRunner());
runners.set('java', new JavaRunner());
runners.set('python', new PythonRunner());
runners.set('javascript', new JavaScriptRunner());

/**
 * Get runner for a specific language
 */
export function getRunner(language: Language): BaseRunner {
  const runner = runners.get(language);
  if (!runner) {
    throw new Error(`No runner found for language: ${language}`);
  }
  return runner;
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): Language[] {
  return Array.from(runners.keys());
}

export { BaseRunner };
export * from './cpp.runner';
export * from './java.runner';
export * from './python.runner';
export * from './javascript.runner';
