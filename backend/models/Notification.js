module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM(
        'task_assigned',
        'task_status_changed',
        'task_due_soon',
        'task_overdue',
        'task_submitted',
        'task_approved',
        'task_rejected',
        'task_reassigned',
        'comment_added',
        'comment_mention',
        'comment_reply',
        'user_added',
        'role_changed',
        'group_added',
        'system_announcement',
        'maintenance_notice'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tasks',
        key: 'id'
      }
    },
    related_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['type'] },
      { fields: ['task_id'] },
      { fields: ['is_read'] },
      { fields: ['priority'] },
      { fields: ['created_at'] },
      { fields: ['expires_at'] }
    ]
  });

  return Notification;
};