# Eureka Security Scan Report

Date: 2026-06-03

## Scope

- Repository: `gaon12/eureka`
- Reviewed areas: GitHub security alert access, Node/Express API, React client session flow, Vite migration, Flask upload API, npm lockfile versions.

## GitHub Alert Access

- GitHub pages were accessed directly:
  - `https://github.com/gaon12/eureka/security/dependabot`
  - `https://github.com/gaon12/eureka/security/code-scanning`
- `gh` CLI is not installed, but browser access succeeded after the GitHub security pages were opened in Playwright.

## GitHub Alerts Observed

### Code Scanning

- 23 open CodeQL alerts.
- 22 alerts: `Missing rate limiting`, detected across `node/route/userRouter.js`, `node/route/carRouter.js`, `node/route/workRouter.js`, `node/route/noticeRouter.js`, `node/route/complaintRouter.js`, and `node/server.js`.
- 1 alert: `Incomplete multi-character sanitization`, detected in `main/noticeWrite.js`.

### Dependabot

- 12 open Dependabot alerts.
- `webpack-dev-server` source-code exposure alerts in `junho/my-app/package-lock.json` and old `node/package-lock.json`.
- CKEditor XSS alerts involving `@ckeditor/ckeditor5-html-support`, `ckeditor5`, and `@ckeditor/ckeditor5-clipboard` in `junho/my-app/package-lock.json`.
- `qs` DoS alerts in `node/package-lock.json` and `junho/my-app/package-lock.json`.

## Threat Model

- Assets: resident personal information, apartment unit identifiers, vehicle registration data, admin-only complaint/work/notice data, session cookies, Clova API credentials.
- Trust boundaries: browser to Express API, Express API to MySQL, Flask upload API to recognition model, Flask API to Express `/car/info`, external Clova summary API.
- Main attacker capabilities: unauthenticated web requests, cross-origin requests, stored HTML payloads through editor content, oversized uploads, dependency exploitation during development.

## Findings Addressed

- Removed unauthenticated pre-login admin lookup. `/user/isAdmin` is now session-based.
- Added `/user/auth` so the client can restore the logged-in role from the server session.
- Hardened admin middleware so missing sessions return `401` instead of throwing.
- Switched logout from state-changing `GET` to `POST`.
- Restricted Express CORS to configured origins and enabled credential-aware requests.
- Added secure session defaults: `httpOnly`, production-only `secure`, `sameSite: lax`, one-hour max age.
- Disabled Express CSRF middleware unless explicitly enabled because the existing client did not issue CSRF tokens; SameSite cookies and restricted CORS now provide baseline protection.
- Added shared Express rate limiters and applied them to all API routers; login/signup get a stricter auth limiter.
- Fixed `/car/info` runtime bugs: missing parameter array, wrong result variable, and wrong query result shape.
- Added an internal service-token path for Flask to call `/car/info` without exposing the endpoint publicly.
- Added frontend credential handling for protected API requests.
- Migrated the React app from Create React App to Vite and replaced CRA `REACT_APP_*` variables with Vite `VITE_*` variables.
- Replaced hard-coded API base URL with environment-driven API settings.
- Replaced test/example domains with environment-driven API URLs in React, Expo, and helper scripts.
- Replaced regex-based HTML stripping with DOMParser-based text extraction in `main/noticeWrite.js`, admin notice, admin work writing, and user complaint writing code.
- Added client-side HTML sanitization before `dangerouslySetInnerHTML`.
- Restricted Flask CORS, added upload size limit, fixed file extension validation, and handled missing upload files.
- Added `.env.example` files for Node, React, Expo, and Flask configuration.

## Dependency Alert Candidates

- Node/Express backend: `npm audit --json` reports `0` vulnerabilities after removing unused React/CRA dependencies and updating `express`, `body-parser`, and `qs`. This should clear the old node-side `webpack-dev-server` and `qs` Dependabot alerts after the changes are pushed.
- React app: removed deprecated `react-scripts`, added Vite 8 and `@vitejs/plugin-react`, and refreshed the frontend lockfile.
- React app: updated React/React DOM to `19.2.7`, Ant Design to `6.4.3`, React Router to `7.16.0`, Axios to `1.17.0`, SweetAlert2 to `11.26.25`, and Testing Library/Vitest tooling to current npm registry versions.
- React app: `@ckeditor/ckeditor5-build-classic` updated from `41.4.2` to `44.3.0`, and `@ckeditor/ckeditor5-react` updated to `11.1.2`.
- React app: `qs` override now resolves to `6.15.2`, addressing the same advisory that affected Express/body-parser transitive dependencies.
- React app: `webpack-dev-server` override now resolves to `5.2.4`, addressing the open webpack-dev-server Dependabot alerts in the frontend lockfile.
- React app: `@ckeditor/ckeditor5-html-support`, `@ckeditor/ckeditor5-clipboard`, and `ckeditor5` overrides now resolve to `48.2.0`, addressing the observed CKEditor package alerts in the frontend lockfile.
- React app: `npm audit --json` reports `0` vulnerabilities after the frontend lockfile update.

## Validation

- Passed: `node --check` on modified Node server/router/middleware files.
- Passed: `python -m py_compile server/main.py server/real-time_car_plate.py`.
- Passed: `npm --prefix node audit --json` with `0` vulnerabilities.
- Passed: `npm --prefix junho/my-app audit --json` with `0` vulnerabilities.
- Passed: targeted search found no remaining `example.com`, `test.com`, old hard-coded upload URLs, or removed `AsyncStorage` import in active source paths.
- Passed: targeted search confirms no remaining regex pattern from the original CodeQL `Incomplete multi-character sanitization` alert in active source paths; similar admin/user editor stripping was also replaced.
- Blocked: full React build because frontend dependency installation did not complete in bounded time. The existing local `node_modules` became incomplete during a timed-out install, and a temporary clean-copy `npm ci --ignore-scripts` also exceeded the available time. The frontend lockfile audit still reports `0` vulnerabilities, but runtime build verification still needs a clean install.

## Recommended Follow-Up

- Push this branch and let GitHub Dependabot/CodeQL rescan the updated lockfiles and source.
- Run a clean frontend install/build in CI or on a machine where npm install can complete without Windows file-lock or timeout issues.
- Add server-side HTML sanitization before storing CKEditor content; the current fix sanitizes at render time.
- Add integration tests for login, auth restore, admin-only APIs, logout, and `/car/info`.
