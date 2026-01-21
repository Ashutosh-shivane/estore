const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('user'));

router.get('/stores', async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT s.id, s.name, s.address, s.email,
        COALESCE(AVG(r.rating), 0) as overall_rating,
        ur.rating as user_rating,
        ur.id as user_rating_id
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id ORDER BY s.name';

    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/ratings', ratingValidation, async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const [stores] = await db.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [existingRatings] = await db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existingRatings.length > 0) {
      await db.query(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );
      res.json({ message: 'Rating updated successfully' });
    } else {
      await db.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, storeId, rating]
      );
      res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/ratings/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const [result] = await db.query(
      'DELETE FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;