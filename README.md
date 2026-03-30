# AI Smart Task Manager

A complete production-ready task manager that utilizes React (Vite) on the frontend and Node.js + Express on the backend, integrated with an AI-mocked service for priority and time estimation suggestions.

## � Table of Contents

- [Architecture](#architecture)
- [Key Features](#key-features)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Configuration](#configuration)
- [Best Practices Implemented](#best-practices-implemented)

## 🚀 Architecture and Approach

### 1. Frontend: React + Vite

- **Modern UI**: Components are functional, using React Hooks (`useState`, `useEffect`) and cleanly separated into their respective structural folders (e.g. `components/TaskForm.jsx`).
- **Premium Aesthetics**: Developed purely with Vanilla CSS (`index.css`) avoiding Tailwind to showcase deep design capability. Features glassmorphism panels, interactive multi-stop background gradients, hover micro-animations, and structured spacing rules.
- **Robust Error Handling**: State-based error management with auto-clearing error messages (5-second timeout). No alert boxes for poor UX.
- **AJAX**: Utilizing Axios (`services/api.js`) for all network requests. Handles edge cases and server unavailability gracefully via centralized catch scenarios.

### 2. Backend: Node.js + Express

- **Strict Separation of Concerns**:
  - `routes/tasks.js` pipes requests through proper middleware chains
  - `services/taskService.js` and `aiService.js` isolate database access and business logic
  - `config/` contains centralized configuration and logging
- **SQLite + Sequelize ORM**: Avoids raw SQL to inherently protect against injection
- **Zod Validations**: Input data models strictly defined in `schemas/taskSchema.js`. Ensures API payload integrity and prevents corrupt states (like past deadlines)
- **Structured Logging**: JSON-formatted logs with timestamps, context, and severity levels via `config/logger.js`
- **Configuration Validation**: Centralized env var validation in `config/validation.js` at startup
- **Error Handlers & Resiliency**: Built with an async catch wrapper to funnel all promise rejections to central express error-handling middleware
- **Route Ordering**: AI suggest endpoint correctly positioned before parameterized routes to avoid Express pattern matching conflicts
- **ID Validation**: Numeric ID validation middleware prevents invalid requests

## 🔑 Key Features

✅ **Full CRUD Operations**: Create, read, update, delete tasks  
✅ **AI-Powered Suggestions**: Smart priority detection and time estimation  
✅ **Input Validation**: Zod schemas on frontend and backend  
✅ **Error Handling**: Comprehensive error messages and structured logging  
✅ **Production-Ready**: Environment configuration, validation, testing  
✅ **RESTful API**: Consistent JSON responses and HTTP status codes  
✅ **Comprehensive Testing**: 20+ test cases covering all endpoints and edge cases  
✅ **API Documentation**: Complete endpoint reference with examples

## 💻 Setup & Installation

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- A modern web browser

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server (with auto-reload)
npm run dev

# OR start production server
npm start

# Run tests
npm test
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173` (Vite default)  
The backend API runs on `http://localhost:5000` (configurable via `.env`)

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   ├── database.js           # Sequelize SQLite config
│   │   ├── logger.js             # Structured JSON logging
│   │   └── validation.js         # Env var validation
│   ├── models/
│   │   └── Task.js               # Data model definition
│   ├── routes/
│   │   └── tasks.js              # API endpoints with middleware
│   ├── schemas/
│   │   └── taskSchema.js         # Zod validation schemas
│   ├── services/
│   │   ├── taskService.js        # Database operations
│   │   └── aiService.js          # AI suggestion logic
│   ├── tests/
│   │   └── tasks.test.js         # Comprehensive test suite
│   ├── API.md                    # Complete API documentation
│   ├── .env.example              # Environment template
│   ├── index.js                  # Express server entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx      # Create task form with AI button
│   │   │   ├── TaskItem.jsx      # Individual task component
│   │   │   └── TaskList.jsx      # Task list container
│   │   ├── services/
│   │   │   └── api.js            # Axios client for API calls
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   ├── index.css             # Glassmorphism design system
│   │   └── main.jsx              # React entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 📚 API Documentation

For complete API documentation, see [backend/API.md](./backend/API.md)

### Quick Reference

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/tasks`            | Get all tasks      |
| POST   | `/api/tasks`            | Create new task    |
| PUT    | `/api/tasks/:id`        | Update task        |
| DELETE | `/api/tasks/:id`        | Delete task        |
| POST   | `/api/tasks/ai-suggest` | Get AI suggestions |

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd backend
npm test
```

**Test Coverage:**

- ✅ Task Creation (valid/invalid inputs, validation)
- ✅ Task Retrieval (list all tasks)
- ✅ Task Updates (valid updates, non-existent tasks)
- ✅ Task Deletion (successful delete, invalid IDs)
- ✅ AI Suggestions (priority detection, time estimation)
- ✅ Edge Cases (whitespace validation, invalid priority, past dates)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_PATH=./taskmanager.sqlite

# Logging
LOG_LEVEL=info   # error | warn | info | debug
```

**Configuration Validation:**

- Server starts only after validating all required env vars
- Port must be valid (1-65535)
- NODE_ENV must be one of: development, production, test
- Missing variables cause immediate startup failure with clear error message

## 🏆 Best Practices Implemented

### Backend

✅ **Middleware Composition**: Validation, authentication, error handling as reusable middleware  
✅ **Async Error Handling**: Promise rejection wrapper prevents unhandled errors  
✅ **Structured Logging**: Timestamp, context, severity, optional data
✅ **Input Validation**: Zod schemas with detailed error messages  
✅ **Configuration Validation**: Env vars validated at startup  
✅ **Separation of Concerns**: Routes → Services → Models  
✅ **ID Validation**: Numeric type checking for all parameterized routes  
✅ **Response Consistency**: All endpoints follow same error/success format  
✅ **API Documentation**: Complete with examples and error codes  
✅ **Comprehensive Tests**: 20+ tests with edge case coverage

### Frontend

✅ **State Management**: React Hooks for component-level state  
✅ **Error Handling**: State-based errors with auto-dismiss (not alert boxes)  
✅ **Loading States**: Proper UX feedback during async operations  
✅ **Input Validation**: Client-side validation before submission  
✅ **Component Composition**: Reusable, single-responsibility components  
✅ **Accessibility**: Semantic HTML, proper form labels

## 🤔 Key Technical Decisions & Tradeoffs

1. **Mocked AI instead of API invocation**: For simplicity and free accessibility without requiring API keys, the AI Suggestion system uses a smart-keyword algorithm mapping words like 'urgent' to 'High Priority' and 'design/build' to high hour estimates.

2. **SQLite over PostgreSQL**: Ensures the local dev experience works instantly (`npm install` → `npm start`) without external Docker containers or database services.

3. **No External Router on React**: The user experience is a monolithic single-view workspace (Task Creation next to List Display). `react-router-dom` would add unnecessary complexity.

4. **Vanilla CSS over Tailwind**: Showcases design depth with custom design system featuring glassmorphism, gradients, and micro-animations.

## 🔮 Future Improvements

1. Implement real LLM integration (OpenAI, Anthropic) for `ai-suggest` endpoint
2. Full state management (Redux Toolkit) if features scale
3. User authentication via JWT tokens
4. Task categories, tags, and filtering
5. E2E tests using Cypress
6. Database migrations with better schema versioning
7. Rate limiting and request throttling
8. Production-grade caching strategy
9. Webhook support for integrations
10. Export to CSV/JSON

## 📝 Developer Notes

### Running in Production

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
# Serve the dist/ folder with a static server
```

### Debugging

**Enable debug logging:**

```bash
LOG_LEVEL=debug npm run dev
```

**Check API health:**

```bash
curl http://localhost:5000/api/tasks
```

## 📄 License

MIT

---

**Last Updated**: March 29, 2026  
**Version**: 1.0.0
