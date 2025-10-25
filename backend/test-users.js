const { sequelize, User, Role, Organization } = require('./models');

async function testUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check organizations
    const orgs = await Organization.findAll();
    console.log(`📊 Organizations: ${orgs.length}`);

    // Check roles
    const roles = await Role.findAll();
    console.log(`🔐 Roles: ${roles.length}`);
    roles.forEach(role => {
      console.log(`  - ${role.name} (ID: ${role.id}, Org: ${role.org_id})`);
    });

    // Check users
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['name'] }]
    });
    console.log(`👥 Users: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.Role?.name || 'No Role'} - ${user.status}`);
    });

    console.log('\n✅ Database test completed');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testUsers();