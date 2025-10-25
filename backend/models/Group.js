module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
    parent_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    group_lead_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('department', 'team', 'project', 'custom'),
      defaultValue: 'team'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '👥'
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#6B7280'
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'groups',
    indexes: [
      { fields: ['org_id'] },
      { fields: ['parent_group_id'] },
      { fields: ['group_lead_id'] },
      { fields: ['name', 'org_id'] },
      { fields: ['type'] },
      { fields: ['status'] }
    ]
  });

  return Group;
};