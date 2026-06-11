const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
  return { accessToken, refreshToken };
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: user.toJSON(),
      mustResetPassword: user.mustResetPassword,
    });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ errorCode: 'NO_TOKEN', message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ errorCode: 'INVALID_TOKEN', message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ errorCode: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// PUT /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = req.user;

    // Password policy: min 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        errorCode: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters with one uppercase letter and one number',
      });
    }

    user.password = newPassword;
    user.mustResetPassword = false;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { login, refresh, logout, resetPassword, getMe };
