const bcrypt = require('bcrypt');
const { User, Role, Organization } = require('../models');
const { Op } = require('sequelize');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    console.log('=== GET /api/users called ===');
    console.log('User org_id:', req.user.org_id);
    
    const users = await User.findAll({
      where: { org_id: req.user.org_id },
      include: [{
        model: Role,
        attributes: ['name'],
        required: false
      }],
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']]
    });

    console.log('Found users:', users.length);

    const formattedUsers = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      employeeId: user.employee_id || 'N/A',
      role: user.Role?.name || 'User',
      status: user.status || 'active',
      lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
      avatar: `${user.first_name?.[0] || 'U'}${user.last_name?.[0] || 'U'}`,
      jobTitle: user.job_title || '',
      department: user.department || '',
      phone: user.phone || '',
      groups: ['General'],
      createdAt: user.createdAt
    }));

    console.log('Returning users:', formattedUsers.length);
    res.json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users', details: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, employeeId, password, role, jobTitle, department, phone } = req.body;

    console.log('Creating user:', { firstName, lastName, email, role });

    // Validate required fields
    if (!firstName || !lastName || !email || !employeeId) {
      return res.status(400).json({ success: false, error: 'First name, last name, email, and employee ID are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { employee_id: employeeId }]
      }
    });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email or employee ID already exists' });
    }

    // Get role ID - try by name first, then create default if not found
    let roleRecord = await Role.findOne({ 
      where: { name: role || 'User', org_id: req.user.org_id } 
    });
    
    if (!roleRecord) {
      // Try to find any role for this org as fallback
      roleRecord = await Role.findOne({ 
        where: { org_id: req.user.org_id } 
      });
      
      if (!roleRecord) {
        console.log('No roles found for org:', req.user.org_id);
        return res.status(400).json({ success: false, error: 'No roles available. Please create roles first.' });
      }
    }

    // Use provided password or employee ID as default
    const userPassword = password || employeeId;
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = await User.create({
      org_id: req.user.org_id,
      email,
      first_name: firstName,
      last_name: lastName,
      employee_id: employeeId,
      password_hash: hashedPassword,
      role_id: roleRecord.id,
      job_title: jobTitle,
      department,
      phone,
      status: 'active',
      email_verified: false
    });

    console.log('User created successfully:', user.id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        employeeId: user.employee_id,
        role: role || 'User',
        status: user.status,
        avatar: `${user.first_name[0]}${user.last_name[0]}`,
        jobTitle: user.job_title || '',
        department: user.department || '',
        phone: user.phone || '',
        groups: ['General'],
        lastLogin: 'Never',
        defaultPassword: userPassword
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create user', details: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, status, jobTitle, department, phone } = req.body;
    const userId = req.params.id;

    console.log('Updating user:', userId, req.body);

    const user = await User.findOne({
      where: { id: userId, org_id: req.user.org_id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get role ID if role is being updated
    let roleId = user.role_id;
    if (role && role !== user.Role?.name) {
      const roleRecord = await Role.findOne({ 
        where: { name: role, org_id: req.user.org_id } 
      });
      if (!roleRecord) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
      roleId = roleRecord.id;
    }

    await user.update({
      first_name: firstName || user.first_name,
      last_name: lastName || user.last_name,
      email: email || user.email,
      role_id: roleId,
      status: status || user.status,
      job_title: jobTitle || user.job_title,
      department: department || user.department,
      phone: phone || user.phone
    });

    console.log('User updated successfully');
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log('Deleting user:', userId);

    const user = await User.findOne({
      where: { id: userId, org_id: req.user.org_id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check for foreign key constraints
    const { TaskAssignment, Task, TaskComment, TaskAttachment } = require('../models');
    
    const taskAssignments = await TaskAssignment.count({ where: { assigned_by: userId } });
    const createdTasks = await Task.count({ where: { created_by: userId } });
    const taskComments = await TaskComment.count({ where: { user_id: userId } });
    const taskAttachments = await TaskAttachment.count({ where: { uploaded_by: userId } });
    
    if (taskAssignments > 0 || createdTasks > 0 || taskComments > 0 || taskAttachments > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user - they have associated tasks, comments, or assignments. Please reassign or remove these first.' 
      });
    }

    await user.destroy();
    console.log('User deleted successfully');
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId, org_id: req.user.org_id },
      include: [{
        model: Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedUser = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.Role?.name || 'User',
      status: user.status,
      lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
      avatar: `${user.first_name[0]}${user.last_name[0]}`,
      jobTitle: user.job_title,
      department: user.department,
      phone: user.phone,
      createdAt: user.created_at
    };

    res.json({ user: formattedUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
};