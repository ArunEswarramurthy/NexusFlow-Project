const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, checkPermission } = require('../middleware/auth.middleware');
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  duplicateRole,
  getPermissions,
  getRoleStats
} = require('../controllers/roleController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Roles API is working' });
});

// Get all roles
router.get('/', authenticateToken, getAllRoles);

// Get role statistics
router.get('/stats', authenticateToken, getRoleStats);

// Get all permissions
router.get('/permissions', authenticateToken, getPermissions);

// Get role by ID
router.get('/:id', authenticateToken, getRoleById);

// Create role
router.post('/', authenticateToken, createRole);

// Duplicate role
router.post('/:id/duplicate', authenticateToken, duplicateRole);

// Update role
router.put('/:id', authenticateToken, updateRole);

// Delete role
router.delete('/:id', authenticateToken, deleteRole);

module.exports = router;