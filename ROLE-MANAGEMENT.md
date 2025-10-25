# 🛡️ NexusFlow Role Management System

A comprehensive, dynamic role-based access control (RBAC) system with granular permissions and real-time management capabilities.

## ✨ Features

### 🎯 Core Functionality
- **Dynamic Role Creation** - Create custom roles with specific permissions
- **Granular Permissions** - 45+ individual permissions across 6 categories
- **System & Custom Roles** - Protected system roles + flexible custom roles
- **Real-time Updates** - Instant UI updates with API integration
- **Role Hierarchy** - Priority-based role ordering
- **Permission Templates** - Quick role setup with predefined permission sets

### 🎨 User Experience
- **Modern UI/UX** - Beautiful cards with animations and hover effects
- **Advanced Search** - Search roles by name, description, or permissions
- **Smart Filtering** - Filter by status, type, and permission count
- **Bulk Operations** - Select and manage multiple roles
- **Responsive Design** - Works perfectly on all devices
- **Accessibility** - WCAG compliant with keyboard navigation

### 🔒 Security Features
- **Permission Validation** - Server-side permission checking
- **Role Protection** - System roles cannot be deleted or modified
- **User Assignment Checks** - Prevent deletion of roles with assigned users
- **Audit Logging** - Track all role management activities
- **Organization Isolation** - Roles are scoped to organizations

## 📊 Permission Categories

### 👥 User Management (7 permissions)
- `view_users` - View user list and profiles
- `create_users` - Create new user accounts
- `edit_users` - Modify user information
- `delete_users` - Remove user accounts
- `manage_user_roles` - Assign/change user roles
- `bulk_import_users` - Import users via CSV
- `export_users` - Export user data

### ✅ Task Management (13 permissions)
- `view_all_tasks` - View all organization tasks
- `view_assigned_tasks` - View only assigned tasks
- `create_tasks` - Create new tasks
- `edit_tasks` - Modify existing tasks
- `delete_tasks` - Remove tasks
- `assign_tasks` - Assign tasks to users/groups
- `approve_tasks` - Approve completed tasks
- `manage_task_priorities` - Set task priorities
- `manage_task_dependencies` - Create task dependencies
- `view_task_analytics` - Access task reports
- `export_tasks` - Export task data
- `manage_recurring_tasks` - Set up recurring tasks
- `manage_task_templates` - Create task templates

### 🛡️ Role Management (5 permissions)
- `view_roles` - View role list and details
- `create_roles` - Create new roles
- `edit_roles` - Modify existing roles
- `delete_roles` - Remove roles
- `manage_permissions` - Assign permissions to roles

### 👥 Group Management (6 permissions)
- `view_groups` - View group structure
- `create_groups` - Create new groups
- `edit_groups` - Modify group details
- `delete_groups` - Remove groups
- `manage_group_hierarchy` - Organize group structure
- `assign_users_to_groups` - Add/remove group members

### 📊 Reports & Analytics (5 permissions)
- `view_reports` - Access standard reports
- `create_reports` - Generate custom reports
- `export_reports` - Download report data
- `view_analytics` - Access analytics dashboard
- `schedule_reports` - Set up automated reports

### ⚙️ System Settings (9 permissions)
- `manage_organization` - Organization settings
- `manage_system_settings` - System configuration
- `view_activity_logs` - Access audit logs
- `manage_notifications` - Configure notifications
- `manage_integrations` - Set up integrations
- `backup_restore` - System backup/restore
- `manage_security` - Security settings
- `view_system_health` - System monitoring
- `manage_email_templates` - Email customization

## 🏗️ System Architecture

### Backend Components

#### Models
```javascript
// Role Model (Sequelize)
{
  id: INTEGER (Primary Key),
  org_id: INTEGER (Foreign Key),
  name: STRING(100),
  priority: INTEGER,
  description: TEXT,
  permissions: JSON,
  color: STRING(7),
  is_system: BOOLEAN,
  status: ENUM('active', 'inactive')
}
```

#### Controllers
- **roleController.js** - Main business logic
  - CRUD operations
  - Permission validation
  - Statistics generation
  - Bulk operations

#### Routes
- `GET /api/roles` - List all roles
- `GET /api/roles/stats` - Role statistics
- `GET /api/roles/permissions` - Available permissions
- `GET /api/roles/:id` - Get specific role
- `POST /api/roles` - Create new role
- `POST /api/roles/:id/duplicate` - Duplicate role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

