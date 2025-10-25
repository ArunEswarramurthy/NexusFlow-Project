const { sequelize } = require('./models');

async function createGroupsTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`groups\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        org_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        parent_group_id INT NULL,
        group_lead_id INT NULL,
        type ENUM('department', 'team', 'project', 'custom') DEFAULT 'team',
        description TEXT NULL,
        icon VARCHAR(50) DEFAULT '👥',
        color VARCHAR(7) DEFAULT '#6B7280',
        settings JSON NULL,
        status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_org_id (org_id),
        INDEX idx_parent_group_id (parent_group_id),
        INDEX idx_group_lead_id (group_lead_id),
        INDEX idx_name_org (name, org_id),
        INDEX idx_type (type),
        INDEX idx_status (status),
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_group_id) REFERENCES \`groups\`(id) ON DELETE SET NULL,
        FOREIGN KEY (group_lead_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        group_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_group (user_id, group_id),
        INDEX idx_user_id (user_id),
        INDEX idx_group_id (group_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Groups tables created successfully');
  } catch (error) {
    console.error('❌ Error creating groups tables:', error);
  }
}

if (require.main === module) {
  createGroupsTable().then(() => process.exit(0));
}

module.exports = createGroupsTable;