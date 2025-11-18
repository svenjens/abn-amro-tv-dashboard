# E2E Tests

End-to-end tests for BingeList using Playwright.

## Running E2E Tests

```bash
# Run all e2e tests (headless)
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug
```

## Test Suites

### Homepage (homepage.spec.ts)

- Display hero section and search bar
- Display show cards
- Navigate to show details
- Display genre-grouped shows

### Search (search.spec.ts)

- Search bar functionality
- Navigate to search results
- Display search results
- Clear search input

### Watchlist (watchlist.spec.ts)

- Add show to watchlist
- Navigate to watchlist page
- Remove show from watchlist
- Persist watchlist in localStorage

### Show Details (show-details.spec.ts)

- Display show details page
- Display title and summary
- Display images
- Watchlist button functionality
- Navigate back to homepage

### Language Switching (language.spec.ts)

- Display language switcher
- Change language
- Persist language preference
- Show content in selected language

## Data Test IDs

All interactive elements use `data-testid` attributes for reliable test selection:

- `show-card-{id}` - Show card
- `show-card-image-{id}` - Show card image
- `watchlist-button-{id}` - Watchlist button
- `watchlist-link` - Watchlist navigation link
- `watchlist-count` - Watchlist item count badge
- `search-bar` - Search input

## Configuration

See `playwright.config.ts` for configuration options.
