const { ActivityLog } = require('../models');

class ActivityService {
  // Log user activity
  async log(activityData) {
    try {
      const {
        user_id,
        action,
        entity_type,
        entity_id,
        details = {},
        ip_address,
        user_agent,
        session_id,
        success = true,
        error_message
      } = activityData;

      await ActivityLog.create({
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        user_agent,
        session_id,
        success,
        error_message
      });

      console.log(`Activity logged: ${action} by user ${user_id || 'unknown'}`);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  // Log user login
  async logLogin(userId, ipAddress, userAgent, success = true, errorMessage = null) {
    await this.log({
      user_id: userId,
      action: success ? 'LOGIN' : 'LOGIN_FAILED',
      entity_type: 'session',
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      error_message: errorMessage
    });
  }

  // Log user logout
  async logLogout(userId, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'LOGOUT',
      entity_type: 'session',
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log task creation
  async logTaskCreate(userId, taskId, taskDetails, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'CREATE',
      entity_type: 'task',
      entity_id: taskId,
      details: {
        title: taskDetails.title,
        assigned_to: taskDetails.assigned_to,
        priority: taskDetails.priority,
        due_date: taskDetails.due_date
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log task assignment
  async logTaskAssign(userId, taskId, assignedTo, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'ASSIGN_TASK',
      entity_type: 'task',
      entity_id: taskId,
      details: {
        assigned_to: assignedTo
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log task status change
  async logTaskStatusChange(userId, taskId, oldStatus, newStatus, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'UPDATE',
      entity_type: 'task',
      entity_id: taskId,
      details: {
        field: 'status',
        old_value: oldStatus,
        new_value: newStatus
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log task submission
  async logTaskSubmit(userId, taskId, submissionNotes, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'SUBMIT_TASK',
      entity_type: 'task',
      entity_id: taskId,
      details: {
        submission_notes: submissionNotes
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log task approval
  async logTaskApprove(userId, taskId, approvalNotes, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'APPROVE_TASK',
      entity_type: 'task',
      entity_id: taskId,
      details: {
        approval_notes: approvalNotes
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log task rejection
  async logTaskReject(userId, taskId, rejectionReason, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'REJECT_TASK',
      entity_type: 'task',
      entity_id: taskId,
      details: {
        rejection_reason: rejectionReason
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log user creation
  async logUserCreate(adminId, newUserId, userDetails, ipAddress, userAgent) {
    await this.log({
      user_id: adminId,
      action: 'CREATE',
      entity_type: 'user',
      entity_id: newUserId,
      details: {
        email: userDetails.email,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        role_id: userDetails.role_id
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log user update
  async logUserUpdate(adminId, userId, changes, ipAddress, userAgent) {
    await this.log({
      user_id: adminId,
      action: 'UPDATE',
      entity_type: 'user',
      entity_id: userId,
      details: changes,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log user deletion
  async logUserDelete(adminId, userId, userEmail, ipAddress, userAgent) {
    await this.log({
      user_id: adminId,
      action: 'DELETE',
      entity_type: 'user',
      entity_id: userId,
      details: {
        deleted_user_email: userEmail
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log role creation
  async logRoleCreate(adminId, roleId, roleDetails, ipAddress, userAgent) {
    await this.log({
      user_id: adminId,
      action: 'CREATE',
      entity_type: 'role',
      entity_id: roleId,
      details: {
        name: roleDetails.name,
        priority: roleDetails.priority,
        permissions_count: roleDetails.permissions.length
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log group creation
  async logGroupCreate(adminId, groupId, groupDetails, ipAddress, userAgent) {
    await this.log({
      user_id: adminId,
      action: 'CREATE',
      entity_type: 'group',
      entity_id: groupId,
      details: {
        name: groupDetails.name,
        type: groupDetails.type,
        parent_group_id: groupDetails.parent_group_id
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log comment creation
  async logCommentCreate(userId, taskId, commentId, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'ADD_COMMENT',
      entity_type: 'comment',
      entity_id: commentId,
      details: {
        task_id: taskId
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log file upload
  async logFileUpload(userId, taskId, fileName, fileSize, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'UPLOAD_FILE',
      entity_type: 'attachment',
      details: {
        task_id: taskId,
        file_name: fileName,
        file_size: fileSize
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Log password reset
  async logPasswordReset(userId, ipAddress, userAgent) {
    await this.log({
      user_id: userId,
      action: 'RESET_PASSWORD',
      entity_type: 'user',
      entity_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Get user activity logs
  async getUserActivity(userId, limit = 50, offset = 0) {
    try {
      const activities = await ActivityLog.findAndCountAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      return {
        activities: activities.rows,
        total: activities.count,
        hasMore: (offset + limit) < activities.count
      };
    } catch (error) {
      console.error('Error getting user activity:', error);
      throw error;
    }
  }

  // Get system activity logs (admin only)
  async getSystemActivity(filters = {}, limit = 50, offset = 0) {
    try {
      const whereClause = {};
      
      if (filters.user_id) whereClause.user_id = filters.user_id;
      if (filters.action) whereClause.action = filters.action;
      if (filters.entity_type) whereClause.entity_type = filters.entity_type;
      if (filters.success !== undefined) whereClause.success = filters.success;
      
      if (filters.date_from || filters.date_to) {
        whereClause.created_at = {};
        if (filters.date_from) whereClause.created_at[Op.gte] = new Date(filters.date_from);
        if (filters.date_to) whereClause.created_at[Op.lte] = new Date(filters.date_to);
      }

      const activities = await ActivityLog.findAndCountAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email'],
            required: false
          }
        ]
      });

      return {
        activities: activities.rows,
        total: activities.count,
        hasMore: (offset + limit) < activities.count
      };
    } catch (error) {
      console.error('Error getting system activity:', error);
      throw error;
    }
  }
}

module.exports = new ActivityService();