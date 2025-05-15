const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Issue = sequelize.define('Issue', {
  // Existing fields
  deviceId: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  complaintType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // New title field, optional if needed
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // priorityLevel renamed or add a new priority ENUM
  priorityLevel: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    allowNull: false
  },
  // attachment (optional)
  attachment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  underWarranty: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved', 'Rejected', 'Open', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['deviceId'] },
    { fields: ['submittedAt'] }
  ]
});

module.exports = Issue;
