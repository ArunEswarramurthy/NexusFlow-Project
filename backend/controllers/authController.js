const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { 
  Organization, 
  User, 
  Role, 
  OTPVerification, 
  PasswordReset, 
  ActivityLog 
} = require('../models');
const emailService = require('../services/emailService');
const otpService = require('../services/otpService');
const activityService = require('../services/activityService');

class AuthController {
  // Register new organization
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { orgName, firstName, lastName, email, password } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Check if organization name exists
      const existingOrg = await Organization.findOne({ where: { name: orgName } });
      if (existingOrg) {
        return res.status(400).json({ error: 'Organization name already taken' });
      }

      // Generate OTP
      const otp = otpService.generateOTP();
      const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY) || 300) * 1000);

      // Store OTP
      await OTPVerification.create({
        email,
        otp_code: otp,
        expires_at: otpExpiry,
        type: 'registration'
      });

      // Send OTP email (don't fail if email fails)
      try {
        await emailService.sendOTPEmail(email, otp, firstName);
      } catch (emailError) {
        console.error('Email service error (continuing anyway):', emailError.message);
      }

      // Store registration data temporarily (in session or cache)
      req.session.registrationData = {
        orgName,
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10)
      };

      res.json({ 
        message: 'OTP sent to your email. Please verify to complete registration.',
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  // Verify OTP and complete registration
  async verifyOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, otp } = req.body;
      console.log('🔍 Verifying OTP:', { email, otp });

      // Find OTP record
      const otpRecord = await OTPVerification.findOne({
        where: { 
          email, 
          otp_code: otp, 
          is_used: false,
          type: 'registration'
        }
      });

      if (!otpRecord) {
        console.log('❌ OTP record not found');
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      console.log('✅ OTP record found:', otpRecord.id);

      // Check expiry
      if (new Date() > otpRecord.expires_at) {
        console.log('❌ OTP expired');
        return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
      }

      // Get registration data
      const regData = req.session.registrationData;
      if (!regData || regData.email !== email) {
        console.log('❌ Registration session expired or email mismatch');
        return res.status(400).json({ error: 'Registration session expired. Please start again.' });
      }

      console.log('✅ Registration data found:', regData.orgName);

      // Check if organization already exists by name or email
      let organization = await Organization.findOne({ 
        where: { 
          [Op.or]: [
            { name: regData.orgName },
            { email: regData.email }
          ]
        }
      });
      if (organization) {
        console.log('❌ Organization already exists');
        return res.status(400).json({ error: 'Organization with this name or email already exists.' });
      }

      // Create organization
      console.log('📝 Creating organization...');
      organization = await Organization.create({
        name: regData.orgName,
        email: regData.email
      });

      console.log('✅ Organization created:', organization.id);

      // Create default roles
      console.log('👥 Creating default roles...');
      const roles = await createDefaultRoles(organization.id);

      // Create admin user
      console.log('👤 Creating admin user...');
      const user = await User.create({
        org_id: organization.id,
        email: regData.email,
        first_name: regData.firstName,
        last_name: regData.lastName,
        password_hash: regData.password,
        role_id: roles.superadmin.id,
        status: 'active',
        email_verified: true
      });

      console.log('✅ User created:', user.id);

      // Mark OTP as used
      await otpRecord.update({ 
        is_used: true, 
        used_at: new Date() 
      });

      // Clear session data
      delete req.session.registrationData;

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          org_id: organization.id,
          roleId: user.role_id 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );

      console.log('✅ Registration completed successfully');

      res.json({
        message: 'Registration completed successfully!',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: 'Super Admin',
          organization: organization.name
        }
      });

    } catch (error) {
      console.error('❌ OTP verification error:', error);
      console.error('Error details:', error.message);
      res.status(500).json({ error: 'Verification failed', details: error.message });
    }
  }

  // Resend OTP
  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Invalidate old OTPs
      await OTPVerification.update(
        { is_used: true },
        { where: { email, is_used: false } }
      );

      // Generate new OTP
      const otp = otpService.generateOTP();
      const otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY) * 1000);

      await OTPVerification.create({
        email,
        otp_code: otp,
        expires_at: otpExpiry,
        type: 'registration'
      });

      // Send OTP email
      const regData = req.session.registrationData;
      const firstName = regData ? regData.firstName : 'User';
      await emailService.sendOTPEmail(email, otp, firstName);

      res.json({ message: 'New OTP sent to your email' });

    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({ error: 'Failed to resend OTP' });
    }
  }

  // User login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, rememberMe } = req.body;

      // Allow login with either email or employee ID
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { employee_id: email } // Using email field for both email and employee ID input
          ]
        },
        include: [
          { model: Organization },
          { model: Role }
        ]
      });

      if (!user) {
        try {
          await activityService.log({
            action: 'LOGIN_FAILED',
            entity_type: 'session',
            details: { email, reason: 'User not found' },
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            success: false
          });
        } catch (logError) {
          console.error('Activity logging failed:', logError.message);
        }
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.locked_until && new Date() < user.locked_until) {
        const remainingTime = Math.ceil((user.locked_until - new Date()) / 60000);
        return res.status(423).json({ 
          error: `Account locked. Try again in ${remainingTime} minutes.` 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        // Increment failed attempts
        user.failed_attempts += 1;

        // Lock account after max attempts
        if (user.failed_attempts >= parseInt(process.env.MAX_LOGIN_ATTEMPTS)) {
          user.locked_until = new Date(Date.now() + parseInt(process.env.LOCKOUT_DURATION) * 1000);
          user.failed_attempts = 0;
        }

        await user.save();

        try {
          await activityService.log({
            user_id: user.id,
            action: 'LOGIN_FAILED',
            entity_type: 'session',
            details: { reason: 'Invalid password', attempts: user.failed_attempts },
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            success: false
          });
        } catch (logError) {
          console.error('Activity logging failed:', logError.message);
        }

        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Account is not active' });
      }

      // Reset failed attempts on successful login
      user.failed_attempts = 0;
      user.locked_until = null;
      user.last_login = new Date();
      await user.save();

      // Generate JWT token
      const tokenExpiry = rememberMe ? '30d' : (process.env.JWT_EXPIRY || '24h');
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          org_id: user.org_id,
          roleId: user.role_id 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: tokenExpiry }
      );

      // Log successful login (don't fail if logging fails)
      try {
        await activityService.log({
          user_id: user.id,
          action: 'LOGIN',
          entity_type: 'session',
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        });
      } catch (logError) {
        console.error('Activity logging failed:', logError.message);
      }

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.Role.name,
          organization: user.Organization.name,
          profilePic: user.profile_pic
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  // Admin login (same as login but checks for admin role)
  async adminLogin(req, res) {
    try {
      console.log('🔐 Admin login attempt:', req.body.email);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, rememberMe } = req.body;
      console.log('📧 Looking for user:', email);

      const user = await User.findOne({
        where: { email },
        include: [
          { model: Organization },
          { model: Role }
        ]
      });

      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('✅ User found:', user.email, 'Role:', user.Role?.name);

      // Check if user has admin role
      if (!['Super Admin', 'Admin'].includes(user.Role.name)) {
        console.log('❌ Access denied - not admin role:', user.Role.name);
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      // Verify password
      console.log('🔑 Verifying password...');
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (user.status !== 'active') {
        console.log('❌ Account not active:', user.status);
        return res.status(403).json({ error: 'Account is not active' });
      }

      console.log('✅ All checks passed, generating token...');

      // Update last login
      user.last_login = new Date();
      await user.save();

      // Generate JWT token
      const tokenExpiry = rememberMe ? '30d' : (process.env.JWT_EXPIRY || '24h');
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          org_id: user.org_id,
          roleId: user.role_id 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: tokenExpiry }
      );

      console.log('✅ Admin login successful for:', user.email);

      res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.Role.name,
          organization: user.Organization.name,
          profilePic: user.profile_pic
        }
      });

    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
  }

  // Google OAuth
  async googleAuth(req, res) {
    try {
      const { googleToken } = req.body;
      
      // Verify Google token (implement Google OAuth verification)
      // This is a placeholder - implement actual Google token verification
      
      res.json({ message: 'Google authentication not implemented yet' });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      
      // Always return success message for security
      const successMessage = 'If an account with that email exists, a password reset link has been sent.';

      if (!user) {
        return res.json({ message: successMessage });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await PasswordReset.create({
        user_id: user.id,
        token: resetToken,
        expires_at: resetExpiry,
        ip_address: req.ip
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken, user.first_name);

      res.json({ message: successMessage });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
      }

      // Validate password
      if (password.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
        return res.status(400).json({ 
          error: 'Password must be 8+ chars with uppercase, lowercase, number, and special character' 
        });
      }

      const resetRecord = await PasswordReset.findOne({
        where: { 
          token, 
          is_used: false 
        },
        include: [{ model: User }]
      });

      if (!resetRecord) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      if (new Date() > resetRecord.expires_at) {
        return res.status(400).json({ error: 'Reset token has expired' });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
      await resetRecord.User.update({ password_hash: hashedPassword });

      // Mark token as used
      await resetRecord.update({ 
        is_used: true, 
        used_at: new Date() 
      });

      // Log activity (don't fail if logging fails)
      try {
        await activityService.log({
          user_id: resetRecord.User.id,
          action: 'RESET_PASSWORD',
          entity_type: 'user',
          entity_id: resetRecord.User.id,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        });
      } catch (logError) {
        console.error('Activity logging failed:', logError.message);
      }

      res.json({ message: 'Password reset successfully' });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // Log logout activity (don't fail if logging fails)
      if (req.user) {
        try {
          await activityService.log({
            user_id: req.user.userId,
            action: 'LOGOUT',
            entity_type: 'session',
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
          });
        } catch (logError) {
          console.error('Activity logging failed:', logError.message);
        }
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      // Implement refresh token logic
      res.json({ message: 'Refresh token not implemented yet' });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await User.findByPk(req.user.userId, {
        include: [
          { model: Organization },
          { model: Role }
        ],
        attributes: { exclude: ['password_hash'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          jobTitle: user.job_title,
          department: user.department,
          profilePic: user.profile_pic,
          bio: user.bio,
          skills: user.skills,
          role: user.Role.name,
          organization: user.Organization.name,
          lastLogin: user.last_login,
          emailVerified: user.email_verified
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

}

// Helper function to create default roles
async function createDefaultRoles(orgId) {
    const defaultRoles = [
      {
        name: 'Super Admin',
        priority: 1,
        permissions: [
          'view_dashboard', 'view_analytics', 'export_reports',
          'view_users', 'create_users', 'edit_users', 'delete_users', 'activate_users', 'reset_passwords', 'view_user_activity',
          'view_roles', 'create_roles', 'edit_roles', 'delete_roles', 'assign_roles',
          'view_groups', 'create_groups', 'edit_groups', 'delete_groups', 'add_group_members', 'remove_group_members',
          'view_all_tasks', 'view_own_tasks', 'view_team_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks', 'assign_tasks', 'change_task_status', 'approve_tasks', 'reject_tasks', 'comment_tasks', 'upload_attachments', 'delete_attachments',
          'upload_files', 'download_files', 'delete_files', 'view_file_history',
          'view_reports', 'create_custom_reports', 'export_reports', 'schedule_reports', 'view_performance_analytics',
          'receive_notifications', 'manage_notification_settings', 'send_announcements',
          'access_organization_settings', 'modify_system_settings', 'manage_integrations', 'access_billing', 'view_activity_logs', 'export_data',
          'manage_api_keys', 'configure_2fa_settings', 'view_security_logs', 'manage_ip_whitelist'
        ],
        is_system: true
      },
      {
        name: 'Admin',
        priority: 2,
        permissions: [
          'view_dashboard', 'view_analytics', 'export_reports',
          'view_users', 'create_users', 'edit_users', 'delete_users', 'activate_users', 'reset_passwords', 'view_user_activity',
          'view_groups', 'create_groups', 'edit_groups', 'delete_groups', 'add_group_members', 'remove_group_members',
          'view_all_tasks', 'view_own_tasks', 'view_team_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks', 'assign_tasks', 'change_task_status', 'approve_tasks', 'reject_tasks', 'comment_tasks', 'upload_attachments', 'delete_attachments',
          'upload_files', 'download_files', 'delete_files', 'view_file_history',
          'view_reports', 'create_custom_reports', 'export_reports', 'schedule_reports', 'view_performance_analytics',
          'receive_notifications', 'manage_notification_settings', 'send_announcements',
          'view_activity_logs'
        ],
        is_system: true
      },
      {
        name: 'User',
        priority: 3,
        permissions: [
          'view_own_tasks', 'view_team_tasks', 'change_task_status', 'comment_tasks', 'upload_attachments', 'download_files', 'receive_notifications'
        ],
        is_system: true
      },
      {
        name: 'Guest',
        priority: 4,
        permissions: [
          'view_own_tasks', 'download_files', 'receive_notifications'
        ],
        is_system: true
      }
    ];

    const createdRoles = {};
    for (const roleData of defaultRoles) {
      const role = await Role.create({
        org_id: orgId,
        ...roleData
      });
      const key = roleData.name.toLowerCase().replace(/\s+/g, '');
      createdRoles[key] = role;
    }

    return createdRoles;
}

module.exports = new AuthController();