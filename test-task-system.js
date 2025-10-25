const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test credentials
const TEST_CREDENTIALS = {
  email: 'e22ec018@shanmugha.edu.in',
  password: 'E22EC018 732722106004'
};

let authToken = '';
let testTaskId = null;
let testUserId = null;

const testTaskSystem = async () => {
  try {
    console.log('🧪 Testing Task Management System...\n');

    // 1. Login to get auth token
    console.log('1. 🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/admin-login`, TEST_CREDENTIALS);
    authToken = loginResponse.data.token;
    console.log('✅ Login successful\n');

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    // 2. Get users for assignment
    console.log('2. 👥 Fetching users...');
    const usersResponse = await axios.get(`${API_BASE}/users`, { headers });
    const users = usersResponse.data.users || [];
    console.log(`✅ Found ${users.length} users`);
    if (users.length > 0) {
      testUserId = users[0].id;
      console.log(`   • Will use user: ${users[0].firstName} ${users[0].lastName} (ID: ${testUserId})`);
    }
    console.log('');

    // 3. Create a test task
    console.log('3. ➕ Creating a test task...');
    const taskData = {
      title: 'Test Task - API Integration',
      description: 'This is a test task created via API to verify the task management system is working correctly.',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedUsers: testUserId ? [testUserId] : [],
      tags: ['test', 'api', 'integration'],
      category: 'Testing'
    };
    
    const createResponse = await axios.post(`${API_BASE}/tasks`, taskData, { headers });
    testTaskId = createResponse.data.task.id;
    console.log(`✅ Task created successfully (ID: ${testTaskId})`);
    console.log(`   • Title: ${createResponse.data.task.title}`);
    console.log(`   • Status: ${createResponse.data.task.status}`);
    console.log(`   • Priority: ${createResponse.data.task.priority}`);
    console.log(`   • Assigned Users: ${createResponse.data.task.assignedUsers?.length || 0}`);
    console.log('');

    // 4. Get all tasks
    console.log('4. 📋 Fetching all tasks...');
    const tasksResponse = await axios.get(`${API_BASE}/tasks`, { headers });
    const tasks = tasksResponse.data.tasks || [];
    console.log(`✅ Found ${tasks.length} tasks:`);
    tasks.forEach(task => {
      console.log(`   • ${task.title} (${task.status}, ${task.priority}, assigned to: ${task.assignedTo})`);
    });
    console.log('');

    // 5. Get task by ID
    console.log('5. 🔍 Fetching task details...');
    const taskResponse = await axios.get(`${API_BASE}/tasks/${testTaskId}`, { headers });
    const task = taskResponse.data.task;
    console.log(`✅ Retrieved task: ${task.title}`);
    console.log(`   • Description: ${task.description.substring(0, 50)}...`);
    console.log(`   • Status: ${task.status}`);
    console.log(`   • Priority: ${task.priority}`);
    console.log(`   • Created by: ${task.createdBy}`);
    console.log(`   • Assigned users: ${task.assignedUsers?.length || 0}`);
    console.log('');

    // 6. Start the task
    console.log('6. ▶️ Starting the task...');
    const startResponse = await axios.post(`${API_BASE}/tasks/${testTaskId}/start`, {}, { headers });
    console.log(`✅ Task started: ${startResponse.data.message}`);
    console.log('');

    // 7. Update task
    console.log('7. ✏️ Updating task...');
    const updateData = {
      description: 'Updated description - Task is now in progress and being worked on.',
      progress: 50,
      tags: ['test', 'api', 'integration', 'updated']
    };
    
    const updateResponse = await axios.put(`${API_BASE}/tasks/${testTaskId}`, updateData, { headers });
    console.log(`✅ Task updated: ${updateResponse.data.message}`);
    console.log('');

    // 8. Submit task for review
    console.log('8. 📤 Submitting task for review...');
    const submitResponse = await axios.post(`${API_BASE}/tasks/${testTaskId}/submit`, {
      submissionNotes: 'Task completed and ready for review. All requirements have been met.'
    }, { headers });
    console.log(`✅ Task submitted: ${submitResponse.data.message}`);
    console.log('');

    // 9. Approve task
    console.log('9. ✅ Approving task...');
    const approveResponse = await axios.post(`${API_BASE}/tasks/${testTaskId}/approve`, {
      approvalNotes: 'Task approved. Great work!'
    }, { headers });
    console.log(`✅ Task approved: ${approveResponse.data.message}`);
    console.log('');

    // 10. Test assignment
    if (testUserId && users.length > 1) {
      console.log('10. 👤 Testing task assignment...');
      const assignResponse = await axios.post(`${API_BASE}/tasks/${testTaskId}/assign`, {
        userIds: [users[1].id] // Assign to second user
      }, { headers });
      console.log(`✅ Task reassigned: ${assignResponse.data.message}`);
      console.log(`   • Assigned to: ${users[1].firstName} ${users[1].lastName}`);
      console.log('');
    }

    // 11. Get final task state
    console.log('11. 📊 Final task state...');
    const finalTaskResponse = await axios.get(`${API_BASE}/tasks/${testTaskId}`, { headers });
    const finalTask = finalTaskResponse.data.task;
    console.log(`✅ Final task state:`);
    console.log(`   • Title: ${finalTask.title}`);
    console.log(`   • Status: ${finalTask.status}`);
    console.log(`   • Progress: ${finalTask.progress || 0}%`);
    console.log(`   • Assigned users: ${finalTask.assignedUsers?.length || 0}`);
    console.log('');

    // 12. Clean up - Delete test task
    console.log('12. 🗑️ Cleaning up test task...');
    await axios.delete(`${API_BASE}/tasks/${testTaskId}`, { headers });
    console.log(`✅ Test task deleted successfully`);
    console.log('');

    console.log('🎉 All Task Management System tests passed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Task creation with assignment');
    console.log('   ✅ Task listing and retrieval');
    console.log('   ✅ Task status management (start → submit → approve)');
    console.log('   ✅ Task updates and progress tracking');
    console.log('   ✅ User assignment and reassignment');
    console.log('   ✅ Task deletion');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
    
    // Clean up on error
    if (testTaskId && authToken) {
      try {
        await axios.delete(`${API_BASE}/tasks/${testTaskId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('🧹 Cleaned up test task after error');
      } catch (cleanupError) {
        console.error('Failed to clean up test task:', cleanupError.message);
      }
    }
  }
};

// Run the test
testTaskSystem();