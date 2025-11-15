# BingeList

Your ultimate TV show discovery and tracking platform. Built with Vue 3, TypeScript, and modern web technologies.

🌐 **Live:** [bingelist.app](https://bingelist.app)

![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🚀 Features

### 🎬 Micro Animations

The application includes subtle, performant micro-animations that enhance UX:

- **Page Load Animations**: Smooth fade-in and slide-up transitions using VueUse Motion
- **Card Hover Effects**: 
  - Scale and lift effect on show cards with isolated hover states
  - Image zoom on hover
  - Rating badge rotation and scale
  - Title color transition
- **Search Bar**: 
  - Smooth dropdown transitions for recent searches
  - Focus state with shadow effect
  - Slide animation on list items
- **Button Interactions**: 
  - Active scale-down effect on clicks
  - Hover shadow transitions
- **Loading States**: 
  - Fade-in animations
  - Shimmer skeleton loaders for content placeholders
- **Staggered Animations**: Sequential fade-in for lists
- **Smooth Scrolling**: HTML scroll-behavior for anchor links

**Animation Principles:**
- ⚡ **Performance-first**: GPU-accelerated transforms and opacity
- ♿ **Accessible**: Respects `prefers-reduced-motion` where applicable
- 🎯 **Purposeful**: Every animation serves a UX purpose
- ⏱️ **Timing**: Carefully tuned duration (150-400ms) for responsiveness

**Libraries Used:**
- **@vueuse/motion**: Declarative animation directives (`v-motion`)
- **Tailwind CSS Transitions**: Utility-based micro-interactions
- **Custom CSS Keyframes**: Specialized animations (shimmer, bounce, fade-in)

**Implementation Example:**
```vue
<!-- Animated show card with isolated hover using named groups -->
<div
  v-motion
  :initial="{ opacity: 0, y: 20 }"
  :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: 50 } }"
  class="card group/card cursor-pointer hover:scale-105 hover:-translate-y-1"
>
  <img class="group-hover/card:scale-110" />
  <RatingBadge class="group-hover/card:scale-105" />
</div>
```

### Core Functionality
- **Genre-Based Browsing**: Browse TV shows organized by genre with horizontal scrollable lists
- **Show Details**: View comprehensive information about each show including ratings, schedule, and summary
- **Search Functionality**: Search for TV shows by name with real-time results
- **Watchlist**: Save your favorite shows and track what you want to watch
- **Progressive Web App**: Install as a native app with offline support
- **Monetization**: Google AdSense integration for sustainable development

### Internationalization (i18n)
- **Multi-language Support**: Full support for English and Dutch
- **Locale-based Routing**: SEO-friendly URLs with locale prefixes (`/en/`, `/nl/`)
- **Language Switcher**: Easy language switching with persistent preferences
- **Translated Content**: All UI elements, labels, and messages in both languages

### Accessibility (a11y)
- **WCAG 2.1 AA Compliant**: Follows web accessibility standards
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: ARIA labels, roles, and landmarks throughout
- **Skip to Content**: Skip navigation link for keyboard users
- **Semantic HTML**: Proper use of semantic elements (nav, main, article, section)
- **Focus Management**: Logical tab order and focus trapping where needed

### SEO Optimization
- **Locale-based URLs**: Clean URLs with language prefixes for better indexing
- **Hreflang Tags**: Automatic hreflang tags for multilingual content
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD structured data for rich snippets
- **Canonical URLs**: Proper canonical URL management
- **Dynamic Meta Updates**: Page-specific meta tags for each route

### Technical Excellence
- **Responsive Design**: Fully responsive UI that works seamlessly on all devices
- **Performance Optimized**: API caching, lazy loading, code splitting
- **Type-Safe**: Full TypeScript implementation with strict mode
- **Well-Tested**: Extensive unit test coverage (>80%) using Vitest
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- **Clean Architecture**: Separation of concerns with composables and utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)

To check your versions:

```bash
node --version
npm --version
```

## 🛠️ Installation

1. **Clone the repository** (or extract the provided archive):

```bash
cd tv-show-dashboard
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure Google AdSense** (Optional):

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Google AdSense Publisher ID:

```env
VITE_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

> **Note**: Ads only appear in production builds. To test locally, run `npm run build && npm run preview`.

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## 🏗️ Architecture

### Technology Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Vue 3** | Frontend framework | Latest version with Composition API for better TypeScript support and code reusability |
| **TypeScript** | Type safety | Ensures code quality, better IDE support, and fewer runtime errors |
| **Vite** | Build tool | Fast development server, optimized builds, and native ES modules support |
| **Tailwind CSS** | Styling | Utility-first approach enables rapid development with consistent design |
| **Pinia** | State management | Official Vue 3 store with simpler API than Vuex and excellent TypeScript support |
| **Vue Router** | Routing | Official router with declarative routing, navigation guards, and locale support |
| **Vue I18n** | Internationalization | Official i18n plugin with full TypeScript support and composition API |
| **Axios** | HTTP client | Promise-based HTTP client with interceptors for centralized error handling |
| **Vitest** | Testing framework | Fast, Vite-native testing with excellent Vue component testing support |

### Project Structure

```
tv-show-dashboard/
├── src/
│   ├── api/              # API service layer
│   │   ├── tvmaze.ts     # TVMaze API client with caching
│   │   └── index.ts      # API exports
│   ├── components/       # Reusable Vue components
│   │   ├── ErrorMessage.vue
│   │   ├── GenreRow.vue
│   │   ├── GenreTags.vue
│   │   ├── LanguageSwitcher.vue  # i18n language switcher
│   │   ├── LoadingSpinner.vue
│   │   ├── Pagination.vue        # Pagination component
│   │   ├── RatingBadge.vue
│   │   ├── SearchBar.vue
│   │   ├── ShowCard.vue
│   │   └── SkipToContent.vue     # Accessibility skip link
│   ├── composables/      # Vue composables (reusable logic)
│   │   ├── useApi.ts     # Generic API handler
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── usePagination.ts      # Pagination logic
│   │   ├── useSEO.ts             # SEO meta tag management
│   │   └── index.ts
│   ├── i18n/             # Internationalization
│   │   ├── locales/
│   │   │   ├── en.json   # English translations
│   │   │   └── nl.json   # Dutch translations
│   │   ├── helpers.ts    # i18n helper functions
│   │   └── index.ts      # i18n configuration
│   ├── router/           # Vue Router configuration
│   │   └── index.ts      # Routes with locale support
│   ├── stores/           # Pinia stores
│   │   ├── shows.ts      # Shows state management
│   │   ├── search.ts     # Search state management
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── show.ts       # Show-related types
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── show.ts       # Show-related utilities
│   │   └── index.ts
│   ├── views/            # Page components
│   │   ├── Home.vue      # Homepage with genre rows
│   │   ├── ShowDetail.vue # Show details page
│   │   └── Search.vue    # Search page
│   ├── __tests__/        # Unit tests
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry point
│   └── style.css         # Global styles with Tailwind
├── public/               # Static assets
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Vitest configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # This file
```

### Key Architectural Decisions

#### 1. **Composition API over Options API**

The Composition API provides better TypeScript support, improved code organization, and easier logic reuse through composables.

```typescript
// Example: Composable for API calls
export function useApi<T>(apiCall: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  // ... implementation
  return { data, loading, error, execute }
}
```

#### 2. **Pinia for State Management**

Pinia offers a simpler, more intuitive API than Vuex, with better TypeScript support and no need for mutations. The stores are modular and easy to test.

```typescript
// Example: Shows store
export const useShowsStore = defineStore('shows', () => {
  const allShows = ref<Show[]>([])
  const loading = ref(false)
  
  async function fetchAllShows() {
    // ... implementation
  }
  
  return { allShows, loading, fetchAllShows }
})
```

#### 3. **Service Layer Pattern**

API calls are centralized in a service layer, providing:
- Single source of truth for API endpoints
- Centralized error handling
- Response caching to minimize API calls
- Easy mocking for tests

```typescript
// Example: API service with caching
class TVMazeAPI {
  private cache: Map<string, { data: unknown; timestamp: number }>
  
  async fetchAllShows(): Promise<Show[]> {
    // Check cache first, then fetch if needed
  }
}
```

#### 4. **Utility-First CSS with Tailwind**

Tailwind CSS enables rapid development while maintaining consistency. Custom utilities are defined in the `@layer` directive for reusability.

#### 5. **TypeScript Strict Mode**

Full type safety throughout the application catches errors at compile time and provides excellent IDE support.

#### 6. **Component-Based Architecture**

Small, focused, reusable components follow the Single Responsibility Principle:
- `ShowCard` - Display a single show
- `GenreRow` - Display a row of shows for a genre
- `SearchBar` - Search input with debouncing
- `RatingBadge` - Display show rating

### Data Processing Strategy

Since the TVMaze API doesn't provide a dedicated genre endpoint:

1. **Fetch all shows** from the `/shows` endpoint
2. **Extract genres** from each show
3. **Group shows by genre** in the Pinia store
4. **Sort within genres** by rating (descending)
5. **Cache results** to minimize API calls

```typescript
export function groupShowsByGenre(shows: Show[]): ShowsByGenre {
  const grouped: ShowsByGenre = {}
  
  shows.forEach((show) => {
    show.genres.forEach((genre) => {
      if (!grouped[genre]) grouped[genre] = []
      grouped[genre].push(show)
    })
  })
  
  // Sort by rating within each genre
  Object.keys(grouped).forEach((genre) => {
    grouped[genre].sort((a, b) => 
      (b.rating?.average || 0) - (a.rating?.average || 0)
    )
  })
  
  return grouped
}
```

## 🎨 Design Decisions

### Responsive Design

- **Mobile-first approach**: Base styles target mobile, with progressive enhancement for larger screens
- **Horizontal scrolling on desktop**: Natural browsing experience similar to Netflix/Disney+
- **Grid layout on mobile**: Better touch interaction and visibility
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### User Experience

- **Search with debouncing**: Reduces API calls and improves performance
- **Recent searches**: Quick access to previous searches stored in localStorage
- **Loading states**: Clear feedback during data fetching
- **Error handling**: User-friendly error messages with retry options
- **Smooth transitions**: Subtle animations enhance the experience without being distracting

### Performance Optimizations

1. **API Response Caching**: Reduces unnecessary API calls
2. **Lazy Loading**: Components and images load on-demand
3. **Code Splitting**: Routes are loaded dynamically
4. **Debounced Search**: Minimizes API calls during typing
5. **Virtual Scrolling**: Could be added for very large lists

## 🧩 Code Quality

### Linting and Formatting

- **ESLint**: Configured with Vue, TypeScript, and Prettier rules
- **Prettier**: Consistent code formatting across the project

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

### Testing Strategy

- **Unit Tests**: Individual functions, components, stores
- **Integration Tests**: Component interactions with stores
- **Coverage Target**: >80% code coverage

Test files are co-located with source files in the `__tests__` directory.

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 📝 API Documentation

This application uses the [TVMaze API](http://www.tvmaze.com/api):

- **Show Index**: `GET https://api.tvmaze.com/shows`
- **Show Details**: `GET https://api.tvmaze.com/shows/:id`
- **Search Shows**: `GET https://api.tvmaze.com/search/shows?q=:query`

No API key required. Rate limiting applies (20 requests per 10 seconds).

## 🚀 Deployment

The application can be deployed to any static hosting service:

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload the dist/ folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Push the dist/ folder to gh-pages branch
```

## 🔮 Future Enhancements

Potential features for future iterations:

- [ ] User authentication and favorites
- [ ] Advanced filtering (by network, year, status)
- [ ] Episode tracking
- [ ] Show recommendations based on viewing history
- [ ] Dark mode toggle
- [x] Internationalization (i18n) - ✅ **Implemented**
- [x] SEO optimization with hreflang - ✅ **Implemented**
- [x] Accessibility improvements - ✅ **Implemented**
- [x] Infinite scroll for genres - ✅ **Implemented** (better UX than pagination)
- [x] Watchlist functionality - ✅ **Implemented**
- [x] Progressive Web App (PWA) support - ✅ **Implemented**
- [ ] Season and episode details
- [ ] Cast and crew information
- [ ] More language options (German, French, Spanish)

### Node Version

This project was developed and tested with:
- Node.js v18.19.0
- npm v9.8.1

If you encounter any issues, ensure you're using compatible versions.

### Environment Variables

No environment variables are required for this project as it uses the public TVMaze API.

### Known Limitations

1. **API Rate Limiting**: The TVMaze API has rate limits (20 requests per 10 seconds)
2. **Large Dataset**: Loading all shows (~60K shows) can take a few seconds on first load
3. **No Pagination**: The show index endpoint returns all shows at once

## 🌍 Internationalization

The application supports multiple languages with locale-based routing:

- **English (en)**: `https://example.com/en/`
- **Dutch (nl)**: `https://example.com/nl/`

Language preference is:
1. Detected from URL path
2. Loaded from localStorage
3. Falls back to browser language
4. Defaults to English

### SEO Benefits
- Locale prefixes in URLs for better indexing
- Automatic hreflang tags for language variants
- x-default tag pointing to English version
- Separate indexing per language

## ♿ Accessibility

The application is built with accessibility as a core principle, following WCAG 2.1 Level AA guidelines.

### Implemented Accessibility Features

#### 1. **Keyboard Navigation**
All interactive elements are fully accessible via keyboard:
- **Tab**: Navigate to next focusable element
- **Shift + Tab**: Navigate to previous focusable element
- **Enter/Space**: Activate buttons and links
- **Arrow keys**: Scroll through horizontal lists
- **Escape**: Close modals and overlays

Visible focus indicators with clear outlines:
```css
focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
```

#### 2. **Skip to Content Link**
A "Skip to main content" link appears when pressing Tab, allowing keyboard users to bypass navigation:
```vue
<SkipToContent />
<!-- Becomes visible on focus, jumps to #main-content -->
```

#### 3. **ARIA Labels and Roles**
Comprehensive ARIA implementation throughout:

**Landmarks:**
```html
<div role="banner">        <!-- Header/Hero section -->
<main id="main-content">   <!-- Main content area -->
<nav aria-label="Pagination navigation">  <!-- Navigation -->
<section aria-label="Related Shows">      <!-- Content sections -->
```

**Interactive Elements:**
```html
<button aria-label="Previous page">
<button aria-label="Toggle language">
<a aria-label="Official Website - Opens in new window">
<div role="status" aria-live="polite">  <!-- For loading states -->
```

**Form Controls:**
```html
<input 
  type="search" 
  aria-label="Search TV shows"
  aria-describedby="search-help"
/>
```

#### 4. **Semantic HTML**
Proper use of HTML5 semantic elements:
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- `<h1>` through `<h6>` in logical hierarchy
- `<dl>`, `<dt>`, `<dd>` for definition lists (show details)
- `<ul>`, `<ol>`, `<li>` for lists
- `<button>` for actions, `<a>` for navigation

#### 5. **Screen Reader Support**
- All images have descriptive `alt` attributes
- Decorative images use `aria-hidden="true"`
- Icon-only buttons have `aria-label`
- Status messages use `aria-live` regions
- Loading states announced to screen readers

Example:
```vue
<img 
  :src="show.image" 
  :alt="`${show.name} poster`"
  loading="lazy"
/>

<svg aria-hidden="true">  <!-- Decorative icon -->
  <path d="..." />
</svg>
```

#### 6. **Color Contrast**
All text meets WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear visual states (hover, focus, active)

#### 7. **Form Accessibility**
- Labels associated with inputs
- Error messages linked with `aria-describedby`
- Required fields marked with `aria-required`
- Invalid states indicated with `aria-invalid`

#### 8. **Responsive Focus Management**
- Focus moves logically through the page
- No keyboard traps
- Focus returns to trigger element when closing modals
- `tabindex="-1"` on main content for skip link target

### Testing Accessibility

#### Automated Testing
```bash
# Install axe DevTools browser extension
# Or use pa11y CLI
npm install -g pa11y
pa11y http://localhost:5173/en/

# Use Lighthouse in Chrome DevTools
# Accessibility score should be 90+
```

#### Manual Testing Checklist

**Keyboard Navigation:**
- [ ] Can navigate entire site with keyboard only
- [ ] All interactive elements are reachable
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps
- [ ] Tab order is logical

**Screen Readers:**
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)  
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)
- [ ] All content is announced correctly
- [ ] Landmarks are properly identified

