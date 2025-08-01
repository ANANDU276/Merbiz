// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header (support both "x-auth-token" and "Authorization: Bearer")
  // The 'Bearer ' prefix is removed to get the raw token string
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // CRITICAL FIX: Use the environment variable for the secret key
    // This must match the key used to sign the token in your login/register routes
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    // Attach the decoded user payload to the request object
    req.user = { id: decoded.userId }; 

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails for any reason (e.g., expired token, bad signature),
    // send a 401 Unauthorized response.
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};