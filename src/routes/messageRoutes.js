import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
      return res
        .status(400)
        .json({ message: 'recipientId and content are required' });
    }

    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
});

// @desc    Get a single message by ID
// @route   GET /api/messages/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    next(error);
  }
});

// @desc    Get conversation between authenticated user and another user
// @route   GET /api/messages/conversation/:userId
// @access  Private
router.get('/conversation/:userId', protect, async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .exec();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a message (only sender can delete)
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user.id,
    });
    if (!message) {
      return res
        .status(404)
        .json({ message: 'Message not found or not authorized' });
    }
    await message.remove();
    res.json({ message: 'Message removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
