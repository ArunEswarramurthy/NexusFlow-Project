module.exports = (sequelize, DataTypes) => {
  const TaskComment = sequelize.define('TaskComment', {
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parent_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'task_comments',
        key: 'id'
      }
    },
    mentions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'task_comments',
    indexes: [
      { fields: ['task_id'] },
      { fields: ['user_id'] },
      { fields: ['parent_comment_id'] },
      { fields: ['created_at'] }
    ]
  });

  return TaskComment;
};