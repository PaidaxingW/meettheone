#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || '';
const useSqlite = dbUrl.startsWith('file:') || dbUrl === '';

if (useSqlite) {
  content = content.replace('provider = "postgresql"', 'provider = "sqlite"');
  console.log('[prisma-setup] Using SQLite');
} else {
  content = content.replace('provider = "sqlite"', 'provider = "postgresql"');
  console.log('[prisma-setup] Using PostgreSQL');
}

fs.writeFileSync(schemaPath, content);
execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

if (process.argv.includes('--push')) {
  execSync('npx prisma db push', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

