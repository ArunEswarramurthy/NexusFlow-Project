const bcrypt = require('bcryptjs');
const { Organization, User, Role } = require('./models');

async function createSampleUser() {
  try {
    console.log('🔧 Creating sample admin user...');

    // Create organization
    const organization = await Organization.create({
      name: 'Demo Organization',
      email: 'admin@demo.com',
      phone: '1234567890'
    });

    console.log('✅ Organization created:', organization.name);

    // Create Super Admin role
    const role = await Role.create({
      org_id: organization.id,
      name: 'Super Admin',
      priority: 1,
      permissions: [
        'view_dashboard', 'view_analytics', 'export_reports',
        'view_users', 'create_users', 'edit_users', 'delete_users',
        'view_all_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
        'assign_tasks', 'approve_tasks', 'reject_tasks'
      ],
      is_system: true
    });

    console.log('✅ Role created:', role.name);

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const user = await User.create({
      org_id: organization.id,
      email: 'admin@demo.com',
      first_name: 'Admin',
      last_name: 'User',
      password_hash: hashedPassword,
      role_id: role.id,
      phone: '1234567890',
      status: 'active',
      email_verified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n🎯 LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: Admin@123');
    console.log('\n🌐 Login URLs:');
    console.log('👤 User Login: http://localhost:3000/login');
    console.log('🛡️  Admin Login: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample user:', error);
    process.exit(1);
  }
}

createSampleUser();