const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// Get dashboard stats
router.get('/stats', authenticateToken, (req, res) => {
  const stats = {
    totalUsers: 25,
    activeTasks: 45,
    completedTasks: 89,
    overdueTasks: 12,
    recentActivity: [
      { user: 'John Doe', action: 'completed authentication system', time: '2 hours ago', type: 'completed' },
      { user: 'Sarah Wilson', action: 'started homepage design', time: '4 hours ago', type: 'created' },
      { user: 'Mike Johnson', action: 'submitted bug fix for review', time: '6 hours ago', type: 'submitted' },
      { user: 'Emily Davis', action: 'updated documentation', time: '8 hours ago', type: 'commented' }
    ]
  };
  
  res.json({ success: true, data: stats });
});

module.exports = router;