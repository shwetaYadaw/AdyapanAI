#!/usr/bin/env node
/**
 * ADYAPAN — MySQL-Only Architecture Checker
 * 
 * Run: yarn check:mysql-only
 * 
 * Scans the entire backend source for any MongoDB/Mongoose code
 * that should not exist. Fails with exit code 1 if anything is found.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD  = '\x1b[1m';
const RESET = '\x1b[0m';

const BACKEND_SRC = path.resolve(__dirname, '../apps/backend/src');
const BACKEND_ROOT = path.resolve(__dirname, '../apps/backend');

let errors = 0;
let warnings = 0;

function log(color, icon, msg) {
  console.log(`${color}${icon} ${msg}${RESET}`);
}

function check(label, fn) {
  try {
    const result = fn();
    if (result) {
      log(RED, '❌', `FAIL [${label}]: ${result}`);
      errors++;
    } else {
      log(GREEN, '✅', `PASS [${label}]`);
    }
  } catch (e) {
    log(RED, '❌', `ERROR [${label}]: ${e.message}`);
    errors++;
  }
}

function grepRecursive(dir, pattern, extensions = ['.ts']) {
  const results = [];
  
  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.tmp') continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (pattern.test(content)) {
          results.push(path.relative(process.cwd(), fullPath));
        }
      }
    }
  }
  
  walk(dir);
  return results;
}

console.log(`\n${BOLD}${YELLOW}══════════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  🛡️  ADYAPAN MySQL-Only Architecture Checker${RESET}`);
console.log(`${BOLD}${YELLOW}══════════════════════════════════════════════════════${RESET}\n`);

// ── Check 1: No mongoose imports ────────────────────────────────────────────
check("No 'mongoose' imports in source", () => {
  const files = grepRecursive(BACKEND_SRC, /from ['"]mongoose['"]|require\(['"]mongoose['"]\)/);
  if (files.length > 0) return `mongoose imported in:\n  ${files.join('\n  ')}`;
  return null;
});

// ── Check 2: No Mongoose model imports ──────────────────────────────────────
check("No '../models/' imports in source", () => {
  const files = grepRecursive(BACKEND_SRC, /from ['"]\.+\/models\//);
  if (files.length > 0) return `Mongoose model imported in:\n  ${files.join('\n  ')}`;
  return null;
});

// ── Check 3: models/ directory is empty ────────────────────────────────────
check("src/models/ directory is empty", () => {
  const modelsDir = path.join(BACKEND_SRC, 'models');
  if (!fs.existsSync(modelsDir)) return null;
  const files = fs.readdirSync(modelsDir).filter(f => f !== '.gitkeep');
  if (files.length > 0) return `Non-empty models/ directory: ${files.join(', ')}`;
  return null;
});

// ── Check 4: No MONGODB_URI in env files ────────────────────────────────────
check("No MONGODB_URI in .env files", () => {
  const envFiles = ['.env', '.env.example', '.env.production', '.env.local'].map(f => 
    path.join(BACKEND_ROOT, f)
  ).filter(f => fs.existsSync(f));
  
  for (const envFile of envFiles) {
    const content = fs.readFileSync(envFile, 'utf-8');
    const lines = content.split('\n');
    const mongoLine = lines.find(l => l.match(/^MONGODB_URI=/));
    if (mongoLine) {
      return `MONGODB_URI found in ${path.basename(envFile)}: "${mongoLine}"`;
    }
  }
  return null;
});

// ── Check 5: mongoose not in package.json ───────────────────────────────────
check("mongoose not in package.json dependencies", () => {
  const pkgPath = path.join(BACKEND_ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (allDeps['mongoose']) return `mongoose found in package.json: "${allDeps['mongoose']}"`;
  return null;
});

// ── Check 6: express-mongo-sanitize not in package.json ─────────────────────
check("express-mongo-sanitize not in package.json", () => {
  const pkgPath = path.join(BACKEND_ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (allDeps['express-mongo-sanitize']) return `express-mongo-sanitize found in package.json`;
  return null;
});

// ── Check 7: No database.ts config file ─────────────────────────────────────
check("No MongoDB database.ts config file", () => {
  const dbFile = path.join(BACKEND_SRC, 'config', 'database.ts');
  if (fs.existsSync(dbFile)) return `MongoDB database.ts config still exists at ${dbFile}`;
  return null;
});

// ── Check 8: DATABASE_URL is required in env.ts ─────────────────────────────
check("DATABASE_URL is required in env.ts (not optional)", () => {
  const envTsPath = path.join(BACKEND_SRC, 'config', 'env.ts');
  if (!fs.existsSync(envTsPath)) return 'env.ts not found';
  const content = fs.readFileSync(envTsPath, 'utf-8');
  if (!content.includes("requireEnv('DATABASE_URL')")) {
    return "DATABASE_URL is not requireEnv() in env.ts — MySQL connection must be mandatory";
  }
  if (content.includes("requireEnv('MONGODB_URI')")) {
    return "MONGODB_URI is still requireEnv() in env.ts — remove it";
  }
  return null;
});

// ── Check 9: Prisma schema file exists ──────────────────────────────────────
check("prisma/schema.prisma exists with MySQL datasource", () => {
  const schemaPath = path.join(BACKEND_ROOT, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) return 'schema.prisma not found';
  const content = fs.readFileSync(schemaPath, 'utf-8');
  if (!content.includes('provider = "mysql"')) return 'schema.prisma datasource is not mysql';
  return null;
});

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${YELLOW}══════════════════════════════════════════════════════${RESET}`);
if (errors === 0) {
  console.log(`${GREEN}${BOLD}  ✅ ALL CHECKS PASSED — MySQL-only architecture confirmed${RESET}`);
} else {
  console.log(`${RED}${BOLD}  ❌ ${errors} CHECK(S) FAILED — MongoDB/Mongoose code detected!${RESET}`);
  console.log(`${RED}  Fix the issues above. This project is MySQL + Prisma ONLY.${RESET}`);
}
console.log(`${BOLD}${YELLOW}══════════════════════════════════════════════════════${RESET}\n`);

process.exit(errors > 0 ? 1 : 0);
