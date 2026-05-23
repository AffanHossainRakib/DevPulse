# DevPulse API

DevPulse is an Express + TypeScript API for authentication, issues, and users.

Production deployment:

- https://dev-pulse-red.vercel.app

## Local Setup

1. Copy `.env.example` to `.env` and set `CONNECTIONSTRING` plus the JWT and salt settings.
2. Install dependencies:

```bash
npm install
```

3. Start the API in development:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Run the compiled server locally:

```bash
npm start
```

## API Overview

Health check:

- `GET /` — API status

Auth:

- `POST /api/auth/signup` — register a new user
- `POST /api/auth/login` — login
- `POST /api/auth/refresh` — refresh access token

Issues:

- `POST /api/issues` — create an issue, auth required
- `GET /api/issues` — list issues
- `GET /api/issues/:id` — get a single issue
- `PATCH /api/issues/:id` — update an issue, auth required
- `DELETE /api/issues/:id` — delete an issue, auth required

Users:

- `GET /api/users/me` — current user profile, auth required
- `GET /api/users/:id` — get a user by id, auth required

## Notes

- The app is deployed on Vercel using a catch-all function route.
- Production build and deploy rely on `npm run build`.
