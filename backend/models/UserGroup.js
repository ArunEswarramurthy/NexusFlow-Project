module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
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
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role_in_group: {
      type: DataTypes.ENUM('member', 'lead', 'admin'),
      defaultValue: 'member'
    }
  }, {
    tableName: 'user_groups',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['group_id'] },
      { fields: ['user_id', 'group_id'], unique: true },
      { fields: ['is_primary'] },
      { fields: ['role_in_group'] }
    ]
  });

  return UserGroup;
};