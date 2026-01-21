const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { registerValidation, storeValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/dashboard', async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await db.query('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await db.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/stores', storeValidation, async (req, res) => {
  try {
    const { name, email, address, ownerName, ownerEmail, ownerPassword } = req.body;

    const [existingStores] = await db.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existingStores.length > 0) {
      return res.status(400).json({ message: 'Store email already exists' });
    }

    await db.query('START TRANSACTION');

    try {
      const [storeResult] = await db.query(
        'INSERT INTO stores (name, email, address) VALUES (?, ?, ?)',
        [name, email, address]
      );

      const storeId = storeResult.insertId;

      if (ownerName && ownerEmail && ownerPassword) {
        const hashedPassword = await bcrypt.hash(ownerPassword, 10);
        const [ownerResult] = await db.query(
          'INSERT INTO users (name, email, password, address, role, store_id) VALUES (?, ?, ?, ?, ?, ?)',
          [ownerName, ownerEmail, hashedPassword, address, 'store_owner', storeId]
        );

        await db.query('UPDATE stores SET owner_id = ? WHERE id = ?', [ownerResult.insertId, storeId]);
      }

      await db.query('COMMIT');
      res.status(201).json({ message: 'Store created successfully', storeId });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Create store error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Owner email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

router.get('/stores', async (req, res) => {
  try {
    const { sortBy = 'name', order = 'ASC', name, email, address } = req.query;
    
    let query = `
      SELECT s.*, 
        COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id';
    
    const validSortColumns = ['name', 'email', 'address', 'rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', registerValidation, async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { sortBy = 'name', order = 'ASC', name, email, address, role } = req.query;
    
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
        CASE 
          WHEN u.role = 'store_owner' THEN COALESCE(AVG(r.rating), 0)
          ELSE NULL 
        END as rating
      FROM users u
      LEFT JOIN ratings r ON u.store_id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    query += ' GROUP BY u.id';
    
    const validSortColumns = ['name', 'email', 'address', 'role'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    query += ` ORDER BY u.${sortColumn} ${sortOrder}`;

    const [users] = await db.query(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
        CASE 
          WHEN u.role = 'store_owner' THEN COALESCE(AVG(r.rating), 0)
          ELSE NULL 
        END as rating
      FROM users u
      LEFT JOIN ratings r ON u.store_id = r.store_id
      WHERE u.id = ?
      GROUP BY u.id`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;