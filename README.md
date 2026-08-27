# PropFlow Automation

[![API Tests](https://github.com/nasm24/PropFlow-Automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/nasm24/PropFlow-Automation/actions/workflows/api-tests.yml)

Playwright + TypeScript API automation for the [PropFlow](https://github.com/nasm24/PropFlow) Spring Boot property management API.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Spring Boot
- PostgreSQL
- Maven
- GitHub Actions

## What is tested

The suite covers the Properties REST API:

- `GET /api/properties` — list returns 200 and an array
- `POST /api/properties` — create a property and retrieve it by id
- `PUT /api/properties/{id}` — update `totalUnits` as part of a full CRUD lifecycle
- `DELETE /api/properties/{id}` — delete and confirm the resource is gone
- End-to-end CRUD lifecycle (create → update → get → delete → get 404)
- Validation errors — invalid payload returns 400 with `fieldErrors`
- Missing resource — GET, PUT, and DELETE on a non-existent id return 404

## Project Structure

```text
tests/api/                      # API specs (assertions live here)
src/api/clients/                # PropertiesClient HTTP helpers
src/api/types/                  # Shared TypeScript types
src/test-data/                  # Property payload factories
playwright.config.ts            # Projects, baseURL, reporters
.github/workflows/api-tests.yml # CI pipeline
```

## PropertiesClient pattern

API specs use Playwright’s `request` fixture. `PropertiesClient` wraps CRUD calls (`list`, `create`, `getById`, `update`, `delete`) and returns `APIResponse`. Specs own all `expect` checks. Paths stay relative (`/api/properties`). Payloads come from `src/test-data/properties.ts`, not from the client.

## Running Locally

The PropFlow backend must be running on `http://localhost:8080` with PostgreSQL available.

```bash
npm ci
npm run test:api
```

`test:api` runs `playwright test --project=api` only (no browser install, no UI login setup).

## CI/CD

On push and pull request to `main`, and via `workflow_dispatch`, GitHub Actions:

1. Starts PostgreSQL 16 (`propflow` / `postgres`)
2. Checks out the automation repository and the PropFlow backend into `backend/`
3. Sets up Java 17 and Node.js 24
4. Runs `npm ci` and `./mvnw spring-boot:run` with `POSTGRES_PASSWORD=postgres`
5. Waits until `GET http://localhost:8080/api/properties` returns 200
6. Runs `npx playwright test --project=api` with `BASE_URL=http://localhost:8080` and `CI=true`
7. Uploads `playwright-report/` as an artifact (`if: always()`)

Workflow: [.github/workflows/api-tests.yml](.github/workflows/api-tests.yml)

## Test Results

The current API suite contains **7 automated tests** covering CRUD operations, validation, and error handling.

All tests are executed locally and in GitHub Actions.

## Repositories

- Backend: [nasm24/PropFlow](https://github.com/nasm24/PropFlow)
- Automation: [nasm24/PropFlow-Automation](https://github.com/nasm24/PropFlow-Automation)
