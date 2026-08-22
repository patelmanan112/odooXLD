export const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Middleware]', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred on the server'
      : message
  });
};
