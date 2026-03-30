const Task = require('../models/Task');

exports.createTask = async (data) => {
  return await Task.create(data);
};

exports.getAllTasks = async () => {
  return await Task.findAll({ order: [['createdAt', 'DESC']] });
};

exports.getTaskById = async (id) => {
  return await Task.findByPk(id);
};

exports.updateTask = async (id, data) => {
  const task = await Task.findByPk(id);
  if (!task) return null;
  return await task.update(data);
};

exports.deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) return false;
  await task.destroy();
  return true;
};
