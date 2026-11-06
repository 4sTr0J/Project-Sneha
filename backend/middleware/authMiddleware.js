const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sequelize } = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Direct support for demo/guest token
            if (token === 'demo-token' || token === 'demo') {
                req.user = {
                    id: 'demo-user',
                    _id: 'demo-user',
                    name: 'Guest User',
                    email: 'guest@example.com'
                };
                return next();
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            try {
                req.user = await User.findById(decoded.id).select('-password');
            } catch (err) {
                // MongoDB unavailable; try SQLite
                try {
                    const [sqliteUser] = await sequelize.query('SELECT id, name, email FROM Users WHERE id = ?', {
                        replacements: [decoded.id]
                    });
                    if (sqliteUser && sqliteUser.length > 0) {
                        req.user = sqliteUser[0];
                    }
                } catch (sqlErr) {
                    // Ignore SQLite error
                }
            }

            // Fallback for demo/guest token or when DB user not found
            if (!req.user) {
                req.user = {
                    id: decoded.id || 'demo-user',
                    _id: decoded.id || 'demo-user',
                    name: 'Guest User',
                    email: 'guest@example.com'
                };
            }

            return next();
        } catch (error) {
            console.error('Auth protect error:', error.message);
            return res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
