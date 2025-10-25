module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.ENUM(
        'CREATE', 'READ', 'UPDATE', 'DELETE',
        'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
        'REGISTER', 'VERIFY_EMAIL', 'RESET_PASSWORD',
        'ASSIGN_TASK', 'SUBMIT_TASK', 'APPROVE_TASK', 'REJECT_TASK',
        'ADD_COMMENT', 'UPLOAD_FILE', 'DELETE_FILE',
        'JOIN_GROUP', 'LEAVE_GROUP', 'CHANGE_ROLE',
        'SYSTEM_ACTION'
      ),
      allowNull: false
    },
    entity_type: {
      type: DataTypes.ENUM(
        'user', 'role', 'group', 'task', 'comment', 
        'attachment', 'notification', 'organization', 'session'
      ),
      allowNull: true
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'activity_logs',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['action'] },
      { fields: ['entity_type'] },
      { fields: ['entity_id'] },
      { fields: ['ip_address'] },
      { fields: ['success'] },
      { fields: ['created_at'] }
    ]
  });

  return ActivityLog;
};