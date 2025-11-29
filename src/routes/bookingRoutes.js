import express from 'express';
import { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new booking
router.post('/', protect, async (req, res, next) => {
  try {
    const booking = await createBooking({ ...req.body, userId: req.user.id });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// Get all bookings for the authenticated user
router.get('/', protect, async (req, res, next) => {
  try {
    const bookings = await getBookings(req.user.id);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// Get a single booking by ID (must belong to the user)
router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id, req.user.id);
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Update a booking (owner only)
router.put('/:id', protect, async (req, res, next) => {
  try {
    const updated = await updateBooking(req.params.id, req.body, req.user.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a booking (owner only)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await deleteBooking(req.params.id, req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
