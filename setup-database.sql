-- NexusFlow Database Setup
-- Complete database schema with all tables and relationships

-- Drop existing tables if they exist (in correct order to avoid foreign key constraints)
DROP TABLE IF EXISTS `task_comments`;
DROP TABLE IF EXISTS `task_attachments`;
DROP TABLE IF EXISTS `task_checklist`;
DROP TABLE IF EXISTS `task_assignments`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `user_groups`;
DROP TABLE IF EXISTS `groups`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `otp_verifications`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `organizations`;

-- Create Organizations table
CREATE TABLE `organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive','pending') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Roles table
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `priority` int(11) DEFAULT 10,
  `permissions` json DEFAULT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `org_id` (`org_id`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Users table
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `status` enum('active','inactive','pending') DEFAULT 'pending',
  `email_verified` tinyint(1) DEFAULT 0,
  `profile_pic` varchar(500) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `locked_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `org_id` (`org_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Groups table
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_group_id` int(11) DEFAULT NULL,
  `group_lead_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `org_id` (`org_id`),
  KEY `parent_group_id` (`parent_group_id`),
  KEY `group_lead_id` (`group_lead_id`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`parent_group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  CONSTRAINT `groups_ibfk_3` FOREIGN KEY (`group_lead_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create User Groups junction table
CREATE TABLE `user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_group_unique` (`user_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Tasks table
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_id` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `status` enum('To Do','In Progress','Under Review','Completed','Rejected') DEFAULT 'To Do',
  `category` varchar(100) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `assigned_type` enum('user','group') DEFAULT 'user',
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `estimated_hours` decimal(5,2) DEFAULT NULL,
  `actual_hours` decimal(5,2) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurrence_pattern` json DEFAULT NULL,
  `dependencies` json DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `org_id` (`org_id`),
  KEY `created_by` (`created_by`),
  KEY `status` (`status`),
  KEY `priority` (`priority`),
  KEY `due_date` (`due_date`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Task Assignments table
CREATE TABLE `task_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `task_assignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignments_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignments_ibfk_4` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Task Comments table
CREATE TABLE `task_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `parent_comment_id` int(11) DEFAULT NULL,
  `mentions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_comment_id` (`parent_comment_id`),
  CONSTRAINT `task_comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `task_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Task Attachments table
CREATE TABLE `task_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `file_name` varchar(500) NOT NULL,
  `file_path` varchar(1000) NOT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `task_attachments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_attachments_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Task Checklist table
CREATE TABLE `task_checklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `item_text` varchar(500) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_by` int(11) DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `completed_by` (`completed_by`),
  CONSTRAINT `task_checklist_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_checklist_ibfk_2` FOREIGN KEY (`completed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Notifications table
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `title` varchar(500) NOT NULL,
  `message` text NOT NULL,
  `data` json DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_read` (`is_read`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Activity Logs table
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `org_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `org_id` (`org_id`),
  KEY `action` (`action`),
  KEY `entity_type` (`entity_type`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `activity_logs_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create OTP Verifications table
CREATE TABLE `otp_verifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `attempts` int(11) DEFAULT 0,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Password Resets table
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  KEY `expires_at` (`expires_at`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default roles for system
INSERT INTO `organizations` (`id`, `name`, `email`, `phone`, `status`) VALUES
(1, 'NexusFlow Demo', 'e22ec018@shanmugha.edu.in', '+1234567890', 'active');

INSERT INTO `roles` (`id`, `org_id`, `name`, `priority`, `permissions`, `is_system`) VALUES
(1, 1, 'Super Admin', 1, '["all"]', 1),
(2, 1, 'Admin', 2, '["manage_users", "manage_groups", "manage_tasks", "view_reports", "manage_roles"]', 1),
(3, 1, 'User', 3, '["view_own_tasks", "update_task_status", "comment_tasks", "upload_files"]', 1),
(4, 1, 'Guest', 4, '["view_assigned_tasks"]', 1);

-- Insert demo admin user
INSERT INTO `users` (`id`, `org_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `role_id`, `status`, `email_verified`) VALUES
(1, 1, 'e22ec018@shanmugha.edu.in', '$2b$10$rQJ5qVJ5qVJ5qVJ5qVJ5qOJ5qVJ5qVJ5qVJ5qVJ5qVJ5qVJ5qVJ5q', 'Admin', 'User', '+1234567890', 1, 'active', 1);

-- Insert demo groups
INSERT INTO `groups` (`id`, `org_id`, `name`, `parent_group_id`, `group_lead_id`, `description`, `status`) VALUES
(1, 1, 'Engineering', NULL, 1, 'Engineering Department', 'active'),
(2, 1, 'Frontend Team', 1, 1, 'Frontend Development Team', 'active'),
(3, 1, 'Backend Team', 1, 1, 'Backend Development Team', 'active'),
(4, 1, 'Marketing', NULL, 1, 'Marketing Department', 'active'),
(5, 1, 'Sales', NULL, 1, 'Sales Department', 'active');

-- Insert demo user-group relationships
INSERT INTO `user_groups` (`user_id`, `group_id`, `is_primary`) VALUES
(1, 1, 1),
(1, 2, 0);

-- Insert demo tasks
INSERT INTO `tasks` (`id`, `org_id`, `title`, `description`, `priority`, `status`, `category`, `created_by`, `assigned_type`, `start_date`, `due_date`, `progress`) VALUES
(1, 1, 'Setup NexusFlow Project', 'Initialize the complete NexusFlow project with all features', 'High', 'Completed', 'Development', 1, 'user', '2025-01-18', '2025-01-20', 100),
(2, 1, 'Implement User Authentication', 'Create secure login and registration system', 'High', 'In Progress', 'Development', 1, 'user', '2025-01-19', '2025-01-25', 75),
(3, 1, 'Design Landing Page', 'Create beautiful and responsive landing page', 'Medium', 'To Do', 'Design', 1, 'user', '2025-01-20', '2025-01-30', 0);

-- Insert demo task assignments
INSERT INTO `task_assignments` (`task_id`, `user_id`, `assigned_by`) VALUES
(1, 1, 1),
(2, 1, 1),
(3, 1, 1);

-- Insert demo checklist items
INSERT INTO `task_checklist` (`task_id`, `item_text`, `is_completed`, `completed_by`, `order_index`) VALUES
(1, 'Setup project structure', 1, 1, 1),
(1, 'Configure database', 1, 1, 2),
(1, 'Create basic UI components', 1, 1, 3),
(2, 'Design authentication flow', 1, 1, 1),
(2, 'Implement registration', 1, 1, 2),
(2, 'Add OTP verification', 1, 1, 3),
(2, 'Create login pages', 0, NULL, 4);

-- Insert demo notifications
INSERT INTO `notifications` (`user_id`, `type`, `title`, `message`, `is_read`) VALUES
(1, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: Setup NexusFlow Project', 1),
(1, 'task_completed', 'Task Completed', 'Task "Setup NexusFlow Project" has been completed successfully', 0),
(1, 'welcome', 'Welcome to NexusFlow', 'Welcome to NexusFlow! Your account has been created successfully.', 0);

-- Insert demo activity logs
INSERT INTO `activity_logs` (`user_id`, `org_id`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`) VALUES
(1, 1, 'CREATE', 'task', 1, '{"title": "Setup NexusFlow Project"}', '127.0.0.1'),
(1, 1, 'UPDATE', 'task', 1, '{"status": "Completed"}', '127.0.0.1'),
(1, 1, 'CREATE', 'task', 2, '{"title": "Implement User Authentication"}', '127.0.0.1');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_role ON users(org_id, role_id);
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_activity_logs_user_created ON activity_logs(user_id, created_at);

-- Success message
SELECT 'NexusFlow database setup completed successfully!' as message;