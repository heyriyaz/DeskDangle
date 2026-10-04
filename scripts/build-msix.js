#!/usr/bin/env node

/**
 * DeskDangle MSIX Build Script
 * Builds DeskDangle as a signed-for-testing MSIX package (default)
 * or as a Microsoft Store submission package (--store).
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const certsDir = path.join(rootDir, 'certs');
const pfxPath = path.join(certsDir, 'DeskDangleTest.pfx');
const cerPath = path.join(certsDir, 'DeskDangleTest.cer');
const appxDir = path.join(rootDir, 'build', 'appx');

const isStore = process.argv.includes('--store');

// Parse optional CLI overrides or env variables
function getArg(flag, envVar) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return process.env[envVar] || null;
}

const customPublisher = getArg('--publisher', 'APPX_PUBLISHER');
const customIdentity = getArg('--identity', 'APPX_IDENTITY');
const customPubDisplay = getArg('--publisher-display', 'APPX_PUBLISHER_DISPLAY');

console.log('='.repeat(60));
console.log(` DeskDangle MSIX Packaging Tool [${isStore ? 'STORE SUBMISSION' : 'LOCAL TEST BUILD'}]`);
console.log('='.repeat(60));

// Helper to run commands
function run(cmd, env = process.env) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd: rootDir, stdio: 'inherit', env });
}

// 1. Generate MSIX Icon Assets
console.log('\n[Step 1/4] Checking and generating MSIX icon assets...');
const iconScript = path.join(__dirname, 'generate-msix-icons.ps1');
run(`powershell -ExecutionPolicy Bypass -File "${iconScript}"`);

// 2. Build Vite Frontend & Electron Main/Preload
console.log('\n[Step 2/4] Compiling application source code...');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
run(`${npmCmd} run build`);

// 3. Configure Signing
const buildEnv = { ...process.env };

if (isStore) {
  console.log('\n[Step 3/4] Configuring for Microsoft Store submission...');
  console.log('Note: Microsoft Store signs the package automatically during ingestion.');
  delete buildEnv.CSC_LINK;
  delete buildEnv.CSC_KEY_PASSWORD;
} else {
  console.log('\n[Step 3/4] Configuring test certificate for local testing...');
  if (!fs.existsSync(pfxPath) || !fs.existsSync(cerPath)) {
    console.log('Generating self-signed test certificate...');
    const certScript = path.join(__dirname, 'generate-test-cert.ps1');
    run(`powershell -ExecutionPolicy Bypass -File "${certScript}" -Install`);
  } else {
    console.log(`Using existing test certificate: ${pfxPath}`);
  }

  buildEnv.CSC_LINK = pfxPath;
  buildEnv.CSC_KEY_PASSWORD = 'DeskDangle123!';
}

// 4. Package MSIX using electron-builder
console.log('\n[Step 4/4] Building MSIX package with electron-builder...');
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const builderArgs = [
  'electron-builder',
  '--win',
  'appx'
];

if (customPublisher) {
  builderArgs.push(`-c.appx.publisher="${customPublisher}"`);
}
if (customIdentity) {
  builderArgs.push(`-c.appx.identityName="${customIdentity}"`);
}
if (customPubDisplay) {
  builderArgs.push(`-c.appx.publisherDisplayName="${customPubDisplay}"`);
}

if (isStore) {
  // Skip code signing (Store signs automatically), but keep icon & metadata applied!
  builderArgs.push('-c.win.signExecutable=false');
}

run(`${npxCmd} ${builderArgs.join(' ')}`, buildEnv);

// 5. Verify Output and Ensure .msix is Present
const releaseDir = path.join(rootDir, 'release');
const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = pkgJson.version;
const expectedAppx = path.join(releaseDir, `DeskDangle-${version}.appx`);
const expectedMsix = path.join(releaseDir, `DeskDangle-${version}.msix`);

// Look for generated appx file
let foundAppx = null;
const possibleAppxPaths = [
  expectedAppx,
  path.join(releaseDir, `DeskDangle ${version}.appx`),
  path.join(releaseDir, `DeskDangle-${version}-x64.appx`),
  path.join(releaseDir, `DeskDangle ${version}-x64.appx`)
];

for (const p of possibleAppxPaths) {
  if (fs.existsSync(p)) {
    foundAppx = p;
    break;
  }
}

if (!foundAppx && fs.existsSync(releaseDir)) {
  const allAppx = fs.readdirSync(releaseDir).filter(f => f.endsWith('.appx') && f.includes(version));
  if (allAppx.length > 0) {
    foundAppx = path.join(releaseDir, allAppx[0]);
  }
}

if (foundAppx) {
  // Ensure both clean standard filenames exist: DeskDangle-${version}.appx and DeskDangle-${version}.msix
  if (foundAppx !== expectedAppx) {
    fs.copyFileSync(foundAppx, expectedAppx);
  }
  fs.copyFileSync(foundAppx, expectedMsix);
  console.log(`Generated and synchronized:\n  - ${path.basename(expectedAppx)}\n  - ${path.basename(expectedMsix)}`);
}

console.log('\n' + '='.repeat(60));
if (fs.existsSync(expectedMsix)) {
  const stats = fs.statSync(expectedMsix);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`SUCCESS: Package created!`);
  console.log(`  MSIX Path: ${expectedMsix}`);
  console.log(`  APPX Path: ${expectedAppx}`);
  console.log(`  Size: ${sizeMB} MB`);
  console.log(`  Version: ${version}`);

  if (!isStore) {
    console.log('\nTo test-install this package locally on Windows:');
    console.log('  npm run install:msix');
    console.log('  OR double-click the .msix file in Windows Explorer (App Installer).');
  } else {
    console.log('\nTo submit this package to Microsoft Store:');
    console.log('  1. Log into Windows Partner Center: https://partner.microsoft.com/dashboard');
    console.log('  2. Create/select your DeskDangle submission.');
    console.log(`  3. Upload the package file: ${expectedMsix}`);
    console.log('  4. Upload store assets from: store-assets/');
  }
} else {
  console.log('Build completed. Checking release directory:');
  const files = fs.readdirSync(releaseDir).filter(f => f.endsWith('.msix') || f.endsWith('.appx'));
  console.log('Found packages:', files);
}
console.log('='.repeat(60) + '\n');
