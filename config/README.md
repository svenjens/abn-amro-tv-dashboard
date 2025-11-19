# Configuration Files

This directory contains various configuration files for development tools and CI/CD.

## Files

### `lighthouse.json`

Configuration for Lighthouse CI performance and quality checks.

- **Used by:** Lighthouse CI (if enabled)
- **Purpose:** Define performance budgets and quality thresholds
- **Status:** ⚠️ Legacy - Not currently used in CI/CD

### `pa11y.json`

Configuration for Pa11y accessibility testing.

- **Used by:** Pa11y CI (if enabled)
- **Purpose:** Automated accessibility testing with WCAG2AA standards
- **Status:** ⚠️ Legacy - Not currently used in CI/CD

### `release-please.json`

Configuration for Release Please automated versioning.

- **Used by:** `.github/workflows/release-please.yml`
- **Purpose:** Automated changelog generation and version bumping
- **Status:** ✅ Active

### `release-please-manifest.json`

Version manifest for Release Please.

- **Used by:** `.github/workflows/release-please.yml`
- **Purpose:** Track current version for automated releases
- **Status:** ✅ Active

## Root Configuration Files

Some configuration files remain in the project root:

### Active Configs

- `nuxt.config.ts` - Nuxt framework configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript compiler configuration
- `vitest.config.ts` - Vitest unit test configuration
- `vitest.setup.ts` - Vitest test setup and mocks
- `playwright.config.ts` - Playwright e2e test configuration
- `eslint.config.js` - ESLint linting configuration
- `.prettierrc` - Prettier code formatting configuration
- `.prettierignore` - Prettier ignore patterns
- `vercel.json` - Vercel deployment configuration
- `package.json` - Node.js project metadata and dependencies

### Environment & Git

- `.gitignore` - Git ignore patterns
- `.env` - Environment variables (not committed)
- `.env.example` - Environment variables template

## Why This Structure?

Configuration files are split between root and `/config`:

**Root directory:** Files that tools expect by default (e.g., `package.json`, `tsconfig.json`)

**Config directory:** Optional configs and tool-specific settings that can be referenced via CLI flags or workflow parameters

This keeps the project root cleaner while maintaining compatibility with tools that require specific file locations.
