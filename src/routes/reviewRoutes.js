import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// Retrieve all reviews or create a new review (protected)
router.route('/')
  .get(getAllReviews)
  .post(protect, createReview);

// Retrieve, update, or delete a specific review by ID (protected for modifications)
router.route('/:id')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
