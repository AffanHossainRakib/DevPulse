# DevPulse API

Minimal implementation of the assignment: authentication, issues, users, and profiles.

Quick start

1. Copy `.env.example` to `.env` and set `CONNECTIONSTRING` (NeonDB provided).
2. Install dependencies:

```bash
npm install
```

3. Start (development):

```bash
npm run dev
```

API endpoints (summary)

- `POST /api/auth/signup` — register
- `POST /api/auth/login` — login
- `POST /api/issues` — create issue (auth)
- `GET /api/issues` — list issues (filters: `type`, `status`, `sort`)
- `GET /api/issues/:id` — get single issue
- `PATCH /api/issues/:id` — update (auth + rules)
- `DELETE /api/issues/:id` — delete (maintainer only)
- `GET /api/users/me` — get current user (auth)
- `GET /api/profile/me` — get current profile (auth)
- `PATCH /api/profile/me` — update profile (auth)

Follow the assignment README for expected request/response shapes.
