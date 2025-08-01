// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from header (support both "x-auth-token" and "Authorization: Bearer")
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", ""); // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // VERIFY TOKEN USING THE ENVIRONMENT VARIABLE
    // Make sure to use the same secret key that was used to sign the token.
    // This key should be loaded from your .env file.
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Attach the decoded user payload to the request object

    req.user = { id: decoded.userId }; // Proceed to the next middleware or route handler

    next();
  } catch (err) {
    // If token verification fails, return a 401 error.
    // The error could be 'jwt expired', 'invalid signature', etc.
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
