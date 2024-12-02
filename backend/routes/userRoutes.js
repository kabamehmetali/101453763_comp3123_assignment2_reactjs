// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { check } = require('express-validator');

/**
 * @route   POST /api/users/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  [
    check('firstName', 'First name is required').trim().notEmpty(),
    check('lastName', 'Last name is required').trim().notEmpty(),
    check('username', 'Username must be 4-20 characters')
      .trim()
      .isLength({ min: 4, max: 20 }),
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  signup
);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('username', 'Username or email is required').trim().notEmpty(),
    check('password', 'Password is required').exists(),
  ],
  login
);

module.exports = router;
