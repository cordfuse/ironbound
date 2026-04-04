#!/usr/bin/env node

/**
 * generate-checksum.js
 *
 * Computes SHA-256 of the current IRONBOUND.md (should be run after
 * strip-dev-mode.js), writes the hash to .ironbound-checksum, and embeds
 * it as an HTML comment in IRONBOUND.md replacing the placeholder.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IRONBOUND_PATH = path.resolve(__dirname, '..', 'IRONBOUND.md');
const CHECKSUM_PATH = path.resolve(__dirname, '..', '.ironbound-checksum');
const VERSION_PATH = path.resolve(__dirname, '..', 'version.txt');

const version = fs.readFileSync(VERSION_PATH, 'utf-8').trim();
console.log(`Building for version: ${version}`);

// Read the current (clean) IRONBOUND.md
let content = fs.readFileSync(IRONBOUND_PATH, 'utf-8');

// Remove any existing checksum comment so it doesn't affect the hash
const withoutChecksum = content.replace(
  /<!-- Checksum: [a-fA-F0-9]+ -->/,
  '<!-- Checksum: NONE (dev build — run release workflow to generate) -->'
);

// Compute SHA-256 of the content without the checksum embedded
const hash = crypto
  .createHash('sha256')
  .update(withoutChecksum, 'utf-8')
  .digest('hex');

// Write the checksum file
fs.writeFileSync(CHECKSUM_PATH, hash + '\n', 'utf-8');
console.log(`Checksum written to .ironbound-checksum: ${hash}`);

// Embed the checksum back into IRONBOUND.md
const final = withoutChecksum.replace(
  /<!-- Checksum: NONE \(dev build — run release workflow to generate\) -->/,
  `<!-- Checksum: ${hash} -->`
);

fs.writeFileSync(IRONBOUND_PATH, final, 'utf-8');
console.log('Checksum embedded in IRONBOUND.md');
