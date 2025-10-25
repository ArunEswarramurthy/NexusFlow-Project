import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, Image, Mic, Circle, File, Download, Play, Pause, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const WorkingChat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Helper functions - defined early to avoid hoisting issues
  const getUserName = (u) => {
    const firstName = u.first_name || u.firstName || '';
    const lastName = u.last_name || u.lastName || '';
    return `${firstName} ${lastName}`.trim() || u.email || 'Unknown User';
  };

  const getInitials = (u) => {
    const firstName = u.first_name || u.firstName || '';
    const lastName = u.last_name || u.lastName || '';
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    return initials || (u.email?.[0] || 'U').toUpperCase();
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const getLastMessage = (userId) => {
    const userMessages = messages[userId] || [];
    const lastMsg = userMessages[userMessages.length - 1];
    if (!lastMsg) return 'No messages yet';
    return lastMsg.text.length > 30 ? `${lastMsg.text.substring(0, 30)}...` : lastMsg.text;
  };

  const getLastMessageTime = (userId) => {
    const userMessages = messages[userId] || [];
    const lastMsg = userMessages[userMessages.length - 1];
    if (!lastMsg) return '';
    return new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadUsers();
    setOnlineUsers(new Set([1, 2]));
    
    // Check if mobile/tablet
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setShowSidebar(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.users) {
        const filteredUsers = data.users.filter(u => u.id !== user?.userId && u.id !== user?.id);
        setUsers(filteredUsers);
        
        // Initialize empty message arrays for all users
        const initialMessages = {};
        filteredUsers.forEach(u => {
          initialMessages[u.id] = [];
        });
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load team members');
    }
  };

  const startChat = (selectedUser) => {
    setActiveChat(selectedUser);
    if (!messages[selectedUser.id]) {
      setMessages(prev => ({ ...prev, [selectedUser.id]: [] }));
    }
    // Hide sidebar on mobile when chat starts
    if (isMobile) setShowSidebar(false);
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  const sendMessage = (messageData = null) => {
    if (!activeChat) return;
    if (!messageData && !newMessage.trim()) return;

    const message = messageData || {
      id: Date.now(),
      text: newMessage.trim(),
      type: 'text',
      sender: user?.userId || user?.id,
      senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      timestamp: new Date(),
      isOwn: true,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), message]
    }));

    if (!messageData) setNewMessage('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: prev[activeChat.id].map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);

    // Auto-reply for demo
    if (activeChat.id === 1 || activeChat.id === 2) {
      setTimeout(() => {
        const autoReply = {
          id: Date.now() + 1,
          text: getAutoReply(message.text || 'file'),
          type: 'text',
          sender: activeChat.id,
          senderName: getUserName(activeChat),
          timestamp: new Date(),
          isOwn: false,
          status: 'delivered'
        };
        
        setMessages(prev => ({
          ...prev,
          [activeChat.id]: [...(prev[activeChat.id] || []), autoReply]
        }));
      }, 2000);
    }
  };

  const getAutoReply = (message) => {
    const replies = [
      "Thanks for your message! I'll get back to you soon.",
      "Got it! Let me check on that.",
      "Sure thing! I'll take care of it.",
      "Thanks for the update!",
      "Sounds good to me!",
      "I'll review this and get back to you."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const message = {
      id: Date.now(),
      text: file.name,
      type: 'file',
      fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      fileType: file.type,
      sender: user?.userId || user?.id,
      senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      timestamp: new Date(),
      isOwn: true,
      status: 'sent'
    };

    sendMessage(message);
    toast.success('File uploaded successfully');
    e.target.value = '';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const message = {
        id: Date.now(),
        text: file.name,
        type: 'image',
        imageUrl: event.target.result,
        sender: user?.userId || user?.id,
        senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        timestamp: new Date(),
        isOwn: true,
        status: 'sent'
      };

      sendMessage(message);
      toast.success('Image shared successfully');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        
        const message = {
          id: Date.now(),
          text: `Voice message (${recordingTime}s)`,
          type: 'voice',
          audioUrl,
          duration: recordingTime,
          sender: user?.userId || user?.id,
          senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          timestamp: new Date(),
          isOwn: true,
          status: 'sent'
        };

        sendMessage(message);
        toast.success('Voice message sent');
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      recorder.onstop = () => {
        clearInterval(timer);
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        
        const message = {
          id: Date.now(),
          text: `Voice message (${recordingTime}s)`,
          type: 'voice',
          audioUrl,
          duration: recordingTime,
          sender: user?.userId || user?.id,
          senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          timestamp: new Date(),
          isOwn: true,
          status: 'sent'
        };

        sendMessage(message);
        toast.success('Voice message sent');
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const MessageContent = ({ msg }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    switch (msg.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img 
              src={msg.imageUrl} 
              alt={msg.text}
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(msg.imageUrl, '_blank')}
            />
            <p className="text-xs mt-1 opacity-75">{msg.text}</p>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg max-w-xs">
            <File className="w-8 h-8 text-primary-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{msg.text}</p>
              <p className="text-xs text-gray-500">{msg.fileSize}</p>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        );
      case 'voice':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg max-w-xs">
            <button 
              onClick={toggleAudio}
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 bg-primary-300 rounded-full" style={{height: Math.random() * 20 + 10}}></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{msg.duration}s</p>
            </div>
            <audio 
              ref={audioRef}
              src={msg.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        );
      default:
        return <p className="text-sm leading-relaxed">{msg.text}</p>;
    }
  };

  const filteredUsers = users.filter(u => {
    const name = getUserName(u).toLowerCase();
    const email = (u.email || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'} ${showSidebar ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'hidden'} w-72 sm:w-80 md:w-72 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}>
        {/* Header */}
        <div className="p-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Team Chat</h1>
            {isMobile && (
              <button 
                onClick={() => setShowSidebar(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No team members found</p>
            </div>
          ) : (
            filteredUsers.map((u, index) => (
              <div
                key={`user-${u.id}-${index}`}
                onClick={() => startChat(u)}
                className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-white border-l-3 ${
                  activeChat?.id === u.id 
                    ? 'bg-white border-l-primary-500' 
                    : 'border-l-transparent hover:border-l-gray-300'
                }`}
              >
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(u)}
                  </div>
                  {isUserOnline(u.id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate text-sm">{getUserName(u)}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {isUserOnline(u.id) ? 'Online' : getLastMessage(u.id)}
                  </p>
                </div>
                {messages[u.id] && messages[u.id].length > 0 && (
                  <div className="text-xs text-gray-400">
                    {getLastMessageTime(u.id)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Team Chat</h2>
              <p className="text-gray-600">Select a colleague from the sidebar to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center min-w-0">
                {isMobile && (
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg mr-2 md:hidden"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
                <div className="relative mr-3 flex-shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    {getInitials(activeChat)}
                  </div>
                  {isUserOnline(activeChat.id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{getUserName(activeChat)}</h3>
                  <p className={`text-xs flex items-center ${
                    isUserOnline(activeChat.id) ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    <Circle className={`w-1.5 h-1.5 mr-1 flex-shrink-0 ${
                      isUserOnline(activeChat.id) ? 'fill-green-500' : 'fill-gray-400'
                    }`} />
                    {isUserOnline(activeChat.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 flex-shrink-0">
                <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hidden sm:block">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hidden sm:block">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 bg-gray-50">
              {!messages[activeChat.id] || messages[activeChat.id].length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">No messages yet</p>
                  <p className="text-gray-500">Start the conversation with {getUserName(activeChat)}!</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages[activeChat.id].map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${
                        msg.isOwn ? 'order-2' : 'order-1'
                      }`}>
                        {!msg.isOwn && (
                          <p className="text-xs text-gray-500 mb-1 px-2 sm:px-3">{msg.senderName}</p>
                        )}
                        <div className={`px-3 sm:px-4 py-2 rounded-2xl shadow-sm ${
                          msg.isOwn 
                            ? 'bg-primary-500 text-white rounded-br-sm' 
                            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                        }`}>
                          <MessageContent msg={msg} />
                        </div>
                        <div className={`flex items-center mt-1 px-2 sm:px-3 ${
                          msg.isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <p className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {msg.isOwn && (
                            <span className={`ml-2 text-xs ${
                              msg.status === 'delivered' ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {msg.status === 'delivered' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-2 sm:p-3 bg-white border-t border-gray-200">
              {isRecording && (
                <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium text-sm">Recording... {recordingTime}s</span>
                  </div>
                  <button 
                    onClick={stopRecording}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hidden sm:block"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Image className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${getUserName(activeChat)}...`}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200 text-sm pr-10"
                    disabled={isRecording}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-primary-600 rounded-full transition-all duration-200 hidden sm:block">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                {newMessage.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="p-2 sm:p-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
              />
              <input
                ref={imageInputRef}
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkingChat;