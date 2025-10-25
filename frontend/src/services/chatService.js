const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

const chatService = {
  // Get all chat rooms
  getChatRooms: async () => {
    const response = await fetch(`${API_BASE_URL}/chat/rooms`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create a new chat room
  createChatRoom: async (roomData) => {
    const response = await fetch(`${API_BASE_URL}/chat/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData)
    });
    return handleResponse(response);
  },

  // Get chat room details
  getChatRoomDetails: async (roomId) => {
    const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get messages for a room
  getChatMessages: async (roomId, page = 1, limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Send a message
  sendMessage: async (roomId, messageData) => {
    const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData)
    });
    return handleResponse(response);
  },

  // Add participants to room
  addParticipants: async (roomId, participants) => {
    const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/participants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ participants })
    });
    return handleResponse(response);
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await fetch(`${API_BASE_URL}/chat/unread-count`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export default chatService;