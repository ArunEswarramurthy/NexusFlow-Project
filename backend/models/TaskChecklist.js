module.exports = (sequelize, DataTypes) => {
  const TaskChecklist = sequelize.define('TaskChecklist', {
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
    item_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'task_checklist',
    indexes: [
      { fields: ['task_id'] },
      { fields: ['is_completed'] },
      { fields: ['order_index'] },
      { fields: ['completed_by'] }
    ]
  });

  return TaskChecklist;
};