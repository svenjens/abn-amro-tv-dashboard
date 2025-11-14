# Contributing to TV Show Dashboard

Thank you for your interest in contributing to the TV Show Dashboard! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Branch Protection Rules](#branch-protection-rules)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Commit Message Convention](#commit-message-convention)

## 🚀 Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix-name
   ```

## 🔄 Development Workflow

We follow a Pull Request workflow for all changes:

1. **Create a feature branch** for your work
2. **Make your changes** with clear, focused commits
3. **Test your changes** locally
4. **Push your branch** to your fork
5. **Open a Pull Request** against the `main` branch
6. **Wait for review** and address feedback
7. **Merge** once approved and all checks pass

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `test/description` - Test additions or updates
- `chore/description` - Maintenance tasks

## 📝 Pull Request Process

1. **Fill out the PR template** completely
2. **Ensure all CI checks pass**:
   - ✅ Linting and type checks
   - ✅ Unit tests
   - ✅ Build succeeds
   - ✅ No unused variables or functions
3. **Request review** from at least one maintainer
4. **Address review feedback** promptly
5. **Squash commits** if requested before merging

### PR Template Checklist

Make sure to complete all applicable items in the PR template:
- Code follows project style
- Self-review performed
- Documentation updated
- Tests added/updated
- No new warnings
- Build works
- Linting passes
- Type check passes

## 🔒 Branch Protection Rules

The `main` branch is protected with the following rules:

### Required Settings

To enable branch protection for the `main` branch:

1. Go to **Settings** → **Branches** → **Add rule**
2. Enter `main` as the branch name pattern
3. Enable the following settings:

#### ✅ Require a pull request before merging
- **Require approvals**: 1 (at minimum)
- **Dismiss stale pull request approvals when new commits are pushed**: ✅
- **Require review from Code Owners**: ✅ (if CODEOWNERS file exists)

#### ✅ Require status checks to pass before merging
- **Require branches to be up to date before merging**: ✅
- **Required status checks**:
  - `Lint & Type Check`
  - `Unit Tests`
  - `Build & Bundle Size`

#### ✅ Require conversation resolution before merging
- All conversations must be resolved before merging

#### ✅ Require signed commits (optional but recommended)
- Commits must be signed with GPG/SSH keys

#### ✅ Require linear history (optional)
- Prevents merge commits, enforces rebase or squash

#### ✅ Do not allow bypassing the above settings
- Even administrators must follow these rules

### Additional Protection Settings

#### Include administrators
- ✅ **Recommended**: Include administrators in these restrictions
- Ensures everyone follows the same process

#### Restrict who can push to matching branches
- Limit push access to specific teams or users

#### Allow force pushes
- ❌ **Disabled**: Force pushes are not allowed

#### Allow deletions
- ❌ **Disabled**: Branch deletion is not allowed

### Quick Setup

For repository administrators, you can enable these settings via GitHub CLI:

```bash
# Require pull request reviews
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field required_status_checks='{"strict":true,"contexts":["Lint & Type Check","Unit Tests","Build & Bundle Size"]}' \
  --field enforce_admins=true \
  --field restrictions=null
```

## 🎨 Code Style Guidelines

### TypeScript/Vue

- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use `<script setup>` syntax for components
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable and function names
- Add JSDoc comments for complex functions

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS variables for theme values

### General Rules

- **No console statements** in production code (use debugging tools)
- **No unused variables or functions**
- **No any types** unless absolutely necessary
- Keep functions small and focused
- Write self-documenting code

## ✅ Testing Requirements

### Before Submitting a PR

Run these commands to ensure your changes are ready:

```bash
# Lint your code
npm run lint

# Run type check
npx vue-tsc --noEmit

# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build
```

### Writing Tests

- Write unit tests for all new functionality
- Aim for >80% code coverage
- Test edge cases and error conditions
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
feat(search): add debounced search functionality

- Implement useDebounce composable
- Add 300ms delay to search input
- Update SearchBar component

Closes #123
```

```bash
fix(detail): resolve image loading error

- Add fallback for missing show images
- Update error handling in ShowDetail view

Fixes #456
```

```bash
docs(readme): update installation instructions

- Add Node.js version requirement
- Update npm commands
- Add troubleshooting section
```

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer:

```bash
feat(api)!: change API response format

BREAKING CHANGE: The API now returns data in a different structure.
Update your code to use the new format.
```

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Accept criticism gracefully
- Focus on what is best for the community
- Show empathy towards other contributors

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Use GitHub Discussions for questions
- Tag maintainers for urgent issues

## 🎉 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Our contributors page

Thank you for contributing! 🚀

