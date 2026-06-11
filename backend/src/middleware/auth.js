const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        errorCode: 'NO_TOKEN',
        message: 'Authentication required',
        description: 'No token provided in Authorization header',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        errorCode: 'INVALID_USER',
        message: 'User not found or deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        errorCode: 'TOKEN_EXPIRED',
        message: 'Token has expired',
      });
    }
    return res.status(401).json({
      errorCode: 'INVALID_TOKEN',
      message: 'Invalid token',
    });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        errorCode: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Force password reset check
const checkPasswordReset = (req, res, next) => {
  if (req.user.mustResetPassword && req.path !== '/reset-password') {
    return res.status(403).json({
      errorCode: 'PASSWORD_RESET_REQUIRED',
      message: 'You must reset your password before accessing this resource',
    });
  }
  next();
};

module.exports = { authenticate, authorize, checkPasswordReset };
