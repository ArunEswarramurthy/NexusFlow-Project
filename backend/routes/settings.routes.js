const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin, checkPermission } = require('../middleware/auth.middleware');
const { User, Organization } = require('../models');
const bcrypt = require('bcrypt');

// Get user settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'preferences']
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const settings = {
      profile: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        timezone: 'UTC',
        language: 'en'
      },
      notifications: {
        email: true,
        push: false,
        taskUpdates: true,
        deadlines: true
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30
      },
      privacy: {
        profileVisibility: 'team',
        activityTracking: true,
        dataSharing: false
      },
      ...user.preferences
    };
    
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to get settings' });
  }
});

// Update user settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { profile, notifications, security, privacy } = req.body;
    
    // Update profile fields
    if (profile) {
      if (profile.firstName) user.first_name = profile.firstName;
      if (profile.lastName) user.last_name = profile.lastName;
      if (profile.phone) user.phone = profile.phone;
    }
    
    // Update preferences
    user.preferences = {
      ...user.preferences,
      notifications,
      security,
      privacy
    };
    
    await user.save();
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }
    
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

module.exports = router;