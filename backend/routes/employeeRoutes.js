// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require('../controllers/employeeController');
const auth = require('../middleware/authMiddleware');
const { check } = require('express-validator');

/**
 * @route   POST /api/employees
 * @desc    Create a new employee
 * @access  Private
 */
router.post(
  '/',
  auth,
  [
    check('employeeId', 'Employee ID is required').trim().notEmpty(),
    check('firstName', 'First name is required').trim().notEmpty(),
    check('lastName', 'Last name is required').trim().notEmpty(),
    check('email', 'Please include a valid email').trim().isEmail(),
    check('phone', 'Phone number must be 10 digits')
      .trim()
      .isLength({ min: 10, max: 10 })
      .isNumeric(),
    check('department', 'Department is required').trim().notEmpty(),
    check('position', 'Position is required').trim().notEmpty(),
    check('salary', 'Salary must be at least 30,000').isFloat({ min: 30000 }),
    check('dateOfHire', 'Date of hire is required').notEmpty().isISO8601(),
  ],
  createEmployee
);

/**
 * @route   GET /api/employees
 * @desc    Get all employees
 * @access  Private
 */
router.get('/', auth, getEmployees);

/**
 * @route   GET /api/employees/search
 * @desc    Search employees by department and/or position
 * @access  Private
 */
router.get('/search', auth, searchEmployees);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private
 */
router.get('/:id', auth, getEmployeeById);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update an employee
 * @access  Private
 */
router.put(
  '/:id',
  auth,
  [
    // Optional validation checks for updatable fields
    check('email', 'Please include a valid email').optional().trim().isEmail(),
    check('phone', 'Phone number must be 10 digits')
      .optional()
      .trim()
      .isLength({ min: 10, max: 10 })
      .isNumeric(),
    check('salary', 'Salary must be at least 30,000').optional().isFloat({ min: 30000 }),
    check('dateOfHire', 'Date of hire must be a valid date').optional().isISO8601(),
    // Add other optional checks as needed
  ],
  updateEmployee
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete an employee
 * @access  Private
 */
router.delete('/:id', auth, deleteEmployee);

module.exports = router;
