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
    dockerImage: 'gcc:latest',
    compileCommand: 'g++ -std=c++17 -O2 -o /app/solution /app/solution.cpp',
    runCommand: '/app/solution',
    timeout: 5,
    memoryLimit: 256,
  },
  java: {
    id: 'java',
    name: 'Java',
    extension: 'java',
    dockerImage: 'openjdk:17-slim',
    compileCommand: 'javac -d /app /app/Main.java',
    runCommand: 'java -cp /app Main',
    timeout: 10,
    memoryLimit: 512,
  },
  python: {
    id: 'python',
    name: 'Python',
    extension: 'py',
    dockerImage: 'python:3.11-slim',
    runCommand: 'python3 /app/solution.py',
    timeout: 10,
    memoryLimit: 512,
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    dockerImage: 'node:20-slim',
    runCommand: 'node /app/solution.js',
    timeout: 5,
    memoryLimit: 256,
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    extension: 'sql',
    dockerImage: 'python:3.11-slim',
    runCommand: 'python3 /app/solution.py',
    timeout: 10,
    memoryLimit: 256,
  },
  r: {
    id: 'r',
    name: 'R',
    extension: 'r',
    dockerImage: 'r-base:latest',
    runCommand: 'Rscript /app/solution.r',
    timeout: 10,
    memoryLimit: 512,
  },
  'python-ds': {
    id: 'python-ds',
    name: 'Python (Data Science)',
    extension: 'py',
    dockerImage: 'python:3.11-slim',
    runCommand: 'pip install pandas numpy --quiet 2>/dev/null; python3 /app/solution.py',
    timeout: 30,
    memoryLimit: 512,
  },
};

export function getLanguageConfig(language: string): LanguageConfig | undefined {
  const normalized = language.toLowerCase().trim();
  return LANGUAGE_CONFIGS[normalized] || LANGUAGE_CONFIGS[Object.keys(LANGUAGE_CONFIGS).find(k => k === normalized) || ''];
}

export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_CONFIGS);
}
