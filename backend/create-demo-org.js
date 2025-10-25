const bcrypt = require('bcryptjs');
const db = require('./config/database');
const { Organization, User, Role } = require('./models');

async function createDemoOrganization() {
  try {
    await db.authenticate();
    console.log('✅ Database connected');

    // Create organization
    const organization = await Organization.create({
      name: 'TechCorp Demo',
      email: 'e22ec018@shanmugha.edu.in',
      phone: '732722106004',
      status: 'active'
    });
    console.log('✅ Organization created:', organization.name);

    // Create default roles
    const roles = await createDefaultRoles(organization.id);
    console.log('✅ Default roles created');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const user = await User.create({
      org_id: organization.id,
      email: 'e22ec018@shanmugha.edu.in',
      first_name: 'Admin',
      last_name: 'User',
      password_hash: hashedPassword,
      role_id: roles.superadmin.id,
      phone: '732722106004',
      status: 'active',
      email_verified: true
    });
    console.log('✅ Admin user created');

    console.log('\n🎉 Demo organization setup complete!');
    console.log('\n📋 Login Details:');
    console.log('Email: e22ec018@shanmugha.edu.in');
    console.log('Password: Admin123!');
    console.log('Organization: TechCorp Demo');
    console.log('\n🌐 Login at: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function createDefaultRoles(orgId) {
  const defaultRoles = [
    {
      name: 'Super Admin',
      priority: 1,
      permissions: ['all'],
      is_system: true
    },
    {
      name: 'Admin', 
      priority: 2,
      permissions: ['manage_users', 'manage_tasks'],
      is_system: true
    },
    {
      name: 'User',
      priority: 3, 
      permissions: ['view_tasks'],
      is_system: true
    }
  ];

  const createdRoles = {};
  for (const roleData of defaultRoles) {
    const role = await Role.create({
      org_id: orgId,
      ...roleData
    });
    const key = roleData.name.toLowerCase().replace(/\s+/g, '');
    createdRoles[key] = role;
  }

  return createdRoles;
}

createDemoOrganization();