const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupChatTables() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'nexusflow_project'
    });

    console.log('✅ Connected to database');

    // Read and execute SQL file
    const sqlFile = path.join(__dirname, 'create-chat-tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed SQL statement');
      }
    }

    console.log('🎉 Chat tables created successfully!');
    
    // Create a sample chat room for testing
    const [orgResult] = await connection.execute('SELECT id FROM organizations LIMIT 1');
    const [userResult] = await connection.execute('SELECT id FROM users LIMIT 1');
    
    if (orgResult.length > 0 && userResult.length > 0) {
      const orgId = orgResult[0].id;
      const userId = userResult[0].id;
      
      // Create general chat room
      const [roomResult] = await connection.execute(
        'INSERT INTO chat_rooms (name, type, description, org_id, created_by) VALUES (?, ?, ?, ?, ?)',
        ['General Chat', 'group', 'General discussion for the team', orgId, userId]
      );
      
      const roomId = roomResult.insertId;
      
      // Add creator as admin participant
      await connection.execute(
        'INSERT INTO chat_participants (room_id, user_id, role) VALUES (?, ?, ?)',
        [roomId, userId, 'admin']
      );
      
      // Add welcome message
      await connection.execute(
        'INSERT INTO chat_messages (room_id, user_id, message, message_type) VALUES (?, ?, ?, ?)',
        [roomId, userId, 'Welcome to NexusFlow Chat! 🎉', 'system']
      );
      
      console.log('✅ Sample chat room created');
    }

  } catch (error) {
    console.error('❌ Error setting up chat tables:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupChatTables();