const crypto = require('crypto');

class OTPService {
  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate secure random token
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Validate OTP format
  validateOTPFormat(otp) {
    return /^\d{6}$/.test(otp);
  }

  // Check if OTP is expired
  isExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }

  // Generate OTP expiry time (default 5 minutes)
  getExpiryTime(minutes = 5) {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  // Generate temporary password
  generateTempPassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '@#$%&*'[Math.floor(Math.random() * 6)]; // Special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Mask email for display
  maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 2)}***@${domain}`;
  }

  // Generate task ID
  generateTaskId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `#${timestamp}${random}`;
  }
}

module.exports = new OTPService();