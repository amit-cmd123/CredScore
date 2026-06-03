const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  risk: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'More Info Required'],
    default: 'Pending',
  },
  date: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    default: '',
  },
  tenure: {
    type: String,
    default: '',
  },
  interestRate: {
    type: Number,
    default: 0,
  },
  income: {
    type: Number,
    default: 0,
  },
  employment: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
