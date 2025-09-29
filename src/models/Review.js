const { query } = require('../database/connection');

class Review {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.rating = data.rating;
        this.comment = data.comment;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    static async create(userId, rating, comment = null) {
        try {
            const result = await query(
                `INSERT INTO reviews (user_id, rating, comment) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
                [userId, rating, comment]
            );

            return new Review(result.rows[0]);
        } catch (error) {
            throw new Error(`Failed to create review: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const result = await query(
                'SELECT * FROM reviews WHERE id = $1',
                [id]
            );

            return result.rows.length > 0 ? new Review(result.rows[0]) : null;
        } catch (error) {
            throw new Error(`Failed to find review: ${error.message}`);
        }
    }

    static async findByUserId(userId, limit = 10, offset = 0) {
        try {
            const result = await query(
                `SELECT * FROM reviews 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            );

            return result.rows.map(row => new Review(row));
        } catch (error) {
            throw new Error(`Failed to find reviews by user: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const result = await query(`
        SELECT 
          COUNT(*) as total_reviews,
          AVG(rating) as average_rating,
          COUNT(CASE WHEN comment IS NOT NULL AND comment != '' THEN 1 END) as reviews_with_comments
        FROM reviews
      `);

            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to get review stats: ${error.message}`);
        }
    }

    static async getRatingDistribution() {
        try {
            const result = await query(`
        SELECT 
          rating,
          COUNT(*) as count
        FROM reviews 
        GROUP BY rating 
        ORDER BY rating
      `);

            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get rating distribution: ${error.message}`);
        }
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Review;

