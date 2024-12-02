// controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * @desc    User Sign Up
 * @route   POST /api/users/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  // Validate request body inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if user already exists by email or username
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Save the user (password hashing is handled in the User model)
    await user.save();

    // Prepare JWT payload
    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
          },
        });
      }
    );
  } catch (err) {
    console.error('Error in signup:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    User Login
 * @route   POST /api/users/login
 * @access  Public
 */
exports.login = async (req, res) => {
  // Validate request body inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select('+password'); // Include password field

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare provided password with hashed password in database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Prepare JWT payload
    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
          },
        });
      }
    );
  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).send('Server Error');
  }
};
