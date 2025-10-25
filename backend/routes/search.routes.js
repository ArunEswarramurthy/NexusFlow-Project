const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticateToken);

// Search users for chat
router.get('/users', async (req, res) => {
  try {
    const { q } = req.query;
    const orgId = req.user.org_id;
    const currentUserId = req.user.id;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const users = await User.findAll({
      where: {
        org_id: orgId,
        id: { [require('sequelize').Op.ne]: currentUserId }, // Exclude current user
        [require('sequelize').Op.or]: [
          { first_name: { [require('sequelize').Op.like]: `%${q}%` } },
          { last_name: { [require('sequelize').Op.like]: `%${q}%` } },
          { email: { [require('sequelize').Op.like]: `%${q}%` } }
        ]
      },
      attributes: ['id', 'first_name', 'last_name', 'email', 'profile_pic'],
      limit: 10
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;