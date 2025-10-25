const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const groupRoutes = require('./routes/group.routes');
const taskRoutes = require('./routes/task.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const activityRoutes = require('./routes/activity.routes');
const settingsRoutes = require('./routes/settings.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting with proper configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Very high limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_EXPIRY)
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/uploads', express.static('uploads'));

// Socket.IO for real-time notifications and chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('join-chat-room', (roomId) => {
    socket.join(`chat-${roomId}`);
  });
  
  socket.on('leave-chat-room', (roomId) => {
    socket.leave(`chat-${roomId}`);
  });
  
  socket.on('typing', (data) => {
    socket.to(`chat-${data.roomId}`).emit('user-typing', {
      userId: data.userId,
      userName: data.userName,
      isTyping: data.isTyping
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', require('./routes/search.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug auth routes
app.get('/api/debug/routes', (req, res) => {
  res.json({ 
    message: 'Auth routes loaded',
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/verify-otp',
      'POST /api/auth/login'
    ]
  });
});

// Debug endpoint to check tasks directly
app.get('/api/debug/tasks', async (req, res) => {
  try {
    const { Task } = require('./models');
    const tasks = await Task.findAll({
      raw: true,
      order: [['created_at', 'DESC']]
    });
    res.json({ count: tasks.length, tasks });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Create sample tasks for testing
app.post('/api/debug/create-sample-tasks', async (req, res) => {
  try {
    const { Task, User, Organization } = require('./models');
    
    // Get first organization and user
    const org = await Organization.findOne();
    const user = await User.findOne({ where: { org_id: org.id } });
    
    if (!org || !user) {
      return res.json({ error: 'No organization or user found' });
    }
    
    const sampleTasks = [
      {
        org_id: org.id,
        title: 'Setup Development Environment',
        description: 'Configure local development environment with all necessary tools and dependencies.',
        task_id: `TASK-${Date.now()}1`,
        priority: 'high',
        status: 'to_do',
        created_by: user.id,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 0
      },
      {
        org_id: org.id,
        title: 'Design User Interface',
        description: 'Create wireframes and mockups for the main dashboard and user management pages.',
        task_id: `TASK-${Date.now()}2`,
        priority: 'medium',
        status: 'in_progress',
        created_by: user.id,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        progress: 45
      },
      {
        org_id: org.id,
        title: 'Implement Authentication',
        description: 'Build secure login and registration system with JWT tokens and role-based access.',
        task_id: `TASK-${Date.now()}3`,
        priority: 'urgent',
        status: 'under_review',
        created_by: user.id,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        progress: 90
      },
      {
        org_id: org.id,
        title: 'Write Documentation',
        description: 'Create comprehensive API documentation and user guides.',
        task_id: `TASK-${Date.now()}4`,
        priority: 'low',
        status: 'completed',
        created_by: user.id,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        progress: 100
      }
    ];
    
    const createdTasks = await Task.bulkCreate(sampleTasks);
    res.json({ success: true, message: 'Sample tasks created', count: createdTasks.length });
  } catch (error) {
    res.json({ error: error.message, stack: error.stack });
  }
});

// Debug endpoint to check database connection and tables
app.get('/api/debug/db', async (req, res) => {
  try {
    const { Organization, User, Role, OTPVerification } = require('./models');
    
    // Test database connection
    await db.authenticate();
    
    // Check if tables exist
    const orgCount = await Organization.count();
    const userCount = await User.count();
    const roleCount = await Role.count();
    const otpCount = await OTPVerification.count();
    
    res.json({
      status: 'Database connected',
      tables: {
        organizations: orgCount,
        users: userCount,
        roles: roleCount,
        otp_verifications: otpCount
      }
    });
  } catch (error) {
    res.json({ error: error.message, stack: error.stack });
  }
});

// Clear all tasks for testing
app.delete('/api/debug/clear-tasks', async (req, res) => {
  try {
    const { Task } = require('./models');
    await Task.destroy({ where: {} });
    res.json({ success: true, message: 'All tasks cleared' });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Debug endpoint to check user authentication
app.get('/api/debug/auth', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.json({ error: 'No token provided' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { User, Role, Organization } = require('./models');
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: Role }, { model: Organization }],
      raw: false
    });
    
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    
    res.json({ 
      decoded,
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        role: user.Role?.name,
        org: user.Organization?.name,
        raw: user.toJSON()
      }
    });
  } catch (error) {
    res.json({ error: error.message, stack: error.stack });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
db.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    // Skip sync to avoid key constraint errors
    server.listen(PORT, () => {
      console.log(`🚀 NexusFlow Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  });

module.exports = app;