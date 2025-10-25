const { sequelize } = require('./models');

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Force sync all models (this will recreate tables)
    await sequelize.sync({ force: true });
    
    console.log('✅ Database schema fixed successfully!');
    console.log('📝 All tables have been recreated with correct structure.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();