const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const Organization = require('./Organization')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const Role = require('./Role')(sequelize, DataTypes);
const Group = require('./Group')(sequelize, DataTypes);
const Task = require('./Task')(sequelize, DataTypes);
const TaskAssignment = require('./TaskAssignment')(sequelize, DataTypes);
const TaskComment = require('./TaskComment')(sequelize, DataTypes);
const TaskAttachment = require('./TaskAttachment')(sequelize, DataTypes);
const TaskChecklist = require('./TaskChecklist')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const ActivityLog = require('./ActivityLog')(sequelize, DataTypes);
const OTPVerification = require('./OTPVerification')(sequelize, DataTypes);
const PasswordReset = require('./PasswordReset')(sequelize, DataTypes);
const UserGroup = require('./UserGroup')(sequelize, DataTypes);
const ChatRoom = require('./ChatRoom')(sequelize, DataTypes);
const ChatMessage = require('./ChatMessage')(sequelize, DataTypes);
const ChatParticipant = require('./ChatParticipant')(sequelize, DataTypes);

// Define associations
const models = {
  Organization,
  User,
  Role,
  Group,
  Task,
  TaskAssignment,
  TaskComment,
  TaskAttachment,
  TaskChecklist,
  Notification,
  ActivityLog,
  OTPVerification,
  PasswordReset,
  UserGroup,
  ChatRoom,
  ChatMessage,
  ChatParticipant
};

// Organization associations
Organization.hasMany(User, { foreignKey: 'org_id' });
Organization.hasMany(Role, { foreignKey: 'org_id' });
Organization.hasMany(Group, { foreignKey: 'org_id' });
Organization.hasMany(Task, { foreignKey: 'org_id' });

// User associations
User.belongsTo(Organization, { foreignKey: 'org_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });
User.hasMany(Task, { foreignKey: 'created_by', as: 'CreatedTasks' });
User.hasMany(TaskAssignment, { foreignKey: 'user_id' });
User.hasMany(TaskComment, { foreignKey: 'user_id' });
User.hasMany(TaskAttachment, { foreignKey: 'uploaded_by' });
User.hasMany(Notification, { foreignKey: 'user_id' });
User.hasMany(ActivityLog, { foreignKey: 'user_id' });
User.belongsToMany(Group, { through: UserGroup, foreignKey: 'user_id' });

// Role associations
Role.belongsTo(Organization, { foreignKey: 'org_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// Group associations
Group.belongsTo(Organization, { foreignKey: 'org_id' });
Group.belongsTo(Group, { foreignKey: 'parent_group_id', as: 'parentGroup' });
Group.hasMany(Group, { foreignKey: 'parent_group_id', as: 'subGroups' });
Group.belongsTo(User, { foreignKey: 'group_lead_id', as: 'groupLead' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'group_id' });
Group.hasMany(UserGroup, { foreignKey: 'group_id' });

// Task associations
Task.belongsTo(Organization, { foreignKey: 'org_id' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });
Task.belongsTo(User, { foreignKey: 'approver_id', as: 'Approver' });
Task.hasMany(TaskAssignment, { foreignKey: 'task_id' });
Task.hasMany(TaskComment, { foreignKey: 'task_id' });
Task.hasMany(TaskAttachment, { foreignKey: 'task_id' });
Task.hasMany(TaskChecklist, { foreignKey: 'task_id' });
Task.belongsToMany(User, { through: TaskAssignment, foreignKey: 'task_id' });

// TaskAssignment associations
TaskAssignment.belongsTo(Task, { foreignKey: 'task_id' });
TaskAssignment.belongsTo(User, { foreignKey: 'user_id' });

// TaskComment associations
TaskComment.belongsTo(Task, { foreignKey: 'task_id' });
TaskComment.belongsTo(User, { foreignKey: 'user_id' });

// TaskAttachment associations
TaskAttachment.belongsTo(Task, { foreignKey: 'task_id' });
TaskAttachment.belongsTo(User, { foreignKey: 'uploaded_by', as: 'Uploader' });

// TaskChecklist associations
TaskChecklist.belongsTo(Task, { foreignKey: 'task_id' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Task, { foreignKey: 'task_id' });

// ActivityLog associations
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

// UserGroup associations
UserGroup.belongsTo(User, { foreignKey: 'user_id' });
UserGroup.belongsTo(Group, { foreignKey: 'group_id' });

// Chat associations
ChatRoom.belongsTo(Organization, { foreignKey: 'org_id' });
ChatRoom.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });
ChatRoom.belongsTo(Task, { foreignKey: 'task_id' });
ChatRoom.hasMany(ChatMessage, { foreignKey: 'room_id' });
ChatRoom.hasMany(ChatParticipant, { foreignKey: 'room_id' });

ChatMessage.belongsTo(ChatRoom, { foreignKey: 'room_id' });
ChatMessage.belongsTo(User, { foreignKey: 'user_id' });
ChatMessage.belongsTo(ChatMessage, { foreignKey: 'reply_to', as: 'ReplyTo' });

ChatParticipant.belongsTo(ChatRoom, { foreignKey: 'room_id' });
ChatParticipant.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ChatRoom, { foreignKey: 'created_by' });
User.hasMany(ChatMessage, { foreignKey: 'user_id' });
User.hasMany(ChatParticipant, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  ...models
};