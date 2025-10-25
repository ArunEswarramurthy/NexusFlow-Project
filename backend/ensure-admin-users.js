const bcrypt = require('bcrypt');
const { sequelize, Organization, User, Role } = require('./models');

async function ensureAdminUsers() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Find the organization
    const org = await Organization.findOne();
    if (!org) {
      console.log('No organization found. Please run the setup first.');
      return;
    }

    // Ensure roles exist
    const roles = [
      { name: 'Super Admin', permissions: ['*'] },
      { name: 'Admin', permissions: ['manage_users', 'create_tasks', 'view_reports'] },
      { name: 'User', permissions: ['view_tasks', 'update_tasks'] },
      { name: 'Guest', permissions: ['view_tasks'] }
    ];

    for (const roleData of roles) {
      const [role] = await Role.findOrCreate({
        where: { name: roleData.name, org_id: org.id },
        defaults: {
          name: roleData.name,
          org_id: org.id,
          permissions: roleData.permissions,
          description: `${roleData.name} role`
        }
      });
      console.log(`Role ${roleData.name} ensured.`);
    }

    // Get Super Admin role
    const superAdminRole = await Role.findOne({
      where: { name: 'Super Admin', org_id: org.id }
    });

    // Create default admin user if not exists
    const adminEmail = 'e22ec018@shanmugha.edu.in';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('E22EC018 732722106004', 10);
      
      await User.create({
        org_id: org.id,
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
        password_hash: hashedPassword,
        role_id: superAdminRole.id,
        status: 'active',
        email_verified: true
      });
      
      console.log('Default admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // Create some sample users for testing
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Admin'
      },
      {
        email: 'sarah.wilson@example.com',
        first_name: 'Sarah',
        last_name: 'Wilson',
        role: 'User'
      },
      {
        email: 'mike.johnson@example.com',
        first_name: 'Mike',
        last_name: 'Johnson',
        role: 'User'
      }
    ];

    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const role = await Role.findOne({
          where: { name: userData.role, org_id: org.id }
        });
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await User.create({
          org_id: org.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          password_hash: hashedPassword,
          role_id: role.id,
          status: 'active',
          email_verified: true
        });
        
        console.log(`Sample user ${userData.first_name} ${userData.last_name} created.`);
      }
    }

    console.log('Admin users setup completed successfully!');
  } catch (error) {
    console.error('Error setting up admin users:', error);
  } finally {
    await sequelize.close();
  }
}

ensureAdminUsers();