const mysql = require('mysql2/promise');
require('dotenv').config();

async function testChat() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'nexusflow_project'
    });

    console.log('✅ Connected to database');

    // Check if chat tables exist
    const [tables] = await connection.execute("SHOW TABLES LIKE 'chat_%'");
    console.log('📋 Chat tables found:', tables.length);
    
    if (tables.length === 0) {
      console.log('❌ No chat tables found. Run: node backend/setup-chat.js');
      return;
    }

    // Check users
    const [users] = await connection.execute('SELECT id, first_name, last_name, email FROM users LIMIT 5');
    console.log('👥 Users available:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email})`);
    });

    // Check chat rooms
    const [rooms] = await connection.execute('SELECT * FROM chat_rooms');
    console.log('💬 Chat rooms:', rooms.length);

    // Check messages
    const [messages] = await connection.execute('SELECT * FROM chat_messages');
    console.log('📨 Messages:', messages.length);

    console.log('\n🎉 Chat system is ready!');
    console.log('📍 Access chat at: http://localhost:3000/chat');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testChat();