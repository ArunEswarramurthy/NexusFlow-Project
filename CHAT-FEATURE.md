# 💬 NexusFlow Chat Feature

## Overview
A comprehensive real-time chat system integrated into NexusFlow with professional UI/UX design, supporting multiple chat types and advanced messaging features.

## ✨ Features

### 🏠 Chat Room Types
- **Group Chat** - Team discussions and collaboration
- **Direct Messages** - One-on-one conversations
- **Task Chat** - Context-specific discussions linked to tasks

### 💬 Messaging Features
- **Real-time messaging** with Socket.IO
- **Message replies** and threading
- **File sharing** and image uploads
- **Typing indicators** 
- **Read receipts** and message status
- **Message editing** and deletion
- **Emoji support** and reactions

### 🎨 UI/UX Design
- **Modern chat interface** with professional styling
- **Responsive design** (mobile, tablet, desktop)
- **Smooth animations** with Framer Motion
- **Intuitive navigation** and user experience
- **Consistent color scheme** matching NexusFlow branding

### 🔒 Security & Permissions
- **Role-based access control**
- **Organization-level isolation**
- **Secure file uploads**
- **Message encryption** (future enhancement)

## 🚀 Quick Setup

### 1. Run Setup Script
```bash
# Windows
setup-chat-feature.bat

# Manual setup
cd backend && node setup-chat.js
```

### 2. Start Application
```bash
# Use existing start script
start-complete.bat

# Or manually
cd backend && npm run dev
cd frontend && npm start
```

### 3. Access Chat
- Navigate to `/chat` in the application
- Available in both Admin and User layouts
- Click the chat icon in the sidebar

## 📋 Database Schema

### Chat Rooms (`chat_rooms`)
```sql
- id (Primary Key)
- name (Room name)
- type (direct/group/task)
- description (Optional)
- org_id (Organization)
- created_by (Creator user)
- task_id (Optional task link)
- is_active (Status)
- created_at, updated_at
```

### Chat Messages (`chat_messages`)
```sql
- id (Primary Key)
- room_id (Chat room)
- user_id (Message sender)
- message (Message content)
- message_type (text/file/image/system)
- file_url, file_name (File attachments)
- reply_to (Reply to message)
- is_edited, edited_at
- created_at, updated_at
```

### Chat Participants (`chat_participants`)
```sql
- id (Primary Key)
- room_id (Chat room)
- user_id (Participant)
- role (admin/member)
- joined_at, last_read_at
- is_active (Status)
- created_at, updated_at
```

## 🔧 API Endpoints

### Chat Rooms
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new chat room
- `GET /api/chat/rooms/:id` - Get room details
- `POST /api/chat/rooms/:id/participants` - Add participants

### Messages
- `GET /api/chat/rooms/:id/messages` - Get room messages
- `POST /api/chat/rooms/:id/messages` - Send message

### Utilities
- `GET /api/chat/unread-count` - Get unread message counts

## 🎯 Socket.IO Events

### Client → Server
- `join-room` - Join user notification room
- `join-chat-room` - Join specific chat room
- `leave-chat-room` - Leave chat room
- `typing` - Send typing indicator

### Server → Client
- `new-message` - Receive new message
- `user-typing` - Receive typing indicator

## 📱 Components Structure

```
src/
├── components/chat/
│   ├── ChatSidebar.js      # Room list and navigation
│   ├── ChatWindow.js       # Main chat interface
│   ├── MessageBubble.js    # Individual message display
│   └── CreateRoomModal.js  # Room creation modal
├── context/
│   └── ChatContext.js      # Chat state management
├── services/
│   └── chatService.js      # API service functions
└── pages/
    └── ChatPage.js         # Main chat page
```

## 🎨 Styling & Design

### Color Scheme
- **Primary**: rgb(79, 70, 229) - #4F46E5
- **Secondary**: rgb(16, 185, 129) - #10B981
- **Success**: rgb(34, 197, 94) - #22C55E
- **Danger**: rgb(239, 68, 68) - #EF4444

### Room Type Colors
- **Direct**: Green (rgb(34, 197, 94))
- **Group**: Blue (rgb(59, 130, 246))
- **Task**: Purple (rgb(147, 51, 234))

### Message Styling
- **Own messages**: Blue background, right-aligned
- **Other messages**: Gray background, left-aligned
- **System messages**: Centered with special styling
- **File attachments**: Card-style with download links

## 🔄 Real-time Features

### Socket.IO Integration
- Automatic connection on user login
- Room-based message broadcasting
- Typing indicators with timeout
- Connection status management

### State Management
- React Context for chat state
- Real-time message updates
- Unread count tracking
- Active room management

## 📊 Performance Optimizations

### Database
- Indexed queries for fast message retrieval
- Pagination for message history
- Efficient participant lookups

### Frontend
- Lazy loading of chat components
- Message virtualization (future enhancement)
- Optimistic UI updates
- Debounced typing indicators

## 🔮 Future Enhancements

### Planned Features
- [ ] Message reactions and emojis
- [ ] Voice messages
- [ ] Video calls integration
- [ ] Message search functionality
- [ ] File preview in chat
- [ ] Message encryption
- [ ] Chat themes and customization
- [ ] Message scheduling
- [ ] Chat bots and automation

### Technical Improvements
- [ ] Message caching with Redis
- [ ] Horizontal scaling with Socket.IO adapter
- [ ] Push notifications
- [ ] Offline message sync
- [ ] Advanced file handling

## 🐛 Troubleshooting

### Common Issues

**Chat not loading:**
- Check database connection
- Verify chat tables exist
- Ensure Socket.IO server is running

**Messages not sending:**
- Check user permissions
- Verify room participation
- Check network connectivity

**Real-time not working:**
- Verify Socket.IO connection
- Check firewall settings
- Ensure proper CORS configuration

### Debug Commands
```bash
# Check chat tables
node -e "require('./backend/models').sequelize.query('SHOW TABLES LIKE \\'chat_%\\'')"

# Test Socket.IO connection
# Open browser console and check for Socket.IO logs
```

## 📞 Support

For issues or questions about the chat feature:
1. Check the troubleshooting section
2. Review the API documentation
3. Check Socket.IO connection logs
4. Contact the development team

---

**Made with ❤️ for NexusFlow Team Collaboration**