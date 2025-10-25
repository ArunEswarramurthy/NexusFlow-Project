const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, checkPermission } = require('../middleware/auth.middleware');

// Get report data
router.get('/data', authenticateToken, (req, res) => {
  const { period = '7d' } = req.query;
  
  // Generate mock data based on period
  const data = {
    overview: {
      totalTasks: 156,
      completedTasks: 89,
      activeTasks: 45,
      overdueTasks: 12,
      completionRate: 78,
      avgCompletionTime: 3.2,
      productivityScore: 85
    },
    trends: {
      tasksCreated: [45, 52, 38, 67, 43, 58, 62],
      tasksCompleted: [38, 45, 32, 58, 41, 52, 55],
      userActivity: [89, 92, 85, 94, 88, 91, 95]
    },
    topPerformers: [
      { name: 'John Doe', completed: 45, rate: 92 },
      { name: 'Sarah Wilson', completed: 38, rate: 88 },
      { name: 'Mike Johnson', completed: 32, rate: 85 },
      { name: 'Emily Davis', completed: 28, rate: 82 }
    ],
    groupPerformance: [
      { name: 'Engineering', tasks: 85, completion: 78, members: 12 },
      { name: 'Marketing', tasks: 45, completion: 82, members: 8 },
      { name: 'Sales', tasks: 38, completion: 75, members: 10 },
      { name: 'HR', tasks: 22, completion: 88, members: 5 }
    ]
  };
  
  res.json({ success: true, data });
});

router.get('/task-completion', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    data: {
      completed: 89,
      pending: 45,
      overdue: 12,
      rate: 78
    }
  });
});

router.get('/user-performance', authenticateToken, (req, res) => {
  res.json({ 
    success: true,
    data: [
      { name: 'John Doe', tasks: 45, completion: 92 },
      { name: 'Sarah Wilson', tasks: 38, completion: 88 }
    ]
  });
});

router.get('/group-productivity', authenticateToken, (req, res) => {
  res.json({ 
    success: true,
    data: [
      { name: 'Engineering', productivity: 85 },
      { name: 'Marketing', productivity: 78 }
    ]
  });
});

module.exports = router;