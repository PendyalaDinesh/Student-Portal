// Week 7 — Messaging controller
const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// Create a deterministic conversation ID from two user IDs
const getConversationId = (id1, id2) =>
  [id1, id2].sort().join('_');

// GET /api/messages — list conversations
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const conversations = await Message.aggregate([
    { $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }},
    { $sort: { createdAt: -1 } },
    { $group: {
        _id: '$conversation',
        lastMessage: { $first: '$$ROOT' },
        unread: { $sum: {
          $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$receiver', req.user._id] }] }, 1, 0],
        }},
    }},
    { $sort: { 'lastMessage.createdAt': -1 } },
  ]);

  // Populate users
  const populated = await Promise.all(
    conversations.map(async (conv) => {
      const otherId = conv.lastMessage.sender.toString() === userId
        ? conv.lastMessage.receiver
        : conv.lastMessage.sender;
      const other = await User.findById(otherId).select('name avatar');
      return { ...conv, otherUser: other };
    })
  );

  res.json(populated);
});

// GET /api/messages/:userId — get messages with a specific user
const getMessages = asyncHandler(async (req, res) => {
  const convId = getConversationId(req.user._id.toString(), req.params.userId);

  const messages = await Message.find({ conversation: convId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('post', 'title category');

  // Mark as read
  await Message.updateMany(
    { conversation: convId, receiver: req.user._id, read: false },
    { read: true }
  );

  res.json(messages);
});

// POST /api/messages — send message
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, text, postId } = req.body;

  if (receiverId === req.user._id.toString()) {
    res.status(400); throw new Error('Cannot message yourself');
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) { res.status(404); throw new Error('User not found'); }

  const convId = getConversationId(req.user._id.toString(), receiverId);

  const message = await Message.create({
    conversation: convId,
    sender:   req.user._id,
    receiver: receiverId,
    post:     postId || null,
    text,
  });

  await message.populate('sender', 'name avatar');
  res.status(201).json(message);
});

module.exports = { getConversations, getMessages, sendMessage };
