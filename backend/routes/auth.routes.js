const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later.'
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 OTP request per minute
  message: 'Please wait before requesting another OTP.'
});

// Validation rules
const registerValidation = [
  body('orgName').trim().isLength({ min: 3, max: 255 }).withMessage('Organization name must be 3-255 characters'),
  body('firstName').trim().isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
  body('lastName').trim().isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
];

const otpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/verify-otp', otpValidation, authController.verifyOTP);
router.post('/resend-otp', otpLimiter, authController.resendOTP);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/admin-login', authLimiter, loginValidation, authController.adminLogin);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;