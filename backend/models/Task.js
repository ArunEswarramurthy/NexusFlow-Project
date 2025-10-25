module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    org_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    task_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    priority: {
      type: DataTypes.ENUM('urgent', 'high', 'medium', 'low'),
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('to_do', 'in_progress', 'under_review', 'completed', 'rejected', 'archived'),
      defaultValue: 'to_do'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    assigned_type: {
      type: DataTypes.ENUM('user', 'group'),
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimated_hours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    actual_hours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      defaultValue: 0
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurrence_pattern: {
      type: DataTypes.JSON,
      allowNull: true
    },
    dependencies: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    submission_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approval_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submission_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    watchers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'tasks',
    indexes: [
      { fields: ['org_id'] },
      { fields: ['task_id'], unique: true },
      { fields: ['created_by'] },
      { fields: ['approver_id'] },
      { fields: ['assigned_type', 'assigned_to'] },
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['due_date'] },
      { fields: ['category'] },
      { fields: ['created_at'] }
    ]
  });

  return Task;
};