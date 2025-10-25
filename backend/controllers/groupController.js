const { Group, User, UserGroup, Organization } = require('../models');
const { Op } = require('sequelize');

// Get all groups for organization
const getGroups = async (req, res) => {
  try {
    const orgId = req.user.org_id;
    
    const groups = await Group.findAll({
      where: { org_id: orgId },
      include: [
        {
          model: User,
          as: 'groupLead',
          attributes: [
            'id',
            ['first_name', 'firstName'],
            ['last_name', 'lastName'],
            'email'
          ]
        },
        {
          model: Group,
          as: 'parentGroup',
          attributes: ['id', 'name']
        },
        {
          model: Group,
          as: 'subGroups',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });

    // Get user counts for each group
    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const userCount = await UserGroup.count({
          where: { group_id: group.id }
        });
        
        return {
          ...group.toJSON(),
          userCount: userCount || 0,
          subGroupCount: group.subGroups ? group.subGroups.length : 0
        };
      })
    );

    res.json({
      success: true,
      data: groupsWithCounts
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch groups'
    });
  }
};

// Create new group
const createGroup = async (req, res) => {
  try {
    console.log('🏗️ Creating group - User:', req.user?.userId, 'OrgId:', req.user?.org_id);
    console.log('📝 Group data:', req.body);
    console.log('👤 Full user object:', req.user);
    
    if (!req.user) {
      console.log('❌ No user object found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { name, description, parent_group_id, group_lead_id, type, icon, color } = req.body;
    const orgId = req.user.org_id || req.user.orgId;
    
    if (!orgId) {
      console.log('❌ No organization ID found in user data:', req.user);
      return res.status(400).json({
        success: false,
        message: 'Organization ID not found in user data'
      });
    }
    
    console.log('✅ Using organization ID:', orgId);

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    // Check if group name already exists in organization
    const existingGroup = await Group.findOne({
      where: { 
        name: name.trim(),
        org_id: orgId
      }
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'Group name already exists'
      });
    }

    // Validate parent group if provided
    if (parent_group_id) {
      const parentGroup = await Group.findOne({
        where: { 
          id: parent_group_id,
          org_id: orgId
        }
      });

      if (!parentGroup) {
        return res.status(400).json({
          success: false,
          message: 'Parent group not found'
        });
      }
    }

    // Validate group lead if provided
    if (group_lead_id) {
      const groupLead = await User.findOne({
        where: { 
          id: group_lead_id,
          org_id: orgId
        }
      });

      if (!groupLead) {
        return res.status(400).json({
          success: false,
          message: 'Group lead not found'
        });
      }
    }

    const group = await Group.create({
      org_id: orgId,
      name: name.trim(),
      description: description?.trim() || null,
      parent_group_id: parent_group_id || null,
      group_lead_id: group_lead_id || null,
      type: type || 'team',
      icon: icon || '👥',
      color: color || '#6B7280'
    });

    // Fetch the created group with associations
    const createdGroup = await Group.findByPk(group.id, {
      include: [
        {
          model: User,
          as: 'groupLead',
          attributes: [
            'id',
            ['first_name', 'firstName'],
            ['last_name', 'lastName'],
            'email'
          ]
        },
        {
          model: Group,
          as: 'parentGroup',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: createdGroup
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group'
    });
  }
};

// Get group by ID
const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.org_id;

    const group = await Group.findOne({
      where: { 
        id,
        org_id: orgId
      },
      include: [
        {
          model: User,
          as: 'groupLead',
          attributes: [
            'id',
            ['first_name', 'firstName'],
            ['last_name', 'lastName'],
            'email'
          ]
        },
        {
          model: Group,
          as: 'parentGroup',
          attributes: ['id', 'name']
        },
        {
          model: Group,
          as: 'subGroups',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Get users in this group
    const users = await User.findAll({
      include: [{
        model: UserGroup,
        where: { group_id: id },
        attributes: []
      }],
      attributes: [
        'id',
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
        'email'
      ]
    });

    res.json({
      success: true,
      data: {
        ...group.toJSON(),
        users
      }
    });
  } catch (error) {
    console.error('Get group by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group'
    });
  }
};

// Update group
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent_group_id, group_lead_id, type, icon, color, status } = req.body;
    const orgId = req.user.org_id;

    const group = await Group.findOne({
      where: { 
        id,
        org_id: orgId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Validate name if provided
    if (name && name.trim() !== group.name) {
      const existingGroup = await Group.findOne({
        where: { 
          name: name.trim(),
          org_id: orgId,
          id: { [Op.ne]: id }
        }
      });

      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: 'Group name already exists'
        });
      }
    }

    // Validate parent group if provided
    if (parent_group_id && parent_group_id !== group.parent_group_id) {
      if (parent_group_id == id) {
        return res.status(400).json({
          success: false,
          message: 'Group cannot be its own parent'
        });
      }

      const parentGroup = await Group.findOne({
        where: { 
          id: parent_group_id,
          org_id: orgId
        }
      });

      if (!parentGroup) {
        return res.status(400).json({
          success: false,
          message: 'Parent group not found'
        });
      }
    }

    // Update group
    await group.update({
      name: name?.trim() || group.name,
      description: description?.trim() || group.description,
      parent_group_id: parent_group_id !== undefined ? parent_group_id : group.parent_group_id,
      group_lead_id: group_lead_id !== undefined ? group_lead_id : group.group_lead_id,
      type: type || group.type,
      icon: icon || group.icon,
      color: color || group.color,
      status: status || group.status
    });

    // Fetch updated group with associations
    const updatedGroup = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: 'groupLead',
          attributes: [
            'id',
            ['first_name', 'firstName'],
            ['last_name', 'lastName'],
            'email'
          ]
        },
        {
          model: Group,
          as: 'parentGroup',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Group updated successfully',
      data: updatedGroup
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update group'
    });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.org_id;

    const group = await Group.findOne({
      where: { 
        id,
        org_id: orgId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if group has users
    const userCount = await UserGroup.count({
      where: { group_id: id }
    });

    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete group with ${userCount} users. Remove users first.`
      });
    }

    // Check if group has subgroups
    const subGroupCount = await Group.count({
      where: { parent_group_id: id }
    });

    if (subGroupCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete group with ${subGroupCount} subgroups. Remove subgroups first.`
      });
    }

    await group.destroy();

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete group'
    });
  }
};

