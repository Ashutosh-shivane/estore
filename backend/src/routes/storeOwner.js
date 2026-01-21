const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('store_owner'));

router.get('/dashboard', async (req, res) => {
  try {
    const storeId = req.user.storeId;

    if (!storeId) {
      return res.status(400).json({ message: 'No store associated with this account' });
    }

    const [ratingData] = await db.query(
      'SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_ratings FROM ratings WHERE store_id = ?',
      [storeId]
    );

    const [ratings] = await db.query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
        u.id as user_id, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.updated_at DESC`,
      [storeId]
    );

    res.json({
      averageRating: parseFloat(ratingData[0].average_rating).toFixed(2),
      totalRatings: ratingData[0].total_ratings,
      ratings
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/store', async (req, res) => {
  try {
    const storeId = req.user.storeId;

    if (!storeId) {
      return res.status(400).json({ message: 'No store associated with this account' });
    }

    const [stores] = await db.query(
      `SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id`,
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(stores[0]);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;