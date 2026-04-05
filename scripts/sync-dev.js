#!/usr/bin/env node

/**
 * sync-dev.js
 *
 * Copies IRONBOUND-DEV.md content into all agent files (CLAUDE.md, GEMINI.md,
 * AGENTS.md, .windsurfrules, .clinerules) so the IDE agent reliably reads
 * dev mode instructions without needing to follow a file redirect.
 *
 * Run after editing IRONBOUND-DEV.md:
 *   node scripts/sync-dev.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEV_MD = path.join(ROOT, 'IRONBOUND-DEV.md');

if (!fs.existsSync(DEV_MD)) {
  console.error('IRONBOUND-DEV.md not found');
  process.exit(1);
}

const content = fs.readFileSync(DEV_MD, 'utf-8');

const agentFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.windsurfrules', '.clinerules'];

for (const file of agentFiles) {
  fs.writeFileSync(path.join(ROOT, file), content, 'utf-8');
}

console.log(`Synced IRONBOUND-DEV.md → ${agentFiles.join(', ')}`);
