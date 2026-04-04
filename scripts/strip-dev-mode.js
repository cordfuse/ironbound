#!/usr/bin/env node

/**
 * strip-dev-mode.js
 *
 * Removes all content between <!-- DEV_MODE_START --> and <!-- DEV_MODE_END -->
 * markers (inclusive) from IRONBOUND.md. This produces a production-clean file
 * that contains no developer-only context.
 */

const fs = require('fs');
const path = require('path');

const IRONBOUND_PATH = path.resolve(__dirname, '..', 'IRONBOUND.md');
const VERSION_PATH = path.resolve(__dirname, '..', 'version.txt');

const version = fs.readFileSync(VERSION_PATH, 'utf-8').trim();
console.log(`Building for version: ${version}`);

const content = fs.readFileSync(IRONBOUND_PATH, 'utf-8');

// Remove DEV_MODE blocks including the markers and any surrounding blank lines
let cleaned = content.replace(
  /\n*<!-- DEV_MODE_START -->[\s\S]*?<!-- DEV_MODE_END -->\n*/g,
  '\n'
);

// Stamp the version into the header comment
cleaned = cleaned.replace(
  /<!-- IRONBOUND — https:\/\/github\.com\/cordfuseinc\/ironbound -->/,
  `<!-- IRONBOUND v${version} — https://github.com/cordfuseinc/ironbound -->`
);

fs.writeFileSync(IRONBOUND_PATH, cleaned, 'utf-8');

console.log('Stripped dev mode blocks from IRONBOUND.md');
