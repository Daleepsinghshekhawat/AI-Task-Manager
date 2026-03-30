const express = require("express");
const router = express.Router();
const taskService = require("../services/taskService");
const aiService = require("../services/aiService");
const logger = require("../config/logger");
const { createTaskSchema, updateTaskSchema } = require("../schemas/taskSchema");

// Express middleware for Zod validation
const validateRequest = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    // Replace req.body with validated and sanitized data
    req.body = validatedData;
    next();
  } catch (error) {
    logger.warn("VALIDATION", "Request validation failed", {
      errors: error.errors,
    });
    return res
      .status(400)
      .json({ error: "Validation failed", details: error.errors });
  }
};

// Async error wrapper to catch all unhandled promise rejections
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error("ROUTE_ERROR", `Error in ${req.method} ${req.path}`, {
      error: err.message,
    });
    next(err);
  });
};

// Validate ID parameter is numeric
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid task ID. Must be a positive integer." });
  }
  next();
};

// 1. GET /api/tasks (list all tasks)
router.get(
  "/",
  catchAsync(async (req, res) => {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  }),
);

// 2. POST /api/tasks (create new task)
router.post(
  "/",
  validateRequest(createTaskSchema),
  catchAsync(async (req, res) => {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
  }),
);

// 5. POST /api/tasks/ai-suggest (MUST be before /:id routes to avoid Express matching it as /:id)
router.post(
  "/ai-suggest",
  catchAsync(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required and cannot be empty or whitespace.",
      });
    }

    const suggestion = aiService.suggestTaskMetadata(
      title.trim(),
      description?.trim() || "",
    );
    res.json(suggestion);
  }),
);

// 3. PUT /api/tasks/:id (update existing task)
router.put(
  "/:id",
  validateIdParam,
  validateRequest(updateTaskSchema),
  catchAsync(async (req, res) => {
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  }),
);

// 4. DELETE /api/tasks/:id (delete task)
router.delete(
  "/:id",
  validateIdParam,
  catchAsync(async (req, res) => {
    const success = await taskService.deleteTask(req.params.id);
    if (!success) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  }),
);

module.exports = router;
