// Centralized error middleware keeps route handlers clean and standardizes API responses.
const errorHandler = (err, req, res, next) => {
  // Log the failed request details so developers can diagnose issues quickly.
  console.log("\n=== ERROR OCCURRED ===");
  console.log("Error message:", err.message);
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("Time:", new Date().toISOString());

  // Only log stack traces in non-production environments to avoid exposing internals.
  if (process.env.NODE_ENV !== "production") {
    console.log("Error stack:", err.stack);
  }
  console.log("=====================\n");

  // Apply default values, then override them for known validation and cast issues.
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Format a consistent JSON error payload for clients.
  const errorResponse = {
    error: {
      message: message,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  // Attach stack information during development so debugging is easier.
  if (process.env.NODE_ENV !== "production") {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
