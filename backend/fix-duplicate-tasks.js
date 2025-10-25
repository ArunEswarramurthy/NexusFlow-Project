const { Task } = require('./models');

async function fixDuplicateTasks() {
  try {
    console.log('🔍 Checking for duplicate task IDs...');
    
    // Find all tasks with their task_ids
    const tasks = await Task.findAll({
      attributes: ['id', 'task_id', 'org_id', 'created_at'],
      order: [['created_at', 'ASC']]
    });
    
    console.log(`Found ${tasks.length} total tasks`);
    
    // Group by task_id to find duplicates
    const taskIdGroups = {};
    tasks.forEach(task => {
      if (!taskIdGroups[task.task_id]) {
        taskIdGroups[task.task_id] = [];
      }
      taskIdGroups[task.task_id].push(task);
    });
    
    // Find duplicates
    const duplicates = Object.entries(taskIdGroups).filter(([taskId, tasks]) => tasks.length > 1);
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate task IDs found');
      return;
    }
    
    console.log(`❌ Found ${duplicates.length} duplicate task IDs:`);
    
    for (const [taskId, duplicateTasks] of duplicates) {
      console.log(`\nTask ID: ${taskId} (${duplicateTasks.length} duplicates)`);
      
      // Keep the first one, update the others
      for (let i = 1; i < duplicateTasks.length; i++) {
        const task = duplicateTasks[i];
        const newTaskId = `${taskId}-FIX-${i}-${Date.now()}`;
        
        await Task.update(
          { task_id: newTaskId },
          { where: { id: task.id } }
        );
        
        console.log(`  Updated task ${task.id}: ${taskId} → ${newTaskId}`);
      }
    }
    
    console.log('\n✅ Fixed all duplicate task IDs');
    
  } catch (error) {
    console.error('❌ Error fixing duplicate tasks:', error);
  }
}

// Run the fix
fixDuplicateTasks().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});