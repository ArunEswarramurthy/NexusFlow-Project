module.exports = (sequelize, DataTypes) => {
  const TaskAssignment = sequelize.define('TaskAssignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    assigned_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'removed'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'task_assignments',
    indexes: [
      { fields: ['task_id'] },
      { fields: ['user_id'] },
      { fields: ['assigned_by'] },
      { fields: ['status'] },
      { fields: ['task_id', 'user_id'], unique: true }
    ]
  });

  return TaskAssignment;
};