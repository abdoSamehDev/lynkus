const ApiError = require('../utils/apiError');





const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  // Development Mode Error Handling
  if (process.env.NODE_ENV === 'development') {

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  } 
  else {
    //send for Production
    if (err.name === 'JsonWebTokenError') err = new ApiError('Invalid token, please login again.', 401);
    if (err.name === 'TokenExpiredError') err = new ApiError('Expired token, please login again.', 401);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

module.exports = globalError;
