const jwt = require('jsonwebtoken');
const { User, Role, Organization } = require('../models');

// Cache for user data to reduce database queries
const userCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    console.log('🔐 Authenticating user:', userId);
    
    // Check cache first
    const cached = userCache.get(userId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('✅ Using cached user data');
      req.user = cached.user;
      return next();
    }
    
    // Get user details from database
    const user = await User.findByPk(userId, {
      include: [
        { model: Role },
        { model: Organization }
      ]
    });

    if (!user) {
      console.log('❌ User not found:', userId);
      userCache.delete(userId);
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    console.log('👤 User found:', {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.Role?.name,
      org: user.Organization?.name
    });

    // Check user status - be more lenient with status check
    const userStatus = user.status;
    if (userStatus && userStatus !== 'active') {
      console.log('❌ User status check failed:', { userId, status: userStatus });
      return res.status(403).json({ 
        error: 'Account is not active', 
        status: userStatus,
        message: `Account status: ${userStatus}. Please contact administrator.`
      });
    }

    // Ensure we have required associations
    if (!user.Role) {
      console.log('❌ User role not found');
      return res.status(403).json({ error: 'User role not found' });
    }

    if (!user.Organization) {
      console.log('❌ User organization not found');
      return res.status(403).json({ error: 'User organization not found' });
    }

    const userData = {
      id: user.id,
      userId: user.id,
      email: user.email,
      org_id: user.org_id,
      orgId: user.org_id,
      roleId: user.role_id,
      roleName: user.Role.name,
      permissions: user.Role.permissions || [],
      organization: user.Organization.name,
      status: userStatus || 'active'
    };

    console.log('✅ User authenticated successfully:', userData.email);

    // Cache the user data
    userCache.set(userId, {
      user: userData,
      timestamp: Date.now()
    });

    req.user = userData;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};

// Check if user has specific permission
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        error: 'You don\'t have permission to perform this action',
        required: requiredPermission
      });
    }

    next();
  };
};

// Check if user has admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!['Super Admin', 'Admin'].includes(req.user.roleName)) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  next();
};

// Check if user has super admin role
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.roleName !== 'Super Admin') {
    return res.status(403).json({ error: 'Super Admin privileges required' });
  }

  next();
};

// Check if user belongs to same organization
const checkOrganization = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // This middleware ensures users can only access data from their organization
  // The actual organization check is done in the controllers
  next();
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId, {
        include: [{ model: Role }, { model: Organization }]
      });

      if (user && user.status === 'active') {
        req.user = {
          userId: user.id,
          email: user.email,
          orgId: user.org_id,
          roleId: user.role_id,
          roleName: user.Role.name,
          permissions: user.Role.permissions,
          organization: user.Organization.name
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  checkPermission,
  requireAdmin,
  requireSuperAdmin,
  checkOrganization,
  optionalAuth
};