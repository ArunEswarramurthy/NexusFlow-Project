const { Organization, OTPVerification } = require('./models');

async function clearData() {
  try {
    console.log('🗑️ Clearing OTP and Organization data...');
    
    await OTPVerification.destroy({ where: {} });
    console.log('✅ OTP data cleared');
    
    await Organization.destroy({ where: {} });
    console.log('✅ Organization data cleared');
    
    console.log('✅ Data cleared successfully - you can now register again');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearData();