const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Login with demo credentials
    console.log('1. Testing login with demo credentials...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'demo@freelancehub.com',
      password: 'demo123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful!');
      console.log('   User:', loginResponse.data.user.name);
      console.log('   Token:', loginResponse.data.token ? 'Generated' : 'Missing');
    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 8000');
      console.log('   Please start the server with: cd server && node server.js');
    } else {
      console.log('❌ Login error:', error.response?.data?.message || error.message);
    }
  }

  try {
    // Test 2: Register with demo email
    console.log('\n2. Testing registration with demo email...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Test User',
      email: 'test@demo.com',
      password: 'test123',
      role: 'client'
    });

    if (registerResponse.data.success) {
      console.log('✅ Registration successful!');
      console.log('   User:', registerResponse.data.user.name);
      console.log('   Token:', registerResponse.data.token ? 'Generated' : 'Missing');
    } else {
      console.log('❌ Registration failed');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 8000');
    } else {
      console.log('❌ Registration error:', error.response?.data?.message || error.message);
    }
  }

  try {
    // Test 3: Invalid login
    console.log('\n3. Testing invalid login...');
    const invalidLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    });

    console.log('❌ Invalid login should have failed but succeeded');

  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 503) {
      console.log('✅ Invalid login correctly rejected');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 8000');
    } else {
      console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
    }
  }

  console.log('\n🏁 Authentication tests completed!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Email: demo@freelancehub.com');
  console.log('   Password: demo123');
}

testAuth();
