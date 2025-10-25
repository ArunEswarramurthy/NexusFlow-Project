module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#6B7280'
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'roles',
    indexes: [
      { fields: ['org_id'] },
      { fields: ['name', 'org_id'], unique: true },
      { fields: ['priority'] },
      { fields: ['is_system'] }
    ]
  });

  return Role;
};