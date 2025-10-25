# 🚀 NexusFlow Setup Guide

Complete setup instructions for the NexusFlow project.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Installation Steps

### 1. Database Setup

1. **Start MySQL Server**
   - Ensure MySQL is running on your system
   - Default port: 3306

2. **Create Database**
   ```sql
   CREATE DATABASE nexusflow_project;
   ```

3. **Set up Database User**
   ```sql
   -- Use existing root user with password: 12345
   -- Or create a new user:
   CREATE USER 'nexusflow'@'localhost' IDENTIFIED BY '12345';
   GRANT ALL PRIVILEGES ON nexusflow_project.* TO 'nexusflow'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Run Database Setup Script**
   ```bash
   mysql -u root -p12345 nexusflow_project < setup-database.sql
   ```

### 2. Project Setup

1. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Environment Configuration**
   
   Backend `.env` is already configured with:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=nexusflow_project
   DB_USER=root
   DB_PASSWORD=12345
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=e22ec018@shanmugha.edu.in
   SMTP_PASSWORD=E22EC018 732722106004
   ```

### 3. Start Development Servers

**Option 1: Use the automated script**
```bash
# Windows
start-dev.bat

# This will start both backend and frontend servers
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔑 First Time Setup

### Create Organization Account

1. Go to http://localhost:3000
2. Click "Get Started Free"
3. Fill the registration form:
   - **Organization Name**: Your Company Name
   - **First Name**: Your First Name
   - **Last Name**: Your Last Name
   - **Email**: e22ec018@shanmugha.edu.in
   - **Password**: E22EC018 732722106004

4. Check email for OTP verification
5. Enter the 6-digit code
6. You'll be redirected to the Admin Dashboard

### Default Login Credentials

**Admin Login**: http://localhost:3000/admin/login
- Email: e22ec018@shanmugha.edu.in
- Password: E22EC018 732722106004

## 🎯 Key Features to Test

### 1. User Management
- Navigate to Admin → Users
- Add new users
- Assign roles and groups
- Test user login

### 2. Task Management
- Create tasks
- Assign to users/groups
- Track progress
- Submit and approve tasks

### 3. Role & Permission System
- Create custom roles
- Set granular permissions
- Test access control

### 4. Group Hierarchy
- Create departments and teams
- Organize users in groups
- Test group-based task assignment

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: Access denied for user 'root'@'localhost'
```
**Solution**: Check MySQL credentials in backend/.env

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Kill existing processes or change ports

**3. Email Not Sending**
```
Error: Invalid login credentials
```
**Solution**: Update SMTP settings in backend/.env

**4. Module Not Found**
```
Error: Cannot find module
```
**Solution**: Run `npm install` in both backend and frontend directories

### Reset Database
```bash
mysql -u root -p12345 -e "DROP DATABASE nexusflow_project;"
mysql -u root -p12345 -e "CREATE DATABASE nexusflow_project;"
mysql -u root -p12345 nexusflow_project < setup-database.sql
```

### Clear Node Modules
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📊 Development Tools

### Useful Commands

```bash
# Backend
npm run dev          # Start with nodemon
npm start           # Start production
npm run migrate     # Run migrations
npm run seed        # Seed database

# Frontend
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register organization
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"orgName":"Test Org","firstName":"John","lastName":"Doe","email":"test@example.com","password":"Test123!@#"}'
```

## 🎨 Customization

### Colors
Update colors in `frontend/src/index.css`:
```css
:root {
  --primary-600: rgb(79, 70, 229);
  --secondary-600: rgb(16, 185, 129);
  --accent-600: rgb(249, 115, 22);
}
```

### Logo
Replace logo in `frontend/public/` and update references in components.

### Email Templates
Modify email templates in `backend/services/emailService.js`.

## 🚀 Production Deployment

### Environment Variables
Update production environment variables:
- Database credentials
- SMTP settings
- JWT secrets
- API URLs

### Build Commands
```bash
# Frontend build
cd frontend
npm run build

# Backend (already production ready)
cd backend
npm start
```

### Database Migration
Ensure database is properly set up in production environment.

## 📞 Support

If you need help:
1. Check this setup guide
2. Review error logs in console
3. Check database connections
4. Verify all dependencies are installed

---

**Happy coding! 🎉**