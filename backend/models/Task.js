const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium',
    allowNull: false,
    validate: {
      isIn: [['Low', 'Medium', 'High']],
    }
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Task;
