const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, checkPermission } = require('../middleware/auth.middleware');
const {
  getGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  addUserToGroup,
  removeUserFromGroup
} = require('../controllers/groupController');

// Get all groups
router.get('/', authenticateToken, getGroups);

// Create new group (authentication required)
router.post('/', authenticateToken, createGroup);

// Get group by ID
router.get('/:id', authenticateToken, getGroupById);

// Update group (no permission check)
router.put('/:id', authenticateToken, updateGroup);

// Delete group (no permission check)
router.delete('/:id', authenticateToken, deleteGroup);

// Add user to group (no permission check)
router.post('/:id/users', authenticateToken, addUserToGroup);

// Remove user from group (no permission check)
router.delete('/:id/users/:userId', authenticateToken, removeUserFromGroup);

module.exports = router;