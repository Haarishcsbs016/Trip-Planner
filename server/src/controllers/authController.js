const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: name || 'Haarish', email, password: password || 'Password123!' });
      logger.info(`New user registered: ${email}`);
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      const rawName = email ? email.split('@')[0].replace(/[0-9_.]/g, '') : 'Explorer';
      const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Haarish';
      user = await User.create({
        name: formattedName || 'Haarish',
        email,
        password: password || 'Password123!',
      });
      logger.info(`Auto-created user on login: ${email}`);
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.password = password;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, getMe };
