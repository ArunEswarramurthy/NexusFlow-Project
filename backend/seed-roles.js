const { Role, Organization } = require('./models');
const { PERMISSIONS } = require('./controllers/roleController');

const seedRoles = async () => {
  try {
    console.log('🌱 Seeding default roles...');

    // Get all organizations
    const organizations = await Organization.findAll();
    
    if (organizations.length === 0) {
      console.log('❌ No organizations found. Please create an organization first.');
      return;
    }

    for (const org of organizations) {
      console.log(`\n📋 Seeding roles for organization: ${org.name}`);

      // Define default roles with their permissions
      const defaultRoles = [
        {
          name: 'Super Admin',
          priority: 1,
          description: 'Full system access with all permissions',
          permissions: Object.keys(PERMISSIONS), // All permissions
          color: '#8B5CF6',
          is_system: true
        },
        {
          name: 'Admin',
          priority: 2,
          description: 'Administrative access with most permissions',
          permissions: [
            // User Management
            'view_users', 'create_users', 'edit_users', 'delete_users', 'manage_user_roles', 'bulk_import_users', 'export_users',
            // Task Management
            'view_all_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks', 'assign_tasks', 'approve_tasks', 
            'manage_task_priorities', 'manage_task_dependencies', 'view_task_analytics', 'export_tasks',
            'manage_recurring_tasks', 'manage_task_templates',
            // Group Management
            'view_groups', 'create_groups', 'edit_groups', 'delete_groups', 'manage_group_hierarchy', 'assign_users_to_groups',
            // Reports & Analytics
            'view_reports', 'create_reports', 'export_reports', 'view_analytics', 'schedule_reports',
            // Limited System Settings
            'view_activity_logs', 'manage_notifications'
          ],
          color: '#3B82F6',
          is_system: true
        },
        {
          name: 'Manager',
          priority: 3,
          description: 'Team management with task and user oversight',
          permissions: [
            // User Management (limited)
            'view_users', 'create_users', 'edit_users',
            // Task Management
            'view_all_tasks', 'create_tasks', 'edit_tasks', 'assign_tasks', 'approve_tasks',
            'manage_task_priorities', 'view_task_analytics', 'export_tasks',
            // Group Management (limited)
            'view_groups', 'assign_users_to_groups',
            // Reports & Analytics
            'view_reports', 'view_analytics'
          ],
          color: '#10B981',
          is_system: true
        },
        {
          name: 'User',
          priority: 4,
          description: 'Standard user with basic task management',
          permissions: [
            // Task Management (limited)
            'view_assigned_tasks', 'edit_tasks',
            // Basic viewing
            'view_users', 'view_groups'
          ],
          color: '#6366F1',
          is_system: true
        },
        {
          name: 'Guest',
          priority: 5,
          description: 'Read-only access to assigned content',
          permissions: [
            // Very limited access
            'view_assigned_tasks'
          ],
          color: '#6B7280',
          is_system: true
        }
      ];

      // Create or update roles
      for (const roleData of defaultRoles) {
        const [role, created] = await Role.findOrCreate({
          where: {
            name: roleData.name,
            org_id: org.id
          },
          defaults: {
            ...roleData,
            org_id: org.id
          }
        });

        if (created) {
          console.log(`✅ Created role: ${roleData.name} (${roleData.permissions.length} permissions)`);
        } else {
          // Update existing role with new permissions if it's a system role
          if (role.is_system) {
            await role.update({
              permissions: roleData.permissions,
              description: roleData.description,
              color: roleData.color,
              priority: roleData.priority
            });
            console.log(`🔄 Updated system role: ${roleData.name} (${roleData.permissions.length} permissions)`);
          } else {
            console.log(`⏭️  Skipped custom role: ${roleData.name}`);
          }
        }
      }
    }

    console.log('\n✅ Role seeding completed successfully!');
    console.log(`📊 Total permissions available: ${Object.keys(PERMISSIONS).length}`);
    
    // Display permission breakdown
    console.log('\n📋 Permission Categories:');
    const categories = {
      'User Management': Object.keys(PERMISSIONS).filter(p => p.includes('user')).length,
      'Task Management': Object.keys(PERMISSIONS).filter(p => p.includes('task')).length,
      'Role Management': Object.keys(PERMISSIONS).filter(p => p.includes('role')).length,
      'Group Management': Object.keys(PERMISSIONS).filter(p => p.includes('group')).length,
      'Reports & Analytics': Object.keys(PERMISSIONS).filter(p => p.includes('report') || p.includes('analytic')).length,
      'System Settings': Object.keys(PERMISSIONS).filter(p => p.includes('manage_') && !p.includes('user') && !p.includes('task') && !p.includes('role') && !p.includes('group')).length
    };
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  • ${category}: ${count} permissions`);
    });

  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedRoles()
    .then(() => {
      console.log('🎉 Role seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Role seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedRoles;