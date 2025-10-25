const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  // Send OTP email
  async sendOTPEmail(email, otp, firstName) {
    // Always log OTP for development
    console.log(`\n🔐 [OTP CODE] ${email}: ${otp}\n`);
    console.log(`Use this OTP to complete registration: ${otp}`);
    
    // Send actual email for test address
    if (email === 'e22ec018@shanmugha.edu.in') {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: 'NexusFlow - Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4F46E5, #06B6D4); color: white; padding: 30px; text-align: center; border-radius: 10px;">
              <h1>🚀 NexusFlow</h1>
              <p>Your verification code</p>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2>Hi ${firstName || 'User'},</h2>
              <p>Your OTP verification code is:</p>
              <div style="background: #4F46E5; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 10px; letter-spacing: 5px;">
                ${otp}
              </div>
              <p><strong>This code will expire in 5 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          </div>
        `
      };
      
      try {
        await this.transporter.sendMail(mailOptions);
        console.log(`📧 OTP email sent to ${email}`);
      } catch (error) {
        console.error('Error sending OTP email:', error);
        // Don't throw error, just log it
      }
    }
    
    return Promise.resolve();
  }

  // Send welcome email to new user
  async sendWelcomeEmail(email, firstName, tempPassword, organizationName, adminName) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n📧 [DEV MODE] Welcome email for ${email} - Temp Password: ${tempPassword}\n`);
      return Promise.resolve();
    }
    
    const loginUrl = `${process.env.FRONTEND_URL}/login`;
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `Welcome to NexusFlow - ${organizationName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #06B6D4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: #e5e7eb; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Welcome to NexusFlow!</h1>
              <p>${organizationName}</p>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Welcome to ${organizationName}'s NexusFlow workspace!</p>
              
              <p>Your account has been created. Here are your login details:</p>
              
              <div class="credentials">
                <h3>🔐 LOGIN CREDENTIALS</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> <code>${tempPassword}</code></p>
              </div>
              
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login Now</a>
              </div>
              
              <p><strong>⚠️ IMPORTANT:</strong> Please change your password after your first login.</p>
              
              <p>If you have any questions, contact your administrator.</p>
              
              <div class="footer">
                <p>Best regards,<br>${adminName}<br>${organizationName}</p>
                <p><small>This email was sent by NexusFlow</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Send task assigned email
  async sendTaskAssignedEmail(email, firstName, task, assignedBy) {
    const taskUrl = `${process.env.FRONTEND_URL}/tasks/${task.id}`;
    
    const priorityColors = {
      urgent: '#EF4444',
      high: '#F97316',
      medium: '#F59E0B',
      low: '#22C55E'
    };

    const priorityEmojis = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `New Task Assigned: ${task.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #06B6D4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid ${priorityColors[task.priority]}; }
            .priority { color: ${priorityColors[task.priority]}; font-weight: bold; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Task Assigned</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>You have been assigned a new task by ${assignedBy}.</p>
              
              <div class="task-details">
                <h3>TASK DETAILS</h3>
                <p><strong>Task ID:</strong> ${task.task_id}</p>
                <p><strong>Title:</strong> ${task.title}</p>
                <p><strong>Priority:</strong> <span class="priority">${priorityEmojis[task.priority]} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></p>
                <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
                ${task.category ? `<p><strong>Category:</strong> ${task.category}</p>` : ''}
                
                <h4>Description:</h4>
                <p>${task.description}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task Details</a>
                <a href="${taskUrl}" class="button" style="background: #10B981;">Start Task</a>
              </div>
              
              <p>Need help? Contact your manager or reply to this email.</p>
              
              <div class="footer">
                <p>Best regards,<br>NexusFlow Team</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Task assigned email sent to ${email}`);
    } catch (error) {
      console.error('Error sending task assigned email:', error);
      throw error;
    }
  }

  // Send task approved email
  async sendTaskApprovedEmail(email, firstName, task, approvedBy, approvalNotes) {
    const taskUrl = `${process.env.FRONTEND_URL}/tasks/${task.id}`;
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `Task Approved: ${task.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22C55E, #10B981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #22C55E; }
            .button { display: inline-block; background: #22C55E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Task Approved!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Congratulations! Your task has been approved by ${approvedBy}.</p>
              
              <div class="task-details">
                <h3>TASK DETAILS</h3>
                <p><strong>Task ID:</strong> ${task.task_id}</p>
                <p><strong>Title:</strong> ${task.title}</p>
                <p><strong>Status:</strong> ✅ Approved</p>
                <p><strong>Completed Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                ${approvalNotes ? `<h4>Approval Notes:</h4><p>${approvalNotes}</p>` : ''}
              </div>
              
              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task</a>
              </div>
              
              <p>Great work! Keep up the excellent performance.</p>
              
              <div class="footer">
                <p>Best regards,<br>NexusFlow Team</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Task approved email sent to ${email}`);
    } catch (error) {
      console.error('Error sending task approved email:', error);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, firstName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'NexusFlow - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F59E0B, #F97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>You requested to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this reset, please ignore this email.</p>
              
              <div class="footer">
                <p>Best regards,<br>NexusFlow Team</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();