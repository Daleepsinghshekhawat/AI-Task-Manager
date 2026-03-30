const request = require("supertest");
const app = require("../index");
const sequelize = require("../config/database");
const Task = require("../models/Task");

beforeAll(async () => {
  // force:true wipes existing tables and recreates them cleanly for tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Task API Endpoints", () => {
  let createdTaskId;

  // CREATE TESTS
  describe("POST /api/tasks", () => {
    it("should create a new task successfully", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "Learn Node.js",
        description: "Complete the tutorial",
        priority: "High",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toEqual("Learn Node.js");
      expect(res.body.completed).toEqual(false);
      createdTaskId = res.body.id;
    });

    it("should fail to create a task with missing title", async () => {
      const res = await request(app).post("/api/tasks").send({
        description: "No title provided",
        priority: "Medium",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("Validation failed");
    });

    it("should fail if title is whitespace only", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "   ",
        priority: "Medium",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("Validation failed");
    });

    it("should fail with invalid priority", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "Test Task",
        priority: "Invalid",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("Validation failed");
    });
  });

  // READ TESTS
  describe("GET /api/tasks", () => {
    it("should list all tasks", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // UPDATE TESTS
  describe("PUT /api/tasks/:id", () => {
    it("should update an existing task", async () => {
      const res = await request(app).put(`/api/tasks/${createdTaskId}`).send({
        title: "Updated Task Title",
        priority: "Low",
        completed: true,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual("Updated Task Title");
      expect(res.body.priority).toEqual("Low");
      expect(res.body.completed).toEqual(true);
    });

    it("should update only the completed status (partial update)", async () => {
      // Create a new task for this test
      const createRes = await request(app).post("/api/tasks").send({
        title: "Task to toggle",
        description: "Test partial update",
        priority: "High",
      });

      const taskId = createRes.body.id;

      // Update only the completed field
      const res = await request(app).put(`/api/tasks/${taskId}`).send({
        completed: true,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.completed).toEqual(true);
      expect(res.body.title).toEqual("Task to toggle"); // Should remain unchanged
      expect(res.body.priority).toEqual("High"); // Should remain unchanged
    });

    it("should fail to update with invalid task ID", async () => {
      const res = await request(app).put("/api/tasks/invalid-id").send({
        title: "Test",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain("Invalid task ID");
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app).put("/api/tasks/9999").send({
        title: "Non-existent",
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual("Task not found");
    });
  });

  // DELETE TESTS
  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task successfully", async () => {
      // First create a task to delete
      const createRes = await request(app).post("/api/tasks").send({
        title: "Task to Delete",
        priority: "Medium",
      });

      const taskIdToDelete = createRes.body.id;

      const res = await request(app).delete(`/api/tasks/${taskIdToDelete}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("deleted successfully");
    });

    it("should fail to delete with invalid task ID", async () => {
      const res = await request(app).delete("/api/tasks/invalid-id");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain("Invalid task ID");
    });

    it("should return 404 when deleting non-existent task", async () => {
      const res = await request(app).delete("/api/tasks/9999");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual("Task not found");
    });
  });

  // AI SUGGESTION TESTS
  describe("POST /api/tasks/ai-suggest", () => {
    it("should return AI suggestions for a task", async () => {
      const res = await request(app).post("/api/tasks/ai-suggest").send({
        title: "Urgent bug fix",
        description: "Fix the critical issue impacting users",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("priority");
      expect(res.body).toHaveProperty("estimatedCompletionTime");
      expect(res.body.priority).toEqual("High");
    });

    it("should suggest Low priority for low-urgency tasks", async () => {
      const res = await request(app).post("/api/tasks/ai-suggest").send({
        title: "Someday maybe read articles",
        description: "",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.priority).toEqual("Low");
    });

    it("should fail without a title", async () => {
      const res = await request(app).post("/api/tasks/ai-suggest").send({
        description: "Missing title",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain("Title is required");
    });

    it("should fail if title is whitespace only", async () => {
      const res = await request(app).post("/api/tasks/ai-suggest").send({
        title: "   ",
        description: "Test",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain("Title is required");
    });
  });
});