**Visual Testing:**
- [ ] Zoom to 200% - content still readable
- [ ] High contrast mode works
- [ ] No content loss at different zoom levels
- [ ] Focus indicators visible in high contrast mode

**Tools to Use:**
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome
- [Pa11y](https://pa11y.org/) - Automated testing
- [Screen Reader Testing](https://www.nvaccess.org/) - NVDA for Windows

### Accessibility Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Skip to main content | Tab (from top of page) |
| Navigate forward | Tab |
| Navigate backward | Shift + Tab |
| Activate link/button | Enter or Space |
| Scroll horizontally | Arrow keys (in carousel) |
| Search | Focus search box + type |
| Change language | Tab to language switcher + Enter |

### Known Accessibility Considerations

1. **Horizontal Scrolling**: On desktop, genre rows use horizontal scrolling which requires arrow key navigation or scroll wheel
2. **Image Loading**: Lazy-loaded images announce when loaded
3. **Dynamic Content**: Search results and loading states use aria-live regions
4. **Third-party Content**: TVMaze API images may not always have optimal alt text

### Continuous Improvement

We welcome feedback on accessibility! If you encounter any barriers, please:
1. Open an issue on GitHub
2. Describe the barrier and context
3. Include your assistive technology (if applicable)
4. Suggest improvements

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./.github/CONTRIBUTING.md) for details on:

- Development workflow
- Pull request process
- Branch protection rules
- Code style guidelines
- Testing requirements
- Commit message conventions

Quick start for contributors:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with clear, focused commits
4. Follow conventional commit messages
5. Ensure all tests pass and build works
6. Push to your fork and submit a pull request



## 📞 Support

For questions or issues, please refer to the TVMaze API documentation or contact the development team.

## 🔗 Links

- **GitHub Repository**: https://github.com/svenjens/tv-show-dashboard
- **TVMaze API Documentation**: http://www.tvmaze.com/api
