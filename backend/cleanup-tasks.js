const { Task, TaskAssignment } = require('./models');

async function cleanupTasks() {
  try {
    console.log('🧹 Starting task cleanup...');
    
    // Find all tasks with TASK-004 ID
    const duplicateTasks = await Task.findAll({
      where: { task_id: 'TASK-004' },
      order: [['created_at', 'ASC']]
    });
    
    console.log(`Found ${duplicateTasks.length} tasks with ID 'TASK-004'`);
    
    if (duplicateTasks.length <= 1) {
      console.log('✅ No cleanup needed');
      return;
    }
    
    // Keep the first one, delete the rest
    for (let i = 1; i < duplicateTasks.length; i++) {
      const task = duplicateTasks[i];
      
      // Delete related assignments first
      await TaskAssignment.destroy({
        where: { task_id: task.id }
      });
      
      // Delete the task
      await task.destroy();
      
      console.log(`🗑️  Deleted duplicate task ${task.id} (${task.task_id})`);
    }
    
    console.log('✅ Task cleanup completed');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupTasks().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});