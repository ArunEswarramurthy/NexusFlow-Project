const express = require('express');
const router = express.Router();
const { authenticateToken, checkPermission } = require('../middleware/auth.middleware');
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  submitTask,
  approveTask,
  rejectTask,
  assignTask,
  startTask,
  downloadAttachment,
  upload
} = require('../controllers/taskController');

// Get all tasks
router.get('/', authenticateToken, getAllTasks);

// Create task with file upload
router.post('/', authenticateToken, upload.array('attachments', 5), createTask);

// Get task by ID
router.get('/:id', authenticateToken, getTaskById);

// Update task
router.put('/:id', authenticateToken, updateTask);

// Delete task
router.delete('/:id', authenticateToken, deleteTask);

// Assign task to users
router.post('/:id/assign', authenticateToken, assignTask);

// Start task
router.post('/:id/start', authenticateToken, startTask);

// Submit task for review
router.post('/:id/submit', authenticateToken, submitTask);

// Approve task
router.post('/:id/approve', authenticateToken, approveTask);

// Reject task (send back for rework)
router.post('/:id/reject', authenticateToken, rejectTask);

// Download attachment
router.get('/:taskId/attachments/:attachmentId/download', authenticateToken, downloadAttachment);

module.exports = router;