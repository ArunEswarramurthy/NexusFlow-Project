const { Role, User, Organization } = require('../models');
const { Op } = require('sequelize');

// Permission definitions
const PERMISSIONS = {
  // User Management
  'view_users': 'View Users',
  'create_users': 'Create Users',
  'edit_users': 'Edit Users',
  'delete_users': 'Delete Users',
  'manage_user_roles': 'Manage User Roles',
  'bulk_import_users': 'Bulk Import Users',
  'export_users': 'Export Users',

  // Task Management
  'view_all_tasks': 'View All Tasks',
  'view_assigned_tasks': 'View Assigned Tasks',
  'create_tasks': 'Create Tasks',
  'edit_tasks': 'Edit Tasks',
  'delete_tasks': 'Delete Tasks',
  'assign_tasks': 'Assign Tasks',
  'approve_tasks': 'Approve Tasks',
  'manage_task_priorities': 'Manage Task Priorities',
  'manage_task_dependencies': 'Manage Task Dependencies',
  'view_task_analytics': 'View Task Analytics',
  'export_tasks': 'Export Tasks',
  'manage_recurring_tasks': 'Manage Recurring Tasks',
  'manage_task_templates': 'Manage Task Templates',

  // Role Management
  'view_roles': 'View Roles',
  'create_roles': 'Create Roles',
  'edit_roles': 'Edit Roles',
  'delete_roles': 'Delete Roles',
  'manage_permissions': 'Manage Permissions',

  // Group Management
  'view_groups': 'View Groups',
  'create_groups': 'Create Groups',
  'edit_groups': 'Edit Groups',
  'delete_groups': 'Delete Groups',
  'manage_group_hierarchy': 'Manage Group Hierarchy',
  'assign_users_to_groups': 'Assign Users to Groups',

  // Reports & Analytics
  'view_reports': 'View Reports',
  'create_reports': 'Create Reports',
  'export_reports': 'Export Reports',
  'view_analytics': 'View Analytics',
  'schedule_reports': 'Schedule Reports',

  // System Settings
  'manage_organization': 'Manage Organization',
  'manage_system_settings': 'Manage System Settings',
  'view_activity_logs': 'View Activity Logs',
  'manage_notifications': 'Manage Notifications',
  'manage_integrations': 'Manage Integrations',
  'backup_restore': 'Backup & Restore',
  'manage_security': 'Manage Security',
  'view_system_health': 'View System Health',
  'manage_email_templates': 'Manage Email Templates'
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: { org_id: req.user.org_id },
      order: [['name', 'ASC']]
    });

    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      priority: role.priority,
      description: role.description,
      permissions: role.permissions || [],
      permissionCount: (role.permissions || []).length,
      totalPermissions: Object.keys(PERMISSIONS).length,
      userCount: 0,
      color: role.color,
      isSystem: role.is_system,
      status: role.status,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }));

    res.json({
      success: true,
      roles: formattedRoles,
      totalPermissions: Object.keys(PERMISSIONS).length
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roles',
      details: error.message
    });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id, org_id: req.user.org_id },
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'last_name', 'email'],
        required: false
      }]
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    const formattedRole = {
      id: role.id,
      name: role.name,
      priority: role.priority,
      description: role.description,
      permissions: role.permissions || [],
      color: role.color,
      isSystem: role.is_system,
      status: role.status,
      users: role.Users || [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    res.json({
      success: true,
      role: formattedRole
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role',
      details: error.message
    });
  }
};

