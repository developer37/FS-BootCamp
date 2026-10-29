// Authentication Middleware
// This middleware verifies JWT tokens and protects routes.
// Authentication = "who are you?" (identity check)
// It reads the Authorization header, checks the token, and then attaches the
// decoded user payload to the request so downstream handlers can safely use it.

const jwt = require('jsonwebtoken');
require("dotenv").config();

// Secret key for JWT verification. Keep this aligned with the value used when
// issuing tokens in the auth controller so login/register flows work reliably.
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Authentication middleware function
function authenticateToken(request, response, next) {
  // Step 1: Get the Authorization header from the request
  const authHeader = request.headers.authorization;

  // Step 2: Extract the token from "Bearer TOKEN" format
  const token = authHeader && authHeader.split(' ')[1];

  // Step 3: Check if token was provided
  if (!token) {
    return response.status(401).json({
      error: 'Access token required'
    });
  }

  // Step 4: Verify the token using the secret key
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Step 5: Attach the decoded user data to the request object
    // The token now contains userId, username, roleId, and roleName
    request.user = decoded;

    // Step 6: Continue to the next middleware or route handler
    next();

  } catch (error) {
    // Handle different types of token errors
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'Token expired. Please login again.'
      });
    }

    return response.status(403).json({
      error: 'Invalid token'
    });
  }
}

// Export the middleware so it can be used in routes
module.exports = authenticateToken;
