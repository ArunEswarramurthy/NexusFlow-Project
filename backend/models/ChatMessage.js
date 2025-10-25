module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('text', 'file', 'image', 'system'),
      defaultValue: 'text'
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reply_to: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ChatMessage;
};