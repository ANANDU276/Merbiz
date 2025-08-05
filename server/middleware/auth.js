// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header (support both "x-auth-token" and "Authorization: Bearer")
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Match the secret in login
    req.user = { id: decoded.userId }; // Align with login route's payload
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};