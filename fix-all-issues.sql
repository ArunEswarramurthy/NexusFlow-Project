-- =====================================================
-- Fix All NexusFlow Issues - Complete Database Reset
-- =====================================================

-- Use the database
USE nexusflow_project;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- DROP ALL EXISTING TABLES
DROP TABLE IF EXISTS task_comments;
DROP TABLE IF EXISTS task_attachments;
DROP TABLE IF EXISTS task_assignments;
DROP TABLE IF EXISTS task_checklists;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS user_groups;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS settings;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Create organizations table
CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    logo_url VARCHAR(500),
    settings JSON,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    priority INT DEFAULT 50,
    description TEXT,
    permissions JSON,
    color VARCHAR(7) DEFAULT '#6B7280',
    is_system BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    org_id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    phone VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(50),
    profile_pic VARCHAR(500),
    bio TEXT,
    skills JSON,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    google_id VARCHAR(255),
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Create groups table
CREATE TABLE groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    org_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INT NULL,
    leader_id INT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create user_groups junction table
CREATE TABLE user_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_group (user_id, group_id)
);

-- Create tasks table
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    org_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_id VARCHAR(50) UNIQUE NOT NULL,
    priority ENUM('urgent', 'high', 'medium', 'low') DEFAULT 'medium',
    status ENUM('to_do', 'in_progress', 'under_review', 'completed', 'rejected') DEFAULT 'to_do',
    category VARCHAR(100),
    tags JSON,
    created_by INT NOT NULL,
    due_date DATETIME,
    actual_hours DECIMAL(8,2) DEFAULT 0,
    progress INT DEFAULT 0,
    is_recurring BOOLEAN DEFAULT FALSE,
    dependencies JSON,
    submission_count INT DEFAULT 0,
    watchers JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create task_assignments table
CREATE TABLE task_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT NULL,
    group_id INT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create task_checklists table
CREATE TABLE task_checklists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    item_text VARCHAR(500) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_by INT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create task_attachments table
CREATE TABLE task_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create task_comments table
CREATE TABLE task_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    parent_comment_id INT NULL,
    mentions JSON,
    attachments JSON,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES task_comments(id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    related_task_id INT NULL,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_org ON tasks(org_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Insert demo organization
INSERT INTO organizations (name, email, phone, status) VALUES 
('Demo Organization', 'e22ec018@shanmugha.edu.in', '+1234567890', 'active');

-- Insert default roles
INSERT INTO roles (org_id, name, priority, description, permissions, color, is_system) VALUES 
(1, 'Super Admin', 100, 'Full system access with all permissions', 
'["manage_users", "manage_roles", "manage_groups", "manage_tasks", "manage_settings", "view_reports", "manage_organization"]', 
'#DC2626', TRUE),

(1, 'Admin', 80, 'Administrative access with user and task management', 
'["manage_users", "manage_groups", "manage_tasks", "view_reports", "create_tasks", "assign_tasks"]', 
'#F59E0B', TRUE),

(1, 'User', 50, 'Standard user with task execution permissions', 
'["view_tasks", "update_own_tasks", "comment_tasks", "upload_files"]', 
'#10B981', TRUE),

(1, 'Guest', 10, 'Limited view-only access', 
'["view_assigned_tasks"]', 
'#6B7280', TRUE);

-- Insert demo admin user
INSERT INTO users (org_id, email, first_name, last_name, password_hash, role_id, status, email_verified) VALUES 
(1, 'e22ec018@shanmugha.edu.in', 'Admin', 'User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 1, 'active', TRUE),
(1, 'user@example.com', 'Demo', 'User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 3, 'active', TRUE);

-- Insert demo groups
INSERT INTO groups (org_id, name, description, leader_id) VALUES 
(1, 'Engineering', 'Software development team', 1),
(1, 'Marketing', 'Marketing and promotion team', 1),
(1, 'Sales', 'Sales and customer relations', 1);

-- Insert user-group relationships
INSERT INTO user_groups (user_id, group_id, role) VALUES 
(1, 1, 'leader'),
(2, 1, 'member');

COMMIT;

-- =====================================================
-- DATABASE RESET COMPLETE
-- All issues fixed:
-- 1. Clean database structure
-- 2. Proper foreign key relationships
-- 3. Demo data inserted
-- 4. Indexes created for performance
-- =====================================================