#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Try to find the correct entry point
const cjsPath = path.join(__dirname, 'dist', 'index.cjs');
const jsPath = path.join(__dirname, 'dist', 'index.js');

let entryPoint = null;

if (fs.existsSync(cjsPath)) {
  entryPoint = cjsPath;
  console.log('[START] Using dist/index.cjs');
} else if (fs.existsSync(jsPath)) {
  entryPoint = jsPath;
  console.log('[START] Using dist/index.js');
} else {
  console.error('[ERROR] Neither dist/index.cjs nor dist/index.js found!');
  process.exit(1);
}

// Spawn the Node.js process
const child = spawn('node', [entryPoint], {
  stdio: 'inherit',
  env: process.env
});

// Handle exit
child.on('exit', (code) => {
  process.exit(code);
});

// Handle signals
process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});