#### Middleware
- **authenticateToken** - JWT authentication
- **checkPermission** - Permission-based access control
- **requireAdmin** - Admin role requirement

### Frontend Components

#### Pages
- **RolesPage.js** - Main role management interface

#### Components
- **RoleCard.js** - Individual role display card
- **RoleModal.js** - Create/Edit/View role modal
- **PermissionSelector.js** - Permission management interface

#### Services
- **roleService.js** - API communication layer

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8+
- React 18+

### Installation

1. **Backend Setup**
```bash
cd backend
npm install
```

2. **Database Migration**
```bash
# Roles table is created automatically via Sequelize
node seed-roles.js  # Populate default roles
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Start Development**
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm start
```

### Default Roles

The system comes with 5 pre-configured roles:

1. **Super Admin** (Priority 1)
   - All 45 permissions
   - Cannot be modified or deleted
   - Full system access

2. **Admin** (Priority 2)
   - 38 permissions (excludes some system settings)
   - Cannot be modified or deleted
   - Administrative access

3. **Manager** (Priority 3)
   - 15 permissions (user and task management)
   - Can be duplicated but not modified
   - Team management focus

4. **User** (Priority 4)
   - 3 permissions (basic task access)
   - Can be duplicated but not modified
   - Standard user access

5. **Guest** (Priority 5)
   - 1 permission (view assigned tasks only)
   - Can be duplicated but not modified
   - Read-only access

## 🎯 Usage Guide

### Creating a New Role

1. **Navigate to Role Management**
   - Go to Admin Dashboard → Role Management

2. **Click "Create Role"**
   - Opens the role creation modal

3. **Fill Basic Information**
   - Name: Unique role name
   - Priority: 1-100 (lower = higher priority)
   - Description: Optional role description
   - Color: Visual theme color

4. **Select Permissions**
   - Browse permission categories
   - Use search to find specific permissions
   - Select/deselect individual permissions
   - Use "Select All" for entire categories

5. **Save Role**
   - Review permission summary
   - Click "Create Role"

### Managing Existing Roles

#### View Role Details
- Click "View" on any role card
- See complete permission list
- View assigned users
- Check role statistics

#### Edit Custom Roles
- Click "Edit" on custom roles
- Modify name, description, permissions
- System roles cannot be edited

#### Duplicate Roles
- Click "Duplicate" on any role
- Creates copy with "(Copy)" suffix
- Useful for creating similar roles

#### Delete Roles
- Click "Delete" on custom roles
- Confirms no users are assigned
- System roles cannot be deleted

### Advanced Features

#### Search & Filter
- **Search**: Find roles by name or description
- **Status Filter**: Active/Inactive roles
- **Sort Options**: Priority, Name, Users, Permissions

#### Bulk Operations
- Select multiple roles
- Bulk status changes
- Bulk permission updates
- Export role data

#### Permission Management
- **Category View**: Organized by function
- **Search Permissions**: Find specific permissions
- **Batch Selection**: Select entire categories
- **Permission Preview**: See what each permission allows

## 🔧 API Reference

### Authentication
All role management endpoints require authentication:
```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>'
}
```

### Endpoints

#### Get All Roles
```http
GET /api/roles
```
**Response:**
```json
{
  "success": true,
  "roles": [
    {
      "id": 1,
      "name": "Admin",
      "priority": 2,
      "description": "Administrative access",
      "permissions": ["view_users", "create_users"],
      "permissionCount": 38,
      "totalPermissions": 45,
      "userCount": 5,
      "color": "#3B82F6",
      "isSystem": true,
      "status": "active"
    }
  ],
  "totalPermissions": 45
}
```

#### Create Role
```http
POST /api/roles
Content-Type: application/json

{
  "name": "Custom Role",
  "priority": 5,
  "description": "Custom role description",
  "permissions": ["view_users", "create_tasks"],
  "color": "#8B5CF6"
}
```

#### Update Role
```http
PUT /api/roles/:id
Content-Type: application/json

{
  "name": "Updated Role Name",
  "permissions": ["view_users", "edit_users", "create_tasks"]
}
```

#### Get Role Statistics
```http
GET /api/roles/stats
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalRoles": 8,
    "systemRoles": 5,
    "customRoles": 3,
    "activeRoles": 7,
    "rolesWithUsers": 4,
    "averagePermissions": 15
  }
}
```

## 🎨 Customization

### Adding New Permissions

1. **Update Permission Definitions**
```javascript
// backend/controllers/roleController.js
const PERMISSIONS = {
  // Add new permission
  'new_permission': 'New Permission Description',
  // ... existing permissions
};
```

2. **Update Permission Categories**
```javascript
const permissionCategories = {
  'New Category': [
    'new_permission'
  ],
  // ... existing categories
};
```

3. **Update Middleware**
```javascript
// Use in routes
router.get('/protected', checkPermission('new_permission'), handler);
```

### Custom Role Colors

Add new color options in the frontend:
```javascript
// frontend/src/components/admin/RoleModal.js
const colorOptions = [
  { value: '#8B5CF6', name: 'Purple', class: 'bg-purple-500' },
  { value: '#YOUR_COLOR', name: 'Custom', class: 'bg-custom-500' },
  // ... existing colors
];
```

### Custom Permission Categories

Organize permissions into custom categories:
```javascript
const customCategories = {
  'Custom Category': [
    'permission1',
    'permission2'
  ]
};
```

## 🧪 Testing

### API Testing
```bash
# Run comprehensive API tests
node test-role-api.js
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Create new role with permissions
- [ ] Edit existing custom role
- [ ] Duplicate system and custom roles
- [ ] Delete role (should fail if users assigned)
- [ ] Search and filter functionality
- [ ] Permission category expansion/collapse
- [ ] Responsive design on mobile
- [ ] Accessibility with keyboard navigation

## 🚨 Troubleshooting

### Common Issues

#### "Permission denied" errors
- Check user has required permissions
- Verify JWT token is valid
- Ensure user belongs to correct organization

#### Roles not loading
- Check database connection
- Verify role seeding completed
- Check browser console for errors

#### Permission updates not reflecting
- Clear browser cache
- Check API response for errors
- Verify database permissions column

#### System roles showing as editable
- Check `is_system` flag in database
- Verify role seeding script ran correctly
- Check frontend role type detection

### Debug Commands

```bash
# Check database roles
mysql -u root -p nexusflow_project -e "SELECT * FROM roles;"

# Test API endpoints
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/roles

# Check server logs
cd backend && npm run dev

# Frontend debug mode
cd frontend && REACT_APP_DEBUG=true npm start
```

## 📈 Performance Optimization

### Backend Optimizations
- **Permission Caching** - Cache user permissions for 5 minutes
- **Database Indexing** - Indexes on org_id, name, priority
- **Query Optimization** - Efficient joins with User model
- **Response Compression** - Gzip compression enabled

### Frontend Optimizations
- **Component Memoization** - React.memo for role cards
- **Virtual Scrolling** - For large role lists
- **Lazy Loading** - Permission modal loads on demand
- **Debounced Search** - 300ms delay for search input

## 🔒 Security Considerations

### Permission Validation
- Server-side permission checking
- JWT token validation
- Organization-scoped access
- Role hierarchy enforcement

### Data Protection
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting

### Audit Trail
- All role changes logged
- User action tracking
- Permission change history
- Failed access attempts

## 🚀 Future Enhancements

### Planned Features
- [ ] **Role Templates** - Pre-built role configurations
- [ ] **Permission Groups** - Logical permission groupings
- [ ] **Role Inheritance** - Hierarchical permission inheritance
- [ ] **Conditional Permissions** - Context-based permissions
- [ ] **Role Scheduling** - Time-based role assignments
- [ ] **Advanced Analytics** - Role usage analytics
- [ ] **API Rate Limiting** - Per-role rate limits
- [ ] **Multi-tenancy** - Cross-organization roles

### Integration Possibilities
- [ ] **LDAP/AD Integration** - Import roles from directory
- [ ] **SSO Integration** - Role mapping from SSO providers
- [ ] **Webhook Support** - Role change notifications
- [ ] **API Documentation** - Interactive API docs
- [ ] **Mobile App** - Role management mobile interface

## 📚 Additional Resources

- [NexusFlow Documentation](./README.md)
- [API Reference](./API-DOCS.md)
- [Security Guide](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/role-enhancement`)
3. Commit changes (`git commit -m 'Add role enhancement'`)
4. Push to branch (`git push origin feature/role-enhancement`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>🛡️ <strong>Secure • Scalable • User-Friendly</strong></p>
  <p>Built with ❤️ by the NexusFlow Team</p>
</div>