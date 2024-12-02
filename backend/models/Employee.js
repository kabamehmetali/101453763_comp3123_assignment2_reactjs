// models/Employee.js

const mongoose = require('mongoose');

// Define the Employee Schema
const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Email address is invalid'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [30000, 'Salary must be at least 30,000'],
    },
    dateOfHire: {
      type: Date,
      required: [true, 'Date of hire is required'],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Resigned'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', EmployeeSchema);
