# PropFlow Automation

[![API Tests](https://github.com/nasm24/PropFlow-Automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/nasm24/PropFlow-Automation/actions/workflows/api-tests.yml)

## Project Overview

This repository is Playwright + TypeScript automation for [PropFlow](https://github.com/nasm24/PropFlow), a Spring Boot property management API with a React UI.

It covers:

- REST API automation
- API response contract validation (Playwright assertions, not Pact)
- React UI automation
- Page Object Model
- Test data factories
- Isolated PostgreSQL test environment (`propflow_test`)
- GitHub Actions CI/CD

## Skills Demonstrated

- REST API tests using Playwright’s `request` fixture
- HTTP client abstraction (`PropertiesClient`)
- Response contract checks on successful Property payloads
- Parameterized invalid-field validation
- UI tests using Playwright’s `page`
- Page Object Model for the Properties screen
- Reusable payload factories
- Test isolation and cleanup of UI-created data
- Separate PostgreSQL test database vs development
- GitHub Actions running API and UI tests together

## Tech Stack

- Playwright (separate `api` and `ui` projects)
- TypeScript
- Node.js 24
- React 19
- Vite 8
- Spring Boot
- Java 17
- PostgreSQL 16
- Maven
- GitHub Actions

## Test Architecture

**API**

- `tests/api/` — specs and assertions
- `src/api/clients/` — HTTP helpers (`PropertiesClient`)
- `src/api/assertions/` — Property response contract checks
- `src/api/types/` — shared TypeScript types
- `src/test-data/` — payload factories

**UI**

- `tests/ui/` — UI specs
- `src/pages/` — Page Object Model
- UI tests use `page`; API tests use `request`

HTTP stays in `PropertiesClient`. Assertions stay in specs (and the contract helper). Payloads stay in factories. UI actions stay in page objects. Specs describe behavior and expected results.

## What is Tested

### API — 14 tests

- `GET /api/properties`
- `POST /api/properties`
- `PUT /api/properties/{id}`
- `DELETE /api/properties/{id}`
- Full CRUD lifecycle
- Validation errors (`400` + `fieldErrors`)
- Missing resources (`404`)
- Parameterized invalid-field POST cases
- Contract checks on successful Property JSON: `id` (number), string fields, `propertyType` in `APARTMENT` | `HOUSE` | `CONDO` | `TOWNHOUSE`, and positive integer `totalUnits`

This is Playwright `expect` on the JSON body, not Pact or consumer-driven contracts.

### UI — 4 tests

- Properties page loads
- Create property
- Edit property
- Delete property

UI tests create uniquely named properties and delete the data they create where appropriate.

### Total

**18 automated tests** (14 API + 4 UI)

## Local Test Environment

**Development (do not point automation at this backend)**

- PostgreSQL: `propflow`
- Spring Boot: `http://localhost:8080`
- React/Vite: `http://localhost:5173`

**Automated tests**

- PostgreSQL: `propflow_test`
- Spring Boot `test` profile on `http://localhost:8081`
- React/Vite: `http://localhost:5173`
- Frontend: `VITE_API_BASE_URL=http://localhost:8081`

API tests must use the test backend on **8081**, not development **8080**. `frontend/.env` is local-only and not committed.

## Running Tests

Prerequisites: PostgreSQL with `propflow_test`, PropFlow `test` profile on **8081**, and Vite on **5173** with `VITE_API_BASE_URL=http://localhost:8081`. Set `BASE_URL=http://localhost:8081` for API tests (local `.env` or the environment).

API:

```bash
npm ci
npm run test:api
```

UI (frontend and test backend must be running):

```bash
npm run test:ui
```

CI runs both scripts. There is no supported single `npm test` command for the full suite.

## Project Structure

```text
tests/api/                         # API specs
tests/ui/                          # UI specs
src/api/clients/                   # PropertiesClient
src/api/assertions/                # Property contract assertions
src/api/types/                     # Shared API types
src/pages/                         # UI Page Objects
src/test-data/                     # Payload factories
playwright.config.ts               # api / ui / setup projects
.github/workflows/api-tests.yml    # CI pipeline
```

The React app lives in [nasm24/PropFlow](https://github.com/nasm24/PropFlow) under `frontend/` (CI checkout path: `backend/frontend`).

## CI/CD

On push and pull request to `main`, and `workflow_dispatch`, GitHub Actions:

1. Starts PostgreSQL 16 (`propflow_test`)
2. Checks out this repo
3. Checks out `nasm24/PropFlow` into `backend/`
4. Sets up Java 17 and Node.js 24
5. `npm ci` at the automation root
6. `npm ci` in `backend/frontend`
7. `npx playwright install chromium --with-deps`
8. Starts Spring Boot with `SPRING_PROFILES_ACTIVE=test` on port **8081**
9. Waits for `GET http://localhost:8081/api/properties`
10. Starts Vite on **5173** with `VITE_API_BASE_URL=http://localhost:8081`
11. Waits for `http://localhost:5173/`
12. Runs `npm run test:api` (`BASE_URL=http://localhost:8081`, `CI=true`)
13. Runs `npm run test:ui` (`CI=true`)
14. Uploads `playwright-report/` (`if: always()`)

CI runs all **18 tests**.

Workflow: [.github/workflows/api-tests.yml](.github/workflows/api-tests.yml)

## Repositories

- Backend: [nasm24/PropFlow](https://github.com/nasm24/PropFlow)
- Automation: [nasm24/PropFlow-Automation](https://github.com/nasm24/PropFlow-Automation)
