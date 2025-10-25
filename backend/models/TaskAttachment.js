module.exports = (sequelize, DataTypes) => {
  const TaskAttachment = sequelize.define('TaskAttachment', {
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
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_deliverable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'task_attachments',
    indexes: [
      { fields: ['task_id'] },
      { fields: ['uploaded_by'] },
      { fields: ['file_type'] },
      { fields: ['is_deliverable'] },
      { fields: ['created_at'] }
    ]
  });

  return TaskAttachment;
};