export interface LanguageConfig {
  id: string;
  name: string;
  extension: string;
  dockerImage: string;
  compileCommand?: string;
  runCommand: string;
  timeout: number; // in seconds
  memoryLimit: number; // in MB
}

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  cpp: {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    dockerImage: 'adyapan/runner-cpp:latest',
    compileCommand: 'g++ -std=c++17 -O2 -Wall -Wextra -o /app/solution /app/solution.cpp',
    runCommand: '/app/solution',
    timeout: 5,
    memoryLimit: 256,
  },
  java: {
    id: 'java',
    name: 'Java',
    extension: 'java',
    dockerImage: 'adyapan/runner-java:latest',
    compileCommand: 'javac -d /app /app/Main.java',
    runCommand: 'java -cp /app Main',
    timeout: 10, // Increased to 10 seconds for complex problems
    memoryLimit: 512,
  },
  python: {
    id: 'python',
    name: 'Python',
    extension: 'py',
    dockerImage: 'adyapan/runner-python:latest',
    runCommand: 'python3 /app/solution.py',
    timeout: 5,
    memoryLimit: 256,
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    dockerImage: 'adyapan/runner-javascript:latest',
    runCommand: 'node /app/solution.js',
    timeout: 5,
    memoryLimit: 256,
  },
};

export function getLanguageConfig(language: string): LanguageConfig | undefined {
  const normalized = language.toLowerCase().trim();
  return LANGUAGE_CONFIGS[normalized] || LANGUAGE_CONFIGS[Object.keys(LANGUAGE_CONFIGS).find(k => k === normalized) || ''];
}

export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_CONFIGS);
}
