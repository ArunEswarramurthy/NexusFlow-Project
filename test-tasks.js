const { Task } = require('./backend/models');

async function testTasks() {
  try {
    console.log('Testing task creation and retrieval...');
    
    // Create a test task
    const testTask = await Task.create({
      org_id: 1,
      title: 'Test Task',
      description: 'This is a test task',
      task_id: 'TEST-001',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'to_do',
      created_by: 1
    });
    
    console.log('✅ Test task created:', testTask.id);
    
    // Retrieve all tasks
    const allTasks = await Task.findAll({
      where: { org_id: 1 },
      order: [['created_at', 'DESC']]
    });
    
    console.log('📋 Total tasks found:', allTasks.length);
    console.log('Tasks:', allTasks.map(t => ({ id: t.id, title: t.title, org_id: t.org_id })));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testTasks();