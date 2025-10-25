const axios = require('axios');

async function testAuth() {
  try {
    // Get token from localStorage (you'll need to replace this with actual token)
    const token = 'YOUR_TOKEN_HERE'; // Replace with actual token from browser localStorage
    
    console.log('Testing authentication...');
    
    const response = await axios.get('http://localhost:5000/api/debug/auth', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Auth debug response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Auth test error:', error.response?.data || error.message);
  }
}

// Run the test
testAuth();