const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  targetRole: {
    type: String,
    required: true, // 'Admin', 'User'
  },
  targetUserId: {
    type: String,
    required: true, // 'ALL' or specific user ID
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['success', 'info', 'warning', 'error'],
    default: 'info',
  },
  read: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
