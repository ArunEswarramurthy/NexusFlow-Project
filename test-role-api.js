const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test credentials (use your actual admin credentials)
const TEST_CREDENTIALS = {
  email: 'e22ec018@shanmugha.edu.in',
  password: 'E22EC018 732722106004'
};

let authToken = '';

const testRoleAPI = async () => {
  try {
    console.log('🧪 Testing Role Management API...\n');

    // 1. Login to get auth token
    console.log('1. 🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/admin-login`, TEST_CREDENTIALS);
    authToken = loginResponse.data.token;
    console.log('✅ Login successful\n');

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    // 2. Get all roles
    console.log('2. 📋 Fetching all roles...');
    const rolesResponse = await axios.get(`${API_BASE}/roles`, { headers });
    console.log(`✅ Found ${rolesResponse.data.roles.length} roles:`);
    rolesResponse.data.roles.forEach(role => {
      console.log(`   • ${role.name} (${role.permissionCount}/${role.totalPermissions} permissions, ${role.userCount} users)`);
    });
    console.log('');

    // 3. Get role statistics
    console.log('3. 📊 Fetching role statistics...');
    const statsResponse = await axios.get(`${API_BASE}/roles/stats`, { headers });
    console.log('✅ Role Statistics:');
    const stats = statsResponse.data.stats;
    console.log(`   • Total Roles: ${stats.totalRoles}`);
    console.log(`   • System Roles: ${stats.systemRoles}`);
    console.log(`   • Custom Roles: ${stats.customRoles}`);
    console.log(`   • Active Roles: ${stats.activeRoles}`);
    console.log(`   • Roles with Users: ${stats.rolesWithUsers}`);
    console.log(`   • Average Permissions: ${stats.averagePermissions}`);
    console.log('');

    // 4. Get permissions
    console.log('4. 🔑 Fetching permissions...');
    const permissionsResponse = await axios.get(`${API_BASE}/roles/permissions`, { headers });
    console.log(`✅ Found ${permissionsResponse.data.categories.length} permission categories:`);
    permissionsResponse.data.categories.forEach(category => {
      console.log(`   • ${category.name}: ${category.count} permissions`);
    });
    console.log('');

    // 5. Create a test role
    console.log('5. ➕ Creating a test role...');
    const newRole = {
      name: 'Test Role',
      priority: 10,
      description: 'A test role created by API test',
      permissions: ['view_users', 'view_tasks', 'view_groups'],
      color: '#8B5CF6'
    };
    
    const createResponse = await axios.post(`${API_BASE}/roles`, newRole, { headers });
    const createdRole = createResponse.data.role;
    console.log(`✅ Created role: ${createdRole.name} (ID: ${createdRole.id})`);
    console.log('');

    // 6. Get the created role
    console.log('6. 🔍 Fetching created role...');
    const roleResponse = await axios.get(`${API_BASE}/roles/${createdRole.id}`, { headers });
    console.log(`✅ Retrieved role: ${roleResponse.data.role.name}`);
    console.log(`   • Permissions: ${roleResponse.data.role.permissions.length}`);
    console.log(`   • Status: ${roleResponse.data.role.status}`);
    console.log('');

    // 7. Update the role
    console.log('7. ✏️ Updating the role...');
    const updateData = {
      name: 'Updated Test Role',
      description: 'Updated description',
      permissions: ['view_users', 'view_tasks', 'view_groups', 'create_tasks']
    };
    
    const updateResponse = await axios.put(`${API_BASE}/roles/${createdRole.id}`, updateData, { headers });
    console.log(`✅ Updated role: ${updateResponse.data.role.name}`);
    console.log(`   • New permission count: ${updateResponse.data.role.permissionCount}`);
    console.log('');

    // 8. Duplicate the role
    console.log('8. 📋 Duplicating the role...');
    const duplicateResponse = await axios.post(`${API_BASE}/roles/${createdRole.id}/duplicate`, 
      { name: 'Duplicated Test Role' }, { headers });
    const duplicatedRole = duplicateResponse.data.role;
    console.log(`✅ Duplicated role: ${duplicatedRole.name} (ID: ${duplicatedRole.id})`);
    console.log('');

    // 9. Delete the roles
    console.log('9. 🗑️ Cleaning up test roles...');
    await axios.delete(`${API_BASE}/roles/${createdRole.id}`, { headers });
    console.log(`✅ Deleted role: ${createdRole.id}`);
    
    await axios.delete(`${API_BASE}/roles/${duplicatedRole.id}`, { headers });
    console.log(`✅ Deleted role: ${duplicatedRole.id}`);
    console.log('');

    console.log('🎉 All Role Management API tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
  }
};

// Run the test
testRoleAPI();