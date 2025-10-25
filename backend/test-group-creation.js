const { Group, User, Organization, Role } = require('./models');

async function testGroupCreation() {
  try {
    console.log('🧪 Testing group creation...');
    
    // Find a user to test with
    const user = await User.findOne({
      include: [{ model: Organization }, { model: Role }]
    });
    
    if (!user) {
      console.log('❌ No user found');
      return;
    }
    
    console.log('👤 Found user:', user.email, 'Org:', user.org_id);
    
    // Try to create a test group
    const group = await Group.create({
      org_id: user.org_id,
      name: 'Test Group ' + Date.now(),
      description: 'Test group creation',
      type: 'team'
    });
    
    console.log('✅ Group created successfully:', group.id, group.name);
    
    // Clean up
    await group.destroy();
    console.log('🧹 Test group deleted');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGroupCreation();