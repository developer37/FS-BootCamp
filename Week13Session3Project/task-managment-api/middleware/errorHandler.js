// Centralized error handling for the API.
// This keeps route failures consistent and avoids repeating ad hoc response logic
// in each controller or middleware layer.

function notFoundHandler(request, response) {
  response.status(404).json({
    error: `Route ${request.originalUrl} not found`,
  });
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const statusCode =
    error.statusCode ||
    error.status ||
    (error.name === 'ValidationError' ? 400 : null) ||
    (error.name === 'UnauthorizedError' ? 401 : null) ||
    (error.name === 'ForbiddenError' ? 403 : null) ||
    (error.name === 'NotFoundError' ? 404 : null) ||
    500;

  const message = error.message || 'Something went wrong. Please try again later.';

  if (statusCode >= 500) {
    console.error('Unhandled API error:', error);
  }

  response.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && error.stack ? { stack: error.stack } : {}),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
