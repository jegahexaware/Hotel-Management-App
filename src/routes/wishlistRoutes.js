import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all wishlist items for the authenticated user
router.get('/', protect, async (req, res, next) => {
  try {
    const items = await Wishlist.find({ user: req.user.id });
    res.json(items);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

// Add a new accommodation to the wishlist
router.post('/', protect, async (req, res, next) => {
  try {
    const { accommodation } = req.body;
    if (!accommodation) {
      const err = new Error('Accommodation ID is required');
      err.status = 400;
      throw err;
    }
    const exists = await Wishlist.findOne({ user: req.user.id, accommodation });
    if (exists) {
      const err = new Error('Accommodation already in wishlist');
      err.status = 400;
      throw err;
    }
    const newItem = await Wishlist.create({ user: req.user.id, accommodation });
    res.status(201).json(newItem);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

// Remove an item from the wishlist
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) {
      const err = new Error('Wishlist item not found');
      err.status = 404;
      throw err;
    }
    res.json({ message: 'Wishlist item removed' });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

export default router;
