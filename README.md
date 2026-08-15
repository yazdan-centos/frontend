# Registry — React frontend

A React (Vite) frontend for the [Person API template](https://github.com/yazdan-centos/template)
Spring Boot backend. Handles JWT login, an authenticated roster view for any
signed-in user, and admin-only create / edit / delete on the roster.

## Matches the backend contract

- `POST /api/auth/login` → stores `accessToken` from the response, attaches it
  as `Authorization: Bearer <token>` on every subsequent request.
- `GET /api/auth/me` → used on page load to validate a stored token and
  recover `{ username, role }`.
- `GET /api/persons` → visible to both `USER` and `ADMIN`.
- `POST /api/persons`, `PUT /api/persons/{id}`, `DELETE /api/persons/{id}` →
  only rendered/callable for `ADMIN` (the backend also enforces this
  server-side via `@PreAuthorize`, so this is a UX nicety, not the real
  security boundary).
- Errors are parsed from the backend's RFC 7807 `ProblemDetail` shape
  (`{ detail, title, status }`) and shown inline.
- A 401 response (expired/invalid token) anywhere in the app clears the
  session and returns to `/login`.

## Run it

1. Start the backend (see its own README) — by default it listens on
   `http://localhost:8080` and allows the CORS origin `http://localhost:3000`.

2. Install and run the frontend:

   ```bash
   npm install
   cp .env.example .env   # adjust VITE_API_BASE_URL if the API isn't on :8080
   npm run dev
   ```

   The dev server runs on `http://localhost:3000` to match the backend's
   default CORS allow-list. If you change the port, update
   `APP_CORS_ALLOWED_ORIGIN_PATTERNS` on the backend to match.

3. Sign in with the bootstrap admin account created by the backend on first
   run (see its README for `APP_BOOTSTRAP_ADMIN_ENABLED`), or any `USER`
   account seeded via `persons.json` / created by an admin.

## Project layout

```
src/
  api/            axios client + typed calls for auth and persons endpoints
  context/        AuthContext — session state, login/logout, token storage
  components/     Layout, ProtectedRoute, RoleBadge, form + confirm modals
  pages/          LoginPage, PersonsPage, NotFoundPage
```

## Notes

- The JWT is kept in `localStorage` under `accessToken`. This backend is
  stateless (no server-side session/revocation), so "logging out" is purely
  a client-side action, matching the backend README.
- There's no token refresh flow — tokens expire per `APP_JWT_EXPIRATION`
  (1 hour by default) and the user is bounced back to `/login` on the next
  401.
