const { validationResult } = require('express-validator');

// Runs after express-validator checks and returns errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: 'VALIDATION_ERROR',
      message: 'Validation failed',
      description: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validate };
