const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/admin-login', {
      email: 'e22ec018@shanmugha.edu.in',
      password: 'Admin123!'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin login successful:', response.data);
    
  } catch (error) {
    console.error('❌ Admin login failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testAdminLogin();