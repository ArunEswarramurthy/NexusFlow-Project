const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, checkPermission } = require('../middleware/auth.middleware');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} = require('../controllers/userController');

// Get all users
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// Create user
router.post('/', authenticateToken, requireAdmin, createUser);

// Get user by ID
router.get('/:id', authenticateToken, getUserById);

// Update user
router.put('/:id', authenticateToken, requireAdmin, updateUser);

// Delete user
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;