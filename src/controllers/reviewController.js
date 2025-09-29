const Review = require('../models/Review');
const { validateCreateReview } = require('../validation/reviewValidation');

class ReviewController {
    /**
     * Create a new review
     * POST /api/reviews
     */
    static async createReview(req, res) {
        try {
            // Validate input data
            const validatedData = validateCreateReview(req.body);

            // Create review
            const review = await Review.create(
                req.user.id,
                validatedData.rating,
                validatedData.comment || null
            );

            res.status(201).json({
                success: true,
                message: 'Спасибо за отзыв!',
                data: {
                    review: review.toJSON()
                }
            });

        } catch (error) {
            console.error('Create review error:', error);

            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details
                });
            }

            // Handle database constraint errors
            if (error.code === '23505') { // Unique constraint violation
                return res.status(409).json({
                    success: false,
                    message: 'You have already submitted a review'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to create review'
            });
        }
    }

    /**
     * Get user's reviews
     * GET /api/reviews/my
     */
    static async getMyReviews(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const reviews = await Review.findByUserId(req.user.id, limit, offset);

            res.json({
                success: true,
                data: {
                    reviews: reviews.map(review => review.toJSON()),
                    pagination: {
                        page,
                        limit,
                        total: reviews.length
                    }
                }
            });

        } catch (error) {
            console.error('Get my reviews error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch reviews'
            });
        }
    }

    /**
     * Get review statistics (admin endpoint)
     * GET /api/reviews/stats
     */
    static async getReviewStats(req, res) {
        try {
            const stats = await Review.getStats();
            const distribution = await Review.getRatingDistribution();

            res.json({
                success: true,
                data: {
                    statistics: {
                        totalReviews: parseInt(stats.total_reviews),
                        averageRating: parseFloat(stats.average_rating || 0).toFixed(2),
                        reviewsWithComments: parseInt(stats.reviews_with_comments)
                    },
                    ratingDistribution: distribution.map(item => ({
                        rating: item.rating,
                        count: parseInt(item.count)
                    }))
                }
            });

        } catch (error) {
            console.error('Get review stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch review statistics'
            });
        }
    }

    /**
     * Get a specific review by ID
     * GET /api/reviews/:id
     */
    static async getReviewById(req, res) {
        try {
            const reviewId = parseInt(req.params.id);

            if (isNaN(reviewId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid review ID'
                });
            }

            const review = await Review.findById(reviewId);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            res.json({
                success: true,
                data: {
                    review: review.toJSON()
                }
            });

        } catch (error) {
            console.error('Get review by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch review'
            });
        }
    }
}

module.exports = ReviewController;

