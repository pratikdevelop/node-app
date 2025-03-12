const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  // Handle specific error types
  if (err instanceof ApiError) {
    return res.status(err.statusCode).render('error', {
      message: err.message,
      statusCode: err.statusCode
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).render('error', {
      message: 'Invalid token',
      statusCode: 401
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).render('error', {
      message: err.message,
      statusCode: 400
    });
  }

  // Handle multer file upload errors
  if (err.name === 'MulterError') {
    return res.status(400).render('error', {
      message: err.message,
      statusCode: 400
    });
  }

  // Generic server error
  res.status(500).render('error', {
    message: 'Something went wrong',
    statusCode: 500
  });
};

module.exports = errorHandler;