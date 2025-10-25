const { ChatRoom, ChatMessage, ChatParticipant, User, Task } = require('../models');
const { Op } = require('sequelize');

// Get all chat rooms for a user
const getChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const orgId = req.user.org_id;

    const rooms = await ChatRoom.findAll({
      where: { org_id: orgId, is_active: true },
      include: [
        {
          model: ChatParticipant,
          where: { user_id: userId, is_active: true },
          required: true,
          include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'email'] }]
        },
        {
          model: ChatMessage,
          limit: 1,
          order: [['created_at', 'DESC']],
          include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }]
        },
        { model: User, as: 'Creator', attributes: ['first_name', 'last_name', 'email'] }
      ],
      order: [['updated_at', 'DESC']]
    });

    // Format room names for direct chats
    const formattedRooms = rooms.map(room => {
      if (room.type === 'direct' && room.ChatParticipants) {
        // Find the other participant (not current user)
        const otherParticipant = room.ChatParticipants.find(p => p.user_id !== userId);
        if (otherParticipant && otherParticipant.User) {
          const user = otherParticipant.User;
          room.name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
        }
      }
      return room;
    });

    res.json(formattedRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new chat room
const createChatRoom = async (req, res) => {
  try {
    const { name, type, description, participants, taskId } = req.body;
    const userId = req.user.id;
    const orgId = req.user.org_id;

    // For direct messages, check if room already exists and set proper name
    if (type === 'direct' && participants && participants.length === 1) {
      const otherUserId = participants[0];
      
      // Get other user's name for room name
      const otherUser = await User.findByPk(otherUserId, {
        attributes: ['first_name', 'last_name', 'email']
      });
      
      if (otherUser) {
        name = `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || otherUser.email;
      }
      
      // Check if direct chat already exists between these users
      const existingRooms = await ChatRoom.findAll({
        where: { 
          org_id: orgId, 
          type: 'direct',
          is_active: true
        },
        include: [{
          model: ChatParticipant,
          where: { is_active: true },
          required: true
        }]
      });

      for (const room of existingRooms) {
        const participantIds = room.ChatParticipants.map(p => p.user_id).sort();
        const currentUserIds = [userId, otherUserId].sort();
        
        if (JSON.stringify(participantIds) === JSON.stringify(currentUserIds)) {
          // Update room name and return existing room
          await ChatRoom.update({ name }, { where: { id: room.id } });
          
          const roomWithDetails = await ChatRoom.findByPk(room.id, {
            include: [
              { model: ChatParticipant, include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }] },
              { model: User, as: 'Creator', attributes: ['first_name', 'last_name'] }
            ]
          });
          return res.json(roomWithDetails);
        }
      }
    }

    const room = await ChatRoom.create({
      name,
      type,
      description,
      org_id: orgId,
      created_by: userId,
      task_id: taskId || null
    });

    // Add creator as admin
    await ChatParticipant.create({
      room_id: room.id,
      user_id: userId,
      role: 'admin'
    });

    // Add other participants
    if (participants && participants.length > 0) {
      const participantData = participants.map(participantId => ({
        room_id: room.id,
        user_id: participantId,
        role: 'member'
      }));
      await ChatParticipant.bulkCreate(participantData);
    }

    const roomWithDetails = await ChatRoom.findByPk(room.id, {
      include: [
        { model: ChatParticipant, include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }] },
        { model: User, as: 'Creator', attributes: ['first_name', 'last_name'] }
      ]
    });

    res.status(201).json(roomWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages for a chat room
const getChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Check if user is participant
    const participant = await ChatParticipant.findOne({
      where: { room_id: roomId, user_id: userId, is_active: true }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const offset = (page - 1) * limit;
    const messages = await ChatMessage.findAll({
      where: { room_id: roomId },
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'email'] },
        { model: ChatMessage, as: 'ReplyTo', include: [{ model: User, attributes: ['first_name', 'last_name'] }] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Update last read timestamp
    await ChatParticipant.update(
      { last_read_at: new Date() },
      { where: { room_id: roomId, user_id: userId } }
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message, messageType = 'text', replyTo } = req.body;
    const userId = req.user.id;

    // Check if user is participant
    const participant = await ChatParticipant.findOne({
      where: { room_id: roomId, user_id: userId, is_active: true }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const newMessage = await ChatMessage.create({
      room_id: roomId,
      user_id: userId,
      message,
      message_type: messageType,
      reply_to: replyTo || null
    });

    const messageWithUser = await ChatMessage.findByPk(newMessage.id, {
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'email'] },
        { model: ChatMessage, as: 'ReplyTo', include: [{ model: User, attributes: ['first_name', 'last_name'] }] }
      ]
    });

    // Update room's updated_at
    await ChatRoom.update(
      { updated_at: new Date() },
      { where: { id: roomId } }
    );

    // Emit to all participants via Socket.IO
    const io = req.app.get('io');
    const participants = await ChatParticipant.findAll({
      where: { room_id: roomId, is_active: true }
    });

    participants.forEach(p => {
      io.to(`user-${p.user_id}`).emit('new-message', {
        roomId,
        message: messageWithUser
      });
    });

    res.status(201).json(messageWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat room details
const getChatRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Check if user is participant
    const participant = await ChatParticipant.findOne({
      where: { room_id: roomId, user_id: userId, is_active: true }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const room = await ChatRoom.findByPk(roomId, {
      include: [
        {
          model: ChatParticipant,
          where: { is_active: true },
          include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'email'] }]
        },
        { model: User, as: 'Creator', attributes: ['first_name', 'last_name'] },
        { model: Task, attributes: ['title', 'task_id'] }
      ]
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add participants to chat room
const addParticipants = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { participants } = req.body;
    const userId = req.user.id;

    // Check if user is admin of the room
    const userParticipant = await ChatParticipant.findOne({
      where: { room_id: roomId, user_id: userId, role: 'admin', is_active: true }
    });

    if (!userParticipant) {
      return res.status(403).json({ error: 'Only room admins can add participants' });
    }

    const participantData = participants.map(participantId => ({
      room_id: roomId,
      user_id: participantId,
      role: 'member'
    }));

    await ChatParticipant.bulkCreate(participantData, { ignoreDuplicates: true });

    const updatedRoom = await ChatRoom.findByPk(roomId, {
      include: [
        {
          model: ChatParticipant,
          where: { is_active: true },
          include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'email'] }]
        }
      ]
    });

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const orgId = req.user.org_id;

    const unreadCounts = await ChatParticipant.findAll({
      where: { user_id: userId, is_active: true },
      include: [
        {
          model: ChatRoom,
          where: { org_id: orgId, is_active: true },
          include: [
            {
              model: ChatMessage,
              where: {
                created_at: {
                  [Op.gt]: ChatParticipant.sequelize.col('ChatParticipant.last_read_at')
                }
              },
              required: false
            }
          ]
        }
      ]
    });

    const result = unreadCounts.map(participant => ({
      roomId: participant.room_id,
      unreadCount: participant.ChatRoom.ChatMessages.length
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChatRooms,
  createChatRoom,
  getChatMessages,
  sendMessage,
  getChatRoomDetails,
  addParticipants,
  getUnreadCount
};