// Create role
const createRole = async (req, res) => {
  try {
    const { name, priority, description, permissions, color } = req.body;

    // Validate required fields
    if (!name || !priority) {
      return res.status(400).json({
        success: false,
        error: 'Name and priority are required'
      });
    }

    // Check if role name already exists
    const existingRole = await Role.findOne({
      where: {
        name: name.trim(),
        org_id: req.user.org_id
      }
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role with this name already exists'
      });
    }

    // Validate permissions
    const validPermissions = permissions ? permissions.filter(p => PERMISSIONS[p]) : [];

    const role = await Role.create({
      org_id: req.user.org_id,
      name: name.trim(),
      priority: parseInt(priority),
      description: description?.trim() || null,
      permissions: validPermissions,
      color: color || '#6B7280',
      is_system: false,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      role: {
        id: role.id,
        name: role.name,
        priority: role.priority,
        description: role.description,
        permissions: role.permissions,
        permissionCount: role.permissions.length,
        totalPermissions: Object.keys(PERMISSIONS).length,
        userCount: 0,
        color: role.color,
        isSystem: role.is_system,
        status: role.status
      }
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create role',
      details: error.message
    });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, priority, description, permissions, color, status } = req.body;

    const role = await Role.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    // Prevent editing system roles
    if (role.is_system) {
      return res.status(403).json({
        success: false,
        error: 'System roles cannot be modified'
      });
    }

    // Check if new name conflicts with existing roles
    if (name && name.trim() !== role.name) {
      const existingRole = await Role.findOne({
        where: {
          name: name.trim(),
          org_id: req.user.org_id,
          id: { [Op.ne]: id }
        }
      });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          error: 'Role with this name already exists'
        });
      }
    }

    // Validate permissions
    const validPermissions = permissions ? permissions.filter(p => PERMISSIONS[p]) : role.permissions;

    await role.update({
      name: name?.trim() || role.name,
      priority: priority !== undefined ? parseInt(priority) : role.priority,
      description: description !== undefined ? (description?.trim() || null) : role.description,
      permissions: validPermissions,
      color: color || role.color,
      status: status || role.status
    });

    // Get updated role with user count
    const updatedRole = await Role.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id'],
        required: false
      }]
    });

    res.json({
      success: true,
      message: 'Role updated successfully',
      role: {
        id: updatedRole.id,
        name: updatedRole.name,
        priority: updatedRole.priority,
        description: updatedRole.description,
        permissions: updatedRole.permissions,
        permissionCount: updatedRole.permissions.length,
        totalPermissions: Object.keys(PERMISSIONS).length,
        userCount: updatedRole.Users ? updatedRole.Users.length : 0,
        color: updatedRole.color,
        isSystem: updatedRole.is_system,
        status: updatedRole.status
      }
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update role',
      details: error.message
    });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id, org_id: req.user.org_id },
      include: [{
        model: User,
        attributes: ['id'],
        required: false
      }]
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    // Prevent deleting system roles
    if (role.is_system) {
      return res.status(403).json({
        success: false,
        error: 'System roles cannot be deleted'
      });
    }

    // Check if role has users assigned
    if (role.Users && role.Users.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete role. ${role.Users.length} users are assigned to this role.`
      });
    }

    await role.destroy();

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete role',
      details: error.message
    });
  }
};

// Duplicate role
const duplicateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const originalRole = await Role.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!originalRole) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    const duplicateName = name?.trim() || `${originalRole.name} (Copy)`;

    // Check if duplicate name already exists
    const existingRole = await Role.findOne({
      where: {
        name: duplicateName,
        org_id: req.user.org_id
      }
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role with this name already exists'
      });
    }

    const duplicatedRole = await Role.create({
      org_id: req.user.org_id,
      name: duplicateName,
      priority: originalRole.priority + 1,
      description: originalRole.description,
      permissions: originalRole.permissions,
      color: originalRole.color,
      is_system: false,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Role duplicated successfully',
      role: {
        id: duplicatedRole.id,
        name: duplicatedRole.name,
        priority: duplicatedRole.priority,
        description: duplicatedRole.description,
        permissions: duplicatedRole.permissions,
        permissionCount: duplicatedRole.permissions.length,
        totalPermissions: Object.keys(PERMISSIONS).length,
        userCount: 0,
        color: duplicatedRole.color,
        isSystem: duplicatedRole.is_system,
        status: duplicatedRole.status
      }
    });
  } catch (error) {
    console.error('Error duplicating role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to duplicate role',
      details: error.message
    });
  }
};

// Get all permissions
const getPermissions = async (req, res) => {
  try {
    const permissionCategories = {
      'User Management': [
        'view_users', 'create_users', 'edit_users', 'delete_users',
        'manage_user_roles', 'bulk_import_users', 'export_users'
      ],
      'Task Management': [
        'view_all_tasks', 'view_assigned_tasks', 'create_tasks', 'edit_tasks',
        'delete_tasks', 'assign_tasks', 'approve_tasks', 'manage_task_priorities',
        'manage_task_dependencies', 'view_task_analytics', 'export_tasks',
        'manage_recurring_tasks', 'manage_task_templates'
      ],
      'Role Management': [
        'view_roles', 'create_roles', 'edit_roles', 'delete_roles', 'manage_permissions'
      ],
      'Group Management': [
        'view_groups', 'create_groups', 'edit_groups', 'delete_groups',
        'manage_group_hierarchy', 'assign_users_to_groups'
      ],
      'Reports & Analytics': [
        'view_reports', 'create_reports', 'export_reports', 'view_analytics', 'schedule_reports'
      ],
      'System Settings': [
        'manage_organization', 'manage_system_settings', 'view_activity_logs',
        'manage_notifications', 'manage_integrations', 'backup_restore',
        'manage_security', 'view_system_health', 'manage_email_templates'
      ]
    };

    const formattedCategories = Object.entries(permissionCategories).map(([category, perms]) => ({
      name: category,
      permissions: perms.map(perm => ({
        key: perm,
        name: PERMISSIONS[perm],
        description: `Allow user to ${PERMISSIONS[perm].toLowerCase()}`
      })),
      count: perms.length
    }));

    res.json({
      success: true,
      categories: formattedCategories,
      totalPermissions: Object.keys(PERMISSIONS).length
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch permissions',
      details: error.message
    });
  }
};

// Get role statistics
const getRoleStats = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: { org_id: req.user.org_id },
      include: [{
        model: User,
        attributes: ['id'],
        required: false
      }]
    });

    const stats = {
      totalRoles: roles.length,
      systemRoles: roles.filter(r => r.is_system).length,
      customRoles: roles.filter(r => !r.is_system).length,
      activeRoles: roles.filter(r => r.status === 'active').length,
      inactiveRoles: roles.filter(r => r.status === 'inactive').length,
      rolesWithUsers: roles.filter(r => r.Users && r.Users.length > 0).length,
      emptyRoles: roles.filter(r => !r.Users || r.Users.length === 0).length,
      averagePermissions: roles.length > 0 
        ? Math.round(roles.reduce((sum, r) => sum + (r.permissions || []).length, 0) / roles.length)
        : 0,
      totalUsers: roles.reduce((sum, r) => sum + (r.Users ? r.Users.length : 0), 0)
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching role stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role statistics',
      details: error.message
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  duplicateRole,
  getPermissions,
  getRoleStats,
  PERMISSIONS
};