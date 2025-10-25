const { Task } = require('../models');

/**
 * Generate a unique task ID for an organization
 * @param {number} orgId - Organization ID
 * @returns {Promise<string>} - Unique task ID
 */
async function generateUniqueTaskId(orgId) {
  const maxAttempts = 10;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      // Get current count for this organization
      const taskCount = await Task.count({ where: { org_id: orgId } });
      
      // Generate ID components
      const sequence = String(taskCount + 1).padStart(3, '0');
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      // Create task ID
      const taskId = `TASK-${sequence}-${timestamp}-${random}`;
      
      // Check if it already exists
      const existingTask = await Task.findOne({
        where: { task_id: taskId, org_id: orgId }
      });
      
      if (!existingTask) {
        return taskId;
      }
      
      attempts++;
      
      // Small delay before retry
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
    } catch (error) {
      console.error('Error generating task ID:', error);
      attempts++;
    }
  }
  
  // Fallback to UUID-like ID if all attempts fail
  const fallbackId = `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  console.warn(`Using fallback task ID: ${fallbackId}`);
  return fallbackId;
}

module.exports = {
  generateUniqueTaskId
};