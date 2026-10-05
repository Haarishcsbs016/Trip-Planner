const User = require('../models/User');
const Trip = require('../models/Trip');
const logger = require('../utils/logger');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const tripCount = await Trip.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      user,
      stats: { totalTrips: tripCount },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, travelStyle, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (travelStyle) user.travelStyle = travelStyle;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
