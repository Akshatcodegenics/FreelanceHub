#!/usr/bin/env node

/**
 * Production Build Script for FreelanceHub Client
 * Handles environment variables and build optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const checkEnvironment = () => {
  log('🔍 Checking environment configuration...', 'cyan');
  
  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    log('📦 Building for production environment', 'blue');
    
    // Check for production environment file
    if (fs.existsSync('.env.production')) {
      log('✅ Production environment file found', 'green');
    } else {
      log('⚠️  No .env.production file found, using defaults', 'yellow');
    }
  } else {
    log('🛠️  Building for development environment', 'blue');
  }
};

const validateBuildRequirements = () => {
  log('📋 Validating build requirements...', 'cyan');
  
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    log('❌ Dependencies not installed!', 'red');
    log('📝 Please run: npm install', 'yellow');
    process.exit(1);
  }
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found!', 'red');
    process.exit(1);
  }
  
  log('✅ Build requirements satisfied', 'green');
};

const cleanPreviousBuild = () => {
  log('🧹 Cleaning previous build...', 'cyan');
  
  if (fs.existsSync('dist')) {
    try {
      execSync('rm -rf dist', { stdio: 'inherit' });
      log('✅ Previous build cleaned', 'green');
    } catch (error) {
      // Fallback for Windows
      try {
        execSync('rmdir /s /q dist', { stdio: 'inherit' });
        log('✅ Previous build cleaned', 'green');
      } catch (winError) {
        log('⚠️  Could not clean previous build', 'yellow');
      }
    }
  }
};

const runBuild = () => {
  log('🚀 Starting build process...', 'cyan');
  
  try {
    // Set production environment
    process.env.NODE_ENV = 'production';
    
    // Run Vite build
    execSync('npm run build', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    log('✅ Build completed successfully!', 'green');
    
    // Check build output
    if (fs.existsSync('dist')) {
      const stats = fs.statSync('dist');
      log(`📦 Build output created: ${stats.isDirectory() ? 'directory' : 'file'}`, 'blue');
      
      // List build files
      try {
        const files = fs.readdirSync('dist');
        log(`📁 Build contains ${files.length} files/folders`, 'blue');
      } catch (error) {
        // Ignore error
      }
    }
    
  } catch (error) {
    log('❌ Build failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
};

const validateBuildOutput = () => {
  log('🔍 Validating build output...', 'cyan');
  
  // Check if dist directory exists
  if (!fs.existsSync('dist')) {
    log('❌ Build output directory not found!', 'red');
    process.exit(1);
  }
  
  // Check if index.html exists
  if (!fs.existsSync('dist/index.html')) {
    log('❌ index.html not found in build output!', 'red');
    process.exit(1);
  }
  
  // Check if assets directory exists
  if (!fs.existsSync('dist/assets')) {
    log('⚠️  Assets directory not found in build output', 'yellow');
  } else {
    const assets = fs.readdirSync('dist/assets');
    log(`📦 Found ${assets.length} asset files`, 'blue');
  }
  
  log('✅ Build output validation passed', 'green');
};

const displaySummary = () => {
  log('', 'reset');
  log('🎉 Build Summary', 'cyan');
  log('================', 'cyan');
  log('✅ Client build completed successfully', 'green');
  log('📁 Output directory: ./dist', 'blue');
  log('🌐 Ready for deployment', 'green');
  log('', 'reset');
  log('📝 Next steps:', 'yellow');
  log('  1. Test the build: npm run preview', 'reset');
  log('  2. Deploy to your hosting platform', 'reset');
  log('  3. Configure environment variables', 'reset');
  log('', 'reset');
};

const main = () => {
  try {
    log('🚀 FreelanceHub Client Build Script', 'cyan');
    log('===================================', 'cyan');
    
    checkEnvironment();
    validateBuildRequirements();
    cleanPreviousBuild();
    runBuild();
    validateBuildOutput();
    displaySummary();
    
  } catch (error) {
    log(`❌ Build script failed: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Run the build script
if (require.main === module) {
  main();
}

module.exports = { main, checkEnvironment, validateBuildRequirements, runBuild };
