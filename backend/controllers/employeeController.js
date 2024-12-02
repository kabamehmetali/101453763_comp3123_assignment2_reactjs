// controllers/employeeController.js

const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a New Employee
 * @route   POST /api/employees
 * @access  Private
 */
exports.createEmployee = async (req, res) => {
  // Validate request body inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      dateOfHire,
      manager,
      status,
    } = req.body;

    // Check if employee already exists by employeeId or email
    let employee = await Employee.findOne({
      $or: [{ employeeId }, { email }],
    });
    if (employee) {
      return res.status(400).json({ msg: 'Employee already exists' });
    }

    // Create a new employee instance
    employee = new Employee({
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      dateOfHire,
      manager,
      status,
    });

    // Save the employee to the database
    await employee.save();

    res.status(201).json({ employee });
  } catch (err) {
    console.error('Error in createEmployee:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get All Employees
 * @route   GET /api/employees
 * @access  Private
 */
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      'manager',
      'firstName lastName employeeId'
    );
    res.json({ employees });
  } catch (err) {
    console.error('Error in getEmployees:', err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get Employee By ID
 * @route   GET /api/employees/:id
 * @access  Private
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      'manager',
      'firstName lastName employeeId'
    );
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json({ employee });
  } catch (err) {
    console.error('Error in getEmployeeById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Update Employee
 * @route   PUT /api/employees/:id
 * @access  Private
 */
exports.updateEmployee = async (req, res) => {
  // Validate request body inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedData = { ...req.body };

    // Find employee by ID and update
    let employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json({ employee });
  } catch (err) {
    console.error('Error in updateEmployee:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete Employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
exports.deleteEmployee = async (req, res) => {
  try {
    // Find employee by ID and remove
    let employee = await Employee.findByIdAndRemove(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error('Error in deleteEmployee:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Search Employees
 * @route   GET /api/employees/search
 * @access  Private
 */
exports.searchEmployees = async (req, res) => {
  try {
    const { department, position } = req.query;
    const query = {};

    if (department) {
      query.department = department;
    }
    if (position) {
      query.position = position;
    }

    const employees = await Employee.find(query);
    res.json({ employees });
  } catch (err) {
    console.error('Error in searchEmployees:', err.message);
    res.status(500).send('Server Error');
  }
};
