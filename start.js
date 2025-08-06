#!/usr/bin/env node

/**
 * FreelanceHub Production Starter
 * This script handles the production startup of the FreelanceHub application
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const checkEnvironment = () => {
  log('🔍 Checking environment configuration...', 'cyan');
  
  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    log('❌ .env file not found!', 'red');
    log('📝 Please copy .env.example to .env and configure your environment variables', 'yellow');
    process.exit(1);
  }
  
  // Load environment variables
  require('dotenv').config();
  
  // Check required environment variables
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log('❌ Missing required environment variables:', 'red');
    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    log('📝 Please check your .env file configuration', 'yellow');
    process.exit(1);
  }
  
  log('✅ Environment configuration is valid', 'green');
};

const checkDependencies = () => {
  log('📦 Checking dependencies...', 'cyan');
  
  // Check if node_modules exists in server
  if (!fs.existsSync('server/node_modules')) {
    log('❌ Server dependencies not installed!', 'red');
    log('📝 Please run: cd server && npm install', 'yellow');
    process.exit(1);
  }
  
  // Check if client build exists
  if (!fs.existsSync('client/dist')) {
    log('❌ Client build not found!', 'red');
    log('📝 Please run: cd client && npm run build', 'yellow');
    process.exit(1);
  }
  
  log('✅ Dependencies are ready', 'green');
};

const startServer = () => {
  log('🚀 Starting FreelanceHub server...', 'cyan');
  
  // Set production environment
  process.env.NODE_ENV = 'production';
  
  // Start the server
  const serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  // Handle server process events
  serverProcess.on('error', (error) => {
    log(`❌ Failed to start server: ${error.message}`, 'red');
    process.exit(1);
  });
  
  serverProcess.on('exit', (code) => {
    if (code !== 0) {
      log(`❌ Server exited with code ${code}`, 'red');
      process.exit(code);
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down FreelanceHub...', 'yellow');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\n🛑 Shutting down FreelanceHub...', 'yellow');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
  
  log('✅ FreelanceHub server started successfully!', 'green');
  log(`🌐 Server running on: http://localhost:${process.env.PORT || 8000}`, 'blue');
  log(`📊 Health check: http://localhost:${process.env.PORT || 8000}/api/health`, 'blue');
  log('📝 Press Ctrl+C to stop the server', 'yellow');
};

const displayBanner = () => {
  log('', 'reset');
  log('╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                        FreelanceHub                         ║', 'cyan');
  log('║                   Production Server                         ║', 'cyan');
  log('║                                                              ║', 'cyan');
  log('║  🚀 Enhanced Freelance Marketplace Platform                 ║', 'cyan');
  log('║  💬 WhatsApp-like Messaging System                          ║', 'cyan');
  log('║  💰 Integrated Payment Processing                           ║', 'cyan');
  log('║  📱 Real-time Features with Socket.io                      ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'reset');
};

const main = () => {
  try {
    displayBanner();
    checkEnvironment();
    checkDependencies();
    startServer();
  } catch (error) {
    log(`❌ Startup failed: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Run the startup script
if (require.main === module) {
  main();
}

module.exports = { checkEnvironment, checkDependencies, startServer };