// Add user to group
const addUserToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const orgId = req.user.org_id;

    console.log('Adding user to group:', { groupId: id, userId: user_id, orgId });

    // Validate group
    const group = await Group.findOne({
      where: { 
        id,
        org_id: orgId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Validate user
    const user = await User.findOne({
      where: { 
        id: user_id,
        org_id: orgId
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already in group
    const existingMembership = await UserGroup.findOne({
      where: { 
        user_id,
        group_id: id
      }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'User is already in this group'
      });
    }

    await UserGroup.create({
      user_id,
      group_id: id
    });

    console.log('User added to group successfully');
    res.json({
      success: true,
      message: 'User added to group successfully'
    });
  } catch (error) {
    console.error('Add user to group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add user to group'
    });
  }
};

// Remove user from group
const removeUserFromGroup = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const orgId = req.user.org_id;

    // Validate group
    const group = await Group.findOne({
      where: { 
        id,
        org_id: orgId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    const membership = await UserGroup.findOne({
      where: { 
        user_id: userId,
        group_id: id
      }
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'User is not in this group'
      });
    }

    await membership.destroy();

    res.json({
      success: true,
      message: 'User removed from group successfully'
    });
  } catch (error) {
    console.error('Remove user from group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove user from group'
    });
  }
};

module.exports = {
  getGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  addUserToGroup,
  removeUserFromGroup
};