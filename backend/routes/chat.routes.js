const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticateToken);

// Chat room routes
router.get('/rooms', chatController.getChatRooms);
router.post('/rooms', chatController.createChatRoom);
router.get('/rooms/:roomId', chatController.getChatRoomDetails);
router.post('/rooms/:roomId/participants', chatController.addParticipants);

// Message routes
router.get('/rooms/:roomId/messages', chatController.getChatMessages);
router.post('/rooms/:roomId/messages', chatController.sendMessage);

// Utility routes
router.get('/unread-count', chatController.getUnreadCount);

module.exports = router;