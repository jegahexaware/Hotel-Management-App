import { Router } from 'express';
import Accommodation from '../models/Accommodation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateAccommodation } from '../utils/validator.js';
import logger from '../utils/logger.js';

const router = Router();

// Get all accommodations
router.get('/', async (req, res, next) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json(accommodations);
  } catch (error) {
    logger.error('Error fetching accommodations', error);
    next(error);
  }
});

// Search accommodations by query parameters (e.g., city, price range)
router.get('/search', async (req, res, next) => {
  try {
    const query = {};
    if (req.query.city) query.city = { $regex: req.query.city, $options: 'i' };
    if (req.query.minPrice) query.price = { ...query.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) query.price = { ...query.price, $lte: Number(req.query.maxPrice) };
    const results = await Accommodation.find(query);
    res.status(200).json(results);
  } catch (error) {
    logger.error('Error searching accommodations', error);
    next(error);
  }
});

// Create a new accommodation (protected)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = validateAccommodation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const accommodation = new Accommodation({ ...value, owner: req.user.id });
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (error) {
    logger.error('Error creating accommodation', error);
    next(error);
  }
});

// Get a single accommodation by ID
router.get('/:id', async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.status(200).json(accommodation);
  } catch (error) {
    logger.error('Error fetching accommodation', error);
    next(error);
  }
});

// Update an accommodation (protected, only owner can update)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    if (accommodation.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }
    const { error, value } = validateAccommodation(req.body, { partial: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    Object.assign(accommodation, value);
    await accommodation.save();
    res.status(200).json(accommodation);
  } catch (error) {
    logger.error('Error updating accommodation', error);
    next(error);
  }
});

// Delete an accommodation (protected, only owner can delete)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    if (accommodation.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }
    await accommodation.remove();
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting accommodation', error);
    next(error);
  }
});

export default router;
