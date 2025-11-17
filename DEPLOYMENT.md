# Deployment Guide

This document explains how to set up and deploy the TV Show Dashboard to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [GitHub](https://github.com) account with this repository
3. The Vercel CLI (optional, for local deployments)

## Setup Instructions

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Get Vercel Tokens

You need three secrets for GitHub Actions:

#### A. Vercel Token

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Get your token from: https://vercel.com/account/tokens
# Create a new token named "GitHub Actions"
```

#### B. Vercel Organization ID

```bash
# In your project directory
vercel link

# This creates .vercel/project.json
# Get orgId from that file
cat .vercel/project.json
```

#### C. Vercel Project ID

```bash
# Get projectId from the same file
cat .vercel/project.json
```

### 3. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - Your organization ID
- `VERCEL_PROJECT_ID` - Your project ID

### 4. Deploy

The deployment happens automatically:

- **Production**: Push to `main` branch
- **Preview**: Create a pull request

## Pipeline Overview

The deployment pipeline includes 8 jobs:

### 1. **Lint & Type Check**

- ✅ Runs ESLint
- ✅ TypeScript type checking
- ✅ Checks for console.log statements

### 2. **Unit Tests**

- ✅ Runs all unit tests with Vitest
- ✅ Generates coverage report
- ✅ Uploads to Codecov

### 3. **Build & Bundle Size**

- ✅ Builds production bundle
- ✅ Checks bundle sizes
- ✅ Warns if bundles are too large
- ✅ Uploads build artifacts

### 4. **Accessibility Tests**

- ✅ Runs Pa11y CI for WCAG2AA compliance
- ✅ Tests with axe-core
- ✅ Checks multiple pages

### 5. **Lighthouse Performance**

- ✅ Performance audits
- ✅ Accessibility score
- ✅ Best practices check
- ✅ SEO validation

### 6. **Security Audit**

- ✅ npm audit for vulnerabilities
- ✅ Dependency checks

### 7. **Deploy to Production**

- ✅ Only on `main` branch
- ✅ After all checks pass
- ✅ Automatic deployment to Vercel

### 8. **Deploy to Preview**

- ✅ On pull requests
- ✅ Comments PR with preview URL
- ✅ Temporary preview environment

## Quality Gates

The pipeline enforces these quality standards:

| Check          | Requirement                   |
| -------------- | ----------------------------- |
| Lint           | No ESLint errors              |
| Type Check     | No TypeScript errors          |
| Console Logs   | No console statements in src/ |
| Unit Tests     | All tests pass                |
| Build          | Successful build              |
| Bundle Size    | Main bundle < 500KB           |
| Performance    | Lighthouse score > 80         |
| Accessibility  | Lighthouse score > 90         |
| Best Practices | Lighthouse score > 85         |
| SEO            | Lighthouse score > 90         |
| Security       | No moderate+ vulnerabilities  |

## Manual Deployment

You can also deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

No environment variables are required for this project. All configuration is in the code.

## Rollback

To rollback a deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Deployments"
4. Find the previous working deployment
5. Click "..." → "Promote to Production"

## Monitoring

### Performance Monitoring

- Check Lighthouse reports in GitHub Actions
- Monitor Web Vitals in Vercel Analytics

### Error Tracking

- Check browser console in production
- Review deployment logs in Vercel

### Accessibility

- Pa11y CI reports in GitHub Actions
- Manual testing with screen readers

## Troubleshooting

### Build Fails

```bash
# Check build locally
npm run build

# Check TypeScript errors
npx vue-tsc --noEmit

# Check linting
npm run lint
```

### Tests Fail

```bash
# Run tests locally
npm run test

# Run with UI
npm run test:ui

# Check coverage
npm run test:coverage
```

### Deployment Fails

1. Check GitHub Actions logs
2. Verify Vercel secrets are correct
3. Check Vercel deployment logs
4. Ensure `vercel.json` is correct

### Accessibility Issues

```bash
# Run accessibility tests locally
npm run test:a11y

# Test specific URL
npx pa11y http://localhost:4173
```

## Best Practices

1. **Always create PRs** for changes to see preview deployments
2. **Wait for checks** to pass before merging
3. **Monitor production** after deployment
4. **Test locally** before pushing
5. **Keep dependencies** updated

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Pa11y CI](https://github.com/pa11y/pa11y-ci)
- [Web Vitals](https://web.dev/vitals/)

## Support

For issues with:

- **Pipeline**: Check GitHub Actions logs
- **Vercel**: Check Vercel deployment logs
- **Application**: Check browser console

## CI/CD Badge

Add this to your README.md:

```markdown
[![Deploy Pipeline](https://github.com/svenjens/tv-show-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/svenjens/tv-show-dashboard/actions/workflows/deploy.yml)
```
