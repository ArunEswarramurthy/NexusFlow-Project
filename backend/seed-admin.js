const bcrypt = require('bcrypt');
const { sequelize, Organization, User, Role } = require('./models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Find or create organization
    const [org] = await Organization.findOrCreate({
      where: { name: 'NexusFlow Organization' },
      defaults: {
        name: 'NexusFlow Organization',
        email: 'e22ec018@shanmugha.edu.in',
        phone: '732722106004',
        address: 'Default Address',
        website: 'https://nexusflow.com',
        industry: 'Technology',
        size: 'Medium',
        status: 'active',
        email_verified: true
      }
    });

    // Create roles
    const roles = [
      { name: 'Super Admin', permissions: ['*'] },
      { name: 'Admin', permissions: ['manage_users', 'create_tasks', 'view_reports'] },
      { name: 'User', permissions: ['view_tasks', 'update_tasks'] },
      { name: 'Guest', permissions: ['view_tasks'] }
    ];

    for (const roleData of roles) {
      await Role.findOrCreate({
        where: { name: roleData.name, org_id: org.id },
        defaults: {
          name: roleData.name,
          org_id: org.id,
          permissions: roleData.permissions,
          description: `${roleData.name} role`
        }
      });
    }

    // Get Super Admin role
    const superAdminRole = await Role.findOne({
      where: { name: 'Super Admin', org_id: org.id }
    });

    const adminRole = await Role.findOne({
      where: { name: 'Admin', org_id: org.id }
    });

    const userRole = await Role.findOne({
      where: { name: 'User', org_id: org.id }
    });

    // Create admin user
    const adminEmail = 'e22ec018@shanmugha.edu.in';
    const [adminUser] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        org_id: org.id,
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
        password_hash: await bcrypt.hash('E22EC018 732722106004', 10),
        role_id: superAdminRole.id,
        status: 'active',
        email_verified: true
      }
    });

    // Create sample users
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role_id: adminRole.id,
        job_title: 'Project Manager',
        department: 'Operations'
      },
      {
        email: 'sarah.wilson@example.com',
        first_name: 'Sarah',
        last_name: 'Wilson',
        role_id: userRole.id,
        job_title: 'Developer',
        department: 'Engineering'
      },
      {
        email: 'mike.johnson@example.com',
        first_name: 'Mike',
        last_name: 'Johnson',
        role_id: userRole.id,
        job_title: 'Designer',
        department: 'Design'
      }
    ];

    for (const userData of sampleUsers) {
      await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          org_id: org.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          password_hash: await bcrypt.hash('password123', 10),
          role_id: userData.role_id,
          job_title: userData.job_title,
          department: userData.department,
          status: 'active',
          email_verified: true
        }
      });
    }

    console.log('✅ Admin and sample users created successfully!');
    console.log('📧 Admin Email: e22ec018@shanmugha.edu.in');
    console.log('🔑 Admin Password: E22EC018 732722106004');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();