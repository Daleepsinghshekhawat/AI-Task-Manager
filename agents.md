# AI Guidance File (agents.md)

## Coding Rules
1. Use clean, readable code with no unnecessary complexity.
2. Break large functions into smaller reusable parts.
3. Follow strict naming conventions (camelCase for variables/functions, PascalCase for React components and Sequelize models).
4. Do not leave placeholder code or unfinished functions in production commits.
5. Provide meaningful and detailed error messages on API failures.

## Constraints
1. **No Global State**: Do not use global variables for state management. In React, use `useState`, `useEffect`. In Node/Express, avoid stateful singletons.
2. **Proper Validation**: Never skip input validation. Validate inputs both on frontend (before submission) and backend (via schemas like Zod).
3. **Separation of Concerns**: Do NOT mix business logic inside route handlers. Controllers/Routes should parse the request and pass it to a Service layer.
4. **Technology Stack**: Use React (Vite) + Vanilla CSS + Node.js (Express) + SQLite (Sequelize) + Zod.

## Safety Guidelines for AI-Generated Code
1. Protect against SQL Injection: Always use the ORM bindings properly (Sequelize handles this gracefully).
2. Rate Limiting / DoS: Assume the API needs rudimentary safety against abuse (e.g., limit payload sizes).
3. Do not hardcode API keys or credentials. Use `dotenv` and environment variables for all secrets.
4. Catch all async errors in Express route handlers using a centralized wrapper or custom middleware.
