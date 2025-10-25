const { Task, User, Role, TaskAssignment, TaskComment, TaskAttachment, Group } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/tasks');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xlsx|xls|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents and images are allowed'));
    }
  }
});

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { org_id: req.user.org_id },
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: TaskAssignment,
          include: [{
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }]
        },
        {
          model: TaskAttachment,
          attributes: ['id', 'file_name']
        },
        {
          model: TaskComment,
          attributes: ['id']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedTasks = tasks.map(task => {
      const assignedUsers = task.TaskAssignments?.map(assignment => ({
        id: assignment.User.id,
        name: `${assignment.User.first_name} ${assignment.User.last_name}`,
        email: assignment.User.email,
        avatar: `${assignment.User.first_name[0]}${assignment.User.last_name[0]}`
      })) || [];

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        progress: task.progress || 0,
        createdBy: task.Creator ? `${task.Creator.first_name} ${task.Creator.last_name}` : 'Unknown',
        assignedUsers,
        assignedTo: assignedUsers.length > 0 ? assignedUsers[0].name : 'Unassigned',
        assigneeAvatar: assignedUsers.length > 0 ? assignedUsers[0].avatar : 'UN',
        tags: task.tags || [],
        attachments: task.TaskAttachments?.length || 0,
        comments: task.TaskComments?.length || 0,
        checklist: { completed: 0, total: 0 },
        createdAt: task.created_at,
        updatedAt: task.updated_at
      };
    });

    res.json({ success: true, tasks: formattedTasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tasks', details: error.message });
  }
};

// Create task with file upload
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedUsers, tags, category } = req.body;
    const files = req.files || [];

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    // Parse assignedUsers if it's a string
    let parsedAssignedUsers = [];
    if (assignedUsers) {
      try {
        parsedAssignedUsers = typeof assignedUsers === 'string' ? JSON.parse(assignedUsers) : assignedUsers;
      } catch (e) {
        parsedAssignedUsers = [];
      }
    }

    // Parse tags if it's a string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    // Generate unique task ID
    const timestamp = Date.now().toString().slice(-6);
    const taskId = `TASK-${timestamp}`;

    const taskData = {
      org_id: req.user.org_id,
      title: title.trim(),
      description: description.trim(),
      task_id: taskId,
      priority: priority || 'medium',
      due_date: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'to_do',
      created_by: req.user.id,
      category: category || null,
      tags: parsedTags
    };

    const task = await Task.create(taskData);

    // Handle file attachments
    if (files && files.length > 0) {
      const attachments = files.map(file => ({
        task_id: task.id,
        file_name: file.filename,
        original_name: file.originalname,
        file_url: file.path,
        file_size: file.size,
        file_type: path.extname(file.originalname),
        mime_type: file.mimetype,
        uploaded_by: req.user.id
      }));
      
      await TaskAttachment.bulkCreate(attachments);
    }

    // Assign users to task if provided
    if (parsedAssignedUsers && parsedAssignedUsers.length > 0) {
      const assignments = parsedAssignedUsers.map(userId => ({
        task_id: task.id,
        user_id: userId,
        assigned_by: req.user.id,
        assigned_at: new Date()
      }));
      
      await TaskAssignment.bulkCreate(assignments);
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        attachments: files.length
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, error: 'Failed to create task', details: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedUsers, tags, category, progress } = req.body;

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Update task fields
    await task.update({
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      priority: priority || task.priority,
      due_date: dueDate || task.due_date,
      category: category !== undefined ? category : task.category,
      tags: tags !== undefined ? tags : task.tags,
      progress: progress !== undefined ? progress : task.progress
    });

    // Update assignments if provided
    if (assignedUsers !== undefined) {
      await TaskAssignment.destroy({ where: { task_id: id } });
      
      if (assignedUsers.length > 0) {
        const assignments = assignedUsers.map(userId => ({
          task_id: id,
          user_id: userId,
          assigned_by: req.user.id,
          assigned_at: new Date()
        }));
        
        await TaskAssignment.bulkCreate(assignments);
      }
    }

    res.json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, error: 'Failed to update task', details: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Delete related records first
    await TaskAssignment.destroy({ where: { task_id: id } });
    await TaskComment.destroy({ where: { task_id: id } });
    
    // Delete attachments and files
    const attachments = await TaskAttachment.findAll({ where: { task_id: id } });
    for (const attachment of attachments) {
      if (fs.existsSync(attachment.file_path)) {
        fs.unlinkSync(attachment.file_path);
      }
    }
    await TaskAttachment.destroy({ where: { task_id: id } });
    
    // Delete the task
    await task.destroy();
    
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, error: 'Failed to delete task', details: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id },
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: TaskAssignment,
          include: [{
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }]
        },
        {
          model: TaskComment,
          include: [{
            model: User,
            attributes: ['id', 'first_name', 'last_name']
          }],
          order: [['created_at', 'DESC']]
        },
        {
          model: TaskAttachment,
          attributes: ['id', 'file_name', 'file_size', 'mime_type', 'created_at']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const formattedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      progress: task.progress || 0,
      createdBy: task.Creator ? `${task.Creator.first_name} ${task.Creator.last_name}` : 'Unknown',
      assignedUsers: task.TaskAssignments?.map(assignment => ({
        id: assignment.User.id,
        name: `${assignment.User.first_name} ${assignment.User.last_name}`,
        email: assignment.User.email
      })) || [],
      comments: task.TaskComments?.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: `${comment.User.first_name} ${comment.User.last_name}`,
        createdAt: comment.created_at
      })) || [],
      attachments: task.TaskAttachments?.map(attachment => ({
        id: attachment.id,
        filename: attachment.file_name,
        fileSize: attachment.file_size,
        mimeType: attachment.mime_type,
        createdAt: attachment.created_at
      })) || [],
      createdAt: task.created_at,
      updatedAt: task.updated_at
    };

    res.json({ task: formattedTask });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Submit task for review
const submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionNotes } = req.body;

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Task must be in progress to submit' });
    }

    await task.update({
      status: 'under_review',
      submission_notes: submissionNotes,
      submission_count: (task.submission_count || 0) + 1,
      progress: 100
    });

    res.json({ success: true, message: 'Task submitted for review successfully' });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ success: false, error: 'Failed to submit task', details: error.message });
  }
};

// Approve task
const approveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalNotes } = req.body;

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'under_review') {
      return res.status(400).json({ success: false, error: 'Task must be under review to approve' });
    }

    await task.update({
      status: 'completed',
      approval_notes: approvalNotes,
      approver_id: req.user.id,
      completed_at: new Date(),
      progress: 100
    });

    res.json({ success: true, message: 'Task approved successfully' });
  } catch (error) {
    console.error('Error approving task:', error);
    res.status(500).json({ success: false, error: 'Failed to approve task', details: error.message });
  }
};

// Reject task (send back for rework)
const rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ success: false, error: 'Rejection reason is required' });
    }

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'under_review') {
      return res.status(400).json({ success: false, error: 'Task must be under review to reject' });
    }

    await task.update({
      status: 'in_progress',
      rejection_reason: rejectionReason,
      progress: Math.max(0, (task.progress || 100) - 20)
    });

    res.json({ success: true, message: 'Task rejected and sent back for rework' });
  } catch (error) {
    console.error('Error rejecting task:', error);
    res.status(500).json({ success: false, error: 'Failed to reject task', details: error.message });
  }
};

// Assign task to users
const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, error: 'User IDs are required' });
    }

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Verify users exist and belong to the same organization
    const users = await User.findAll({
      where: {
        id: { [Op.in]: userIds },
        org_id: req.user.org_id
      }
    });

    if (users.length !== userIds.length) {
      return res.status(400).json({ success: false, error: 'Some users not found or not in your organization' });
    }

    // Remove existing assignments
    await TaskAssignment.destroy({ where: { task_id: id } });

    // Create new assignments
    const assignments = userIds.map(userId => ({
      task_id: id,
      user_id: userId,
      assigned_by: req.user.id,
      assigned_at: new Date()
    }));

    await TaskAssignment.bulkCreate(assignments);

    res.json({ success: true, message: 'Task assigned successfully' });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ success: false, error: 'Failed to assign task', details: error.message });
  }
};

// Start task (change status to in_progress)
const startTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, org_id: req.user.org_id }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'to_do') {
      return res.status(400).json({ success: false, error: 'Task must be in "To Do" status to start' });
    }

    await task.update({
      status: 'in_progress',
      start_date: new Date(),
      progress: Math.max(task.progress || 0, 10)
    });

    res.json({ success: true, message: 'Task started successfully' });
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).json({ success: false, error: 'Failed to start task', details: error.message });
  }
};

// Download attachment
const downloadAttachment = async (req, res) => {
  try {
    const { taskId, attachmentId } = req.params;

    const attachment = await TaskAttachment.findOne({
      where: { id: attachmentId, task_id: taskId },
      include: [{
        model: Task,
        where: { org_id: req.user.org_id }
      }]
    });

    if (!attachment) {
      return res.status(404).json({ success: false, error: 'Attachment not found' });
    }

    const filePath = attachment.file_path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    res.download(filePath, attachment.filename);
  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).json({ success: false, error: 'Failed to download attachment' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  submitTask,
  approveTask,
  rejectTask,
  assignTask,
  startTask,
  downloadAttachment,
  upload
};