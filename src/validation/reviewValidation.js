const Joi = require('joi');

const createReviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be at least 1 star',
            'number.max': 'Rating cannot exceed 5 stars',
            'any.required': 'Rating is required'
        }),

    comment: Joi.string()
        .allow('')
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Comment cannot exceed 1000 characters'
        })
});

const validateCreateReview = (data) => {
    const { error, value } = createReviewSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const validationError = new Error('Validation failed');
        validationError.name = 'ValidationError';
        validationError.details = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        throw validationError;
    }

    return value;
};

module.exports = {
    validateCreateReview,
    createReviewSchema
};

