# Task Manager API Documentation

## Overview

The Task Manager API is a RESTful service for managing tasks with AI-powered suggestions. All endpoints return JSON responses.

**Base URL:** `http://localhost:5000/api`

## Environment Setup

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file in the backend directory (copy from `.env.example`):

```
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
DB_PATH=./taskmanager.sqlite
```

### Starting the Server

```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload (requires nodemon)
```

---

## API Endpoints

### 1. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Description:** Retrieve all tasks, sorted by creation date (newest first).

**Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "title": "Learn React",
    "description": "Complete React fundamentals course",
    "priority": "High",
    "deadline": "2026-04-15T00:00:00.000Z",
    "completed": false,
    "createdAt": "2026-03-29T10:30:00.000Z",
    "updatedAt": "2026-03-29T10:30:00.000Z"
  }
]
```

---

### 2. Create a New Task

**Endpoint:** `POST /api/tasks`

**Description:** Create a new task with validation.

**Request Body:**

```json
{
  "title": "string (required, non-empty)",
  "description": "string (optional)",
  "priority": "Low | Medium | High (optional, defaults to Medium)",
  "deadline": "ISO 8601 date string (optional, cannot be past date)",
  "completed": "boolean (optional, defaults to false)"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build API documentation",
    "description": "Create comprehensive API docs",
    "priority": "High",
    "deadline": "2026-04-01"
  }'
```

**Success Response (201):**

```json
{
  "id": 2,
  "title": "Build API documentation",
  "description": "Create comprehensive API docs",
  "priority": "High",
  "deadline": "2026-04-01T00:00:00.000Z",
  "completed": false,
  "createdAt": "2026-03-29T11:00:00.000Z",
  "updatedAt": "2026-03-29T11:00:00.000Z"
}
```

**Validation Errors (400):**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "message": "Title must not be empty",
      "path": ["title"]
    }
  ]
}
```

---

### 3. Update a Task

**Endpoint:** `PUT /api/tasks/:id`

**Description:** Update an existing task. All fields are optional.

**Parameters:**

- `id` (path, required): Task ID (must be positive integer)

**Request Body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "Low | Medium | High (optional)",
  "deadline": "ISO 8601 date string (optional)",
  "completed": "boolean (optional)"
}
```

**Example Request:**

```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "priority": "Medium"
  }'
```

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Learn React",
  "description": "Complete React fundamentals course",
  "priority": "Medium",
  "deadline": "2026-04-15T00:00:00.000Z",
  "completed": true,
  "createdAt": "2026-03-29T10:30:00.000Z",
  "updatedAt": "2026-03-29T12:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid task ID format
- `404 Not Found`: Task does not exist

---

### 4. Delete a Task

**Endpoint:** `DELETE /api/tasks/:id`

**Description:** Delete a task by ID.

**Parameters:**

- `id` (path, required): Task ID (must be positive integer)

**Example Request:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

**Success Response (200):**

```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid task ID format
- `404 Not Found`: Task does not exist

---

### 5. Get AI Suggestions

**Endpoint:** `POST /api/tasks/ai-suggest`

**Description:** Get AI-powered suggestions for task priority and estimated completion time.

**Request Body:**

```json
{
  "title": "string (required, non-empty, non-whitespace)",
  "description": "string (optional)"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:5000/api/tasks/ai-suggest \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Urgent: Fix critical bug affecting users",
    "description": "Database connection issue on production"
  }'
```

**Success Response (200):**

```json
{
  "priority": "High",
  "estimatedCompletionTime": "6 hours"
}
```

**AI Logic:**

- **Priority Detection:**
  - `High`: Contains keyword like "urgent", "asap", "critical", "important", "immediately", "due today"
  - `Low`: Contains keyword like "whenever", "someday", "no rush", "maybe", "eventually"
  - `Medium`: Default (no matching keywords)

- **Time Estimation:**
  - `Complex tasks` (build, design, architecture, develop, plan, research, refactor, full-stack): 4-11 hours
  - `Simple tasks` (email, call, reply, check, review, read, ask): 1 hour
  - `Default`: 1-3 hours

**Error Responses:**

- `400 Bad Request`: Missing or whitespace-only title

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message describing what went wrong",
  "details": "Optional: Additional context or validation details",
  "requestId": "Unique identifier for tracking in logs"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful GET, PUT, DELETE operation
- `201 Created`: Successful POST operation
- `400 Bad Request`: Validation or client error
- `404 Not Found`: Resource does not exist
- `500 Internal Server Error`: Server-side error

---

## Logging

The API uses structured JSON logging with the following levels:

- `error`: Critical failures
- `warn`: Unexpected but recoverable issues
- `info`: General information (default)
- `debug`: Detailed diagnostic information

Set `LOG_LEVEL` in `.env` to control logging verbosity.

---

## Testing

Run the test suite with:

```bash
npm test
```

Tests cover:

- Task creation with validation
- Task retrieval
- Task updates
- Task deletion
- AI suggestions
- Edge cases and error scenarios

---

## Rate Limiting

- Maximum payload size: 10KB
- Consider implementing rate limiting for production use

---

## Security Notes

1. **Input Validation**: All inputs are validated using Zod schema validation
2. **SQL Injection**: Protected by Sequelize ORM parameter binding
3. **Environment Variables**: Sensitive data stored in `.env`, never hardcoded
4. **CORS**: Enabled for cross-origin requests

---

## Examples

### Complete Workflow

```bash
# 1. Get AI suggestions
curl -X POST http://localhost:5000/api/tasks/ai-suggest \
  -H "Content-Type: application/json" \
  -d '{"title": "Urgent project deadline"}'

# 2. Create task with AI suggestions
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Urgent project deadline",
    "priority": "High",
    "deadline": "2026-04-05"
  }'

# 3. List all tasks
curl http://localhost:5000/api/tasks

# 4. Mark task as complete
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

---

## Troubleshooting

**Error: "Failed to load tasks. Backend server not running"**

- Ensure backend is running: `npm start`
- Verify PORT in `.env` matches frontend API configuration
- Check if port 5000 is already in use

**Error: "Validation failed"**

- Ensure required fields are provided
- Check field types match schema requirements
- Review error details for specific validation issues

**Error: "Task not found"**

- Verify the task ID is correct
- Ensure task exists before updating/deleting

---

Last Updated: March 29, 2026
API Version: 1.0.0
