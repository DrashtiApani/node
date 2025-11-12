# Recipe Sharing Platform (API-only)

Features:
- Node.js + Express API (no EJS/views)
- MongoDB (Mongoose) models: User, Recipe, Comment
- JWT authentication with cookie (httpOnly)
- Role-based access (admin, user)
- Recipe ownership and retrieval (populate)

Setup:
1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`
4. API endpoints described in routes files.

