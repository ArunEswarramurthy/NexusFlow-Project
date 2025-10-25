const db = require('./config/database');

async function clearDatabase() {
  try {
    await db.authenticate();
    console.log('Database connected');
    
    // Clear all tables
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('DELETE FROM otp_verifications');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM organizations');
    await db.query('DELETE FROM roles');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearDatabase();