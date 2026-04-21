# CS5610 Project 3

A fullstack Sudoku app built with React + Express + MongoDB. Users can register/login with cookies, create Sudoku games, play by game id, track per-user completion status, and view a global high-score leaderboard.

## Features
- Auth flow with cookies: register, login, logout, and `isLoggedIn` checks.
- Game list page with create actions for `EASY` and `NORMAL` games.
- Per-user game progress (`currentBoard`, timer seconds, completion state) so one user’s progress does not overwrite another’s.
- High-score aggregation by wins, sorted by wins desc + username asc.
- Completed-game handling: completed users see the solved board and locked inputs.

## Tech Stack
- Frontend: React 18, React Router 6, Vite
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Auth: Cookie-based session tracking

## Getting Started
1. Install dependencies:
```bash
npm install
```
2. Start backend server:
```bash
npm run server
```
3. Start frontend dev server (new terminal):
```bash
npm run dev
```
4. Open:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/*`

MongoDB connection defaults to:
- `mongodb://127.0.0.1:27017/sudoku_project3`

## Key Files
- `server.js` — Express app bootstrap, API routes, Mongo connection.
- `backend/api/user.api.js` — auth endpoints and cookie handling.
- `backend/api/sudoku.api.js` — game CRUD + per-user progress logic.
- `backend/api/highscore.api.js` — high-score submit/list APIs.
- `backend/api/db/schema/gameProgress.schema.js` — per-user-per-game progress model.
- `src/pages/Game.jsx` — game play page, reset, delete, timer/save flow.

## Writeup
**What were some challenges you faced while making this app?**  
The biggest challenge was moving from a single-player frontend state model to a true fullstack multi-user model. Early versions stored a global `currentBoard` in the game document, which caused users to see each other’s progress and made reset behavior confusing. Refactoring to a separate per-user progress collection (`gameProgress`) fixed this, but required changes across API design, frontend data flow, and timer semantics. Another challenge was keeping UI state synchronized with server state (for example, instantly disabling reset when a user completes a game).

**Given more time, what additional features, functional or design changes would you make?**  
I would add richer game UX features such as hints, candidate notes, and keyboard navigation for faster play. On the backend, I would add formal validation middleware and API tests to enforce contracts for all routes. I would also expand profile/stats pages so players can see personal history (best times, games created, completion streaks). For design, I would improve small-screen navigation and add clearer visual feedback for completed/locked game states.

**What assumptions did you make while working on this assignment?**  
I assumed cookie-based auth with `userId` and `username` was sufficient for this assignment scope, without adding token refresh or full session store rotation. I assumed games can be publicly readable while actions that modify progress or data require login. I also assumed that each user should have isolated progress/timer per game, even when multiple users open the same game id. Finally, I assumed deleting a game should remove related highscores and progress records to keep leaderboard counts consistent.

**How long did this assignment take to complete?**  
Approximately 16–20 hours total across several sessions. Around half of the time went into backend modeling and API updates, and the rest went to frontend migration, edge-case fixes, and testing.

**What bonus points did you accomplish? Please link to code where relevant and add any required details.**  
1. **Delete Game (5 pts)**: Implemented creator-only delete on the game page with a `DELETE` button visible only to the game creator. Backend enforces permission and cascades cleanup of highscores/progress, which correctly decreases wins for users who completed that game.  
Code: `backend/api/sudoku.api.js` (`DELETE /api/sudoku/:gameId`), `src/pages/Game.jsx` (`DELETE` button and handler), `backend/api/db/model/highscore.model.js`, `backend/api/db/model/gameProgress.model.js`.
2. **Password Encryption (2 pts)**: Implemented password hashing using `bcrypt`. Passwords are stored as `passwordHash` and verified with `bcrypt.compare` on login.  
Code: `backend/api/user.api.js`, `backend/api/db/schema/user.schema.js`.
