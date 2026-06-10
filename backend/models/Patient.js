const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the patient\'s full name'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide the patient\'s age'],
    min: [0, 'Age must be a positive number'],
  },
  gender: {
    type: String,
    required: [true, 'Please specify the patient\'s gender'],
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a valid contact number'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
    trim: true,
  },
  symptoms: {
    type: String,
    required: [true, 'Please state the primary symptoms'],
    trim: true,
  },
  concern: {
    type: String,
    required: [true, 'Please provide a detailed health concern description'],
    trim: true,
  },
  aiSummary: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Patient', PatientSchema);
