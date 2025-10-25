const fetch = require('node-fetch');

async function createTestTask() {
  try {
    // First login to get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'e22ec018@shanmugha.edu.in',
        password: 'E22EC018 732722106004'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Logged in successfully');
    
    // Create task
    const taskResponse = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Task from Script',
        description: 'This is a test task created via script',
        priority: 'medium'
      })
    });
    
    const taskData = await taskResponse.json();
    console.log('📝 Task creation response:', taskData);
    
    // Get all tasks
    const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const tasksData = await tasksResponse.json();
    console.log('📋 All tasks:', tasksData);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestTask();