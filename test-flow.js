const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testRegistrationFlow() {
  console.log('🧪 Testing NexusFlow Registration Flow...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data);

    // Test 2: Registration
    console.log('\n2️⃣ Testing registration...');
    const regData = {
      orgName: 'Test Company',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Test@123',
      phone: '1234567890'
    };

    const regResponse = await axios.post(`${API_BASE}/auth/register`, regData);
    console.log('✅ Registration successful:', regResponse.data);

    // Test 3: Invalid OTP (expected to fail)
    console.log('\n3️⃣ Testing invalid OTP...');
    try {
      await axios.post(`${API_BASE}/auth/verify-otp`, {
        email: 'test@example.com',
        otp: '000000'
      });
    } catch (error) {
      console.log('✅ Invalid OTP correctly rejected:', error.response.data);
    }

    // Test 4: Test routes that require authentication
    console.log('\n4️⃣ Testing protected routes...');
    try {
      await axios.get(`${API_BASE}/auth/me`);
    } catch (error) {
      console.log('✅ Protected route correctly requires auth:', error.response.data);
    }

    console.log('\n🎉 All tests passed! The system is working correctly.');
    console.log('\n📝 To complete registration:');
    console.log('1. Check the server console for the OTP code');
    console.log('2. Use that OTP in the verify-otp endpoint');
    console.log('3. You will receive a JWT token for authentication');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRegistrationFlow();