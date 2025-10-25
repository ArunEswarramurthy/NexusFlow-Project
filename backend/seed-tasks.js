const { sequelize, Task, User, TaskAssignment } = require('./models');

async function seedTasks() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Get users
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('❌ No users found. Please run seed-admin.js first');
      return;
    }

    const sampleTasks = [
      {
        title: 'Setup Development Environment',
        description: 'Configure development environment with all necessary tools and dependencies',
        task_id: 'TASK-001',
        priority: 'high',
        status: 'completed',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        org_id: users[0].org_id,
        created_by: users[0].id
      },
      {
        title: 'Design User Interface',
        description: 'Create wireframes and mockups for the main dashboard and user management pages',
        task_id: 'TASK-002',
        priority: 'medium',
        status: 'in_progress',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        org_id: users[0].org_id,
        created_by: users[0].id
      },
      {
        title: 'Implement Authentication',
        description: 'Build secure login and registration system with JWT tokens',
        task_id: 'TASK-003',
        priority: 'urgent',
        status: 'under_review',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        org_id: users[0].org_id,
        created_by: users[0].id
      },
      {
        title: 'Database Schema Design',
        description: 'Design and implement the complete database schema for the application',
        task_id: 'TASK-004',
        priority: 'high',
        status: 'to_do',
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        org_id: users[0].org_id,
        created_by: users[0].id
      },
      {
        title: 'API Documentation',
        description: 'Create comprehensive API documentation for all endpoints',
        task_id: 'TASK-005',
        priority: 'low',
        status: 'to_do',
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        org_id: users[0].org_id,
        created_by: users[0].id
      }
    ];

    for (const taskData of sampleTasks) {
      const [task] = await Task.findOrCreate({
        where: { title: taskData.title, org_id: taskData.org_id },
        defaults: taskData
      });

      // Assign task to a random user
      if (users.length > 1) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        await TaskAssignment.findOrCreate({
          where: { task_id: task.id, user_id: randomUser.id },
          defaults: {
            task_id: task.id,
            user_id: randomUser.id,
            assigned_by: users[0].id
          }
        });
      }

      console.log(`✅ Task "${taskData.title}" created/updated`);
    }

    console.log('✅ Sample tasks seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
  } finally {
    await sequelize.close();
  }
}

seedTasks();