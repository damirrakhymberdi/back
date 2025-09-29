const express = require('express');
const ReviewController = require('../controllers/reviewController');

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private (requires authentication)
 * @body    { rating: number(1-5), comment?: string }
 */
router.post('/', ReviewController.createReview);

/**
 * @route   GET /api/reviews/my
 * @desc    Get current user's reviews
 * @access  Private (requires authentication)
 * @query   { page?: number, limit?: number }
 */
router.get('/my', ReviewController.getMyReviews);

/**
 * @route   GET /api/reviews/stats
 * @desc    Get review statistics
 * @access  Private (requires authentication)
 */
router.get('/stats', ReviewController.getReviewStats);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get a specific review by ID
 * @access  Private (requires authentication)
 * @params  { id: number }
 */
router.get('/:id', ReviewController.getReviewById);

module.exports = router;

