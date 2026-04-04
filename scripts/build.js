#!/usr/bin/env node

/**
 * build.js
 *
 * Builds a clean production-ready copy of the IronBound app into ./dist/.
 * Used by both the developer (local testing) and the release CI workflow.
 *
 * Output mirrors exactly what end users receive in the ZIP download.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Clean dist/
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Read version
const version = fs.readFileSync(path.join(ROOT, 'version.txt'), 'utf-8').trim();
console.log(`Building v${version}...`);

// --- Step 1: Copy IRONBOUND-USER.md, strip dev mode, output as IRONBOUND.md ---
let ironbound = fs.readFileSync(path.join(ROOT, 'IRONBOUND-USER.md'), 'utf-8');

// Remove DEV_MODE blocks
ironbound = ironbound.replace(
  /\n*<!-- DEV_MODE_START -->[\s\S]*?<!-- DEV_MODE_END -->\n*/g,
  '\n'
);

// Stamp version
ironbound = ironbound.replace(
  /<!-- IRONBOUND — https:\/\/github\.com\/cordfuseinc\/ironbound -->/,
  `<!-- IRONBOUND v${version} — https://github.com/cordfuseinc/ironbound -->`
);

fs.writeFileSync(path.join(DIST, 'IRONBOUND.md'), ironbound, 'utf-8');
console.log('  IRONBOUND-USER.md → dist/IRONBOUND.md — stripped dev mode, stamped version');

// --- Step 2: Generate checksum ---
const crypto = require('crypto');

const withoutChecksum = ironbound.replace(
  /<!-- Checksum: [a-fA-F0-9]+ -->/,
  '<!-- Checksum: NONE (dev build — run release workflow to generate) -->'
);

const hash = crypto
  .createHash('sha256')
  .update(withoutChecksum, 'utf-8')
  .digest('hex');

// Embed checksum into the dist copy
const finalIronbound = ironbound.replace(
  /<!-- Checksum: NONE \(dev build — run release workflow to generate\) -->/,
  `<!-- Checksum: ${hash} -->`
);
fs.writeFileSync(path.join(DIST, 'IRONBOUND.md'), finalIronbound, 'utf-8');
fs.writeFileSync(path.join(DIST, '.ironbound-checksum'), hash + '\n', 'utf-8');
console.log(`  Checksum: ${hash}`);

// --- Step 3: Sync agent files from clean IRONBOUND.md ---
const agentFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.windsurfrules', '.clinerules'];
for (const file of agentFiles) {
  fs.writeFileSync(path.join(DIST, file), finalIronbound, 'utf-8');
}
console.log(`  Synced agent files: ${agentFiles.join(', ')}`);

// --- Step 4: Copy ironbound/ app definition directory ---
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const ironboundDir = path.join(ROOT, 'ironbound');
if (fs.existsSync(ironboundDir)) {
  copyDirRecursive(ironboundDir, path.join(DIST, 'ironbound'));
  console.log('  Copied ironbound/ app definition');
}

// --- Step 5: Copy src/ if it exists ---
const srcDir = path.join(ROOT, 'src');
if (fs.existsSync(srcDir)) {
  copyDirRecursive(srcDir, path.join(DIST, 'src'));
  console.log('  Copied src/ tooling');
}

// --- Step 6: Copy other shipping files ---
const copyFiles = ['README.md', 'LICENSE', 'version.txt', 'package.json', '.gitignore'];
for (const file of copyFiles) {
  const srcPath = path.join(ROOT, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(DIST, file));
  }
}

// Update package.json version if it exists
const distPkg = path.join(DIST, 'package.json');
if (fs.existsSync(distPkg)) {
  const pkg = JSON.parse(fs.readFileSync(distPkg, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(distPkg, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

// --- Step 7: Create output/.gitkeep if output dir pattern is used ---
const outputDir = path.join(DIST, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, '.gitkeep'), '', 'utf-8');
}

console.log(`\nBuild complete → ./dist/`);
console.log(`Open this directory in an agent CLI to test user mode.`);
