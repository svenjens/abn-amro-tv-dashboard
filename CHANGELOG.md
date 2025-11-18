# Changelog

## [3.2.0](https://github.com/svenjens/tv-show-dashboard/compare/v3.1.0...v3.2.0) (2025-11-18)


### Features

* implement best practices improvements ([#69](https://github.com/svenjens/tv-show-dashboard/issues/69)) ([b49d136](https://github.com/svenjens/tv-show-dashboard/commit/b49d1367c4ece89d2fd47f9d7ecaffb8c8a58b94))

## [3.1.0](https://github.com/svenjens/tv-show-dashboard/compare/v3.0.1...v3.1.0) (2025-11-18)

### Features

- add streaming service logos with gradient backgrounds ([#66](https://github.com/svenjens/tv-show-dashboard/issues/66)) ([024ffb7](https://github.com/svenjens/tv-show-dashboard/commit/024ffb74095e2c98be0209176611137d6a234c36))
- CDN subdomain image proxy ([#63](https://github.com/svenjens/tv-show-dashboard/issues/63)) ([3b90c3b](https://github.com/svenjens/tv-show-dashboard/commit/3b90c3b9bdaf7ff3582bdc8338bb81b1ced14ced))

### Bug Fixes

- **a11y:** fix ARIA tab roles and CSP for Google Funding Choices ([d7dc2f5](https://github.com/svenjens/tv-show-dashboard/commit/d7dc2f5d5d9a5dbd87025710124c587da759277b))
- **a11y:** improve accessibility score to 100/100 ([587017e](https://github.com/svenjens/tv-show-dashboard/commit/587017e93917f1569834fe0bc218aafc4b800af2))
- **csp:** add Google Funding Choices to CSP connect-src ([43cd392](https://github.com/svenjens/tv-show-dashboard/commit/43cd392aea4edf7d4f6d62f75728c1b5a9b5447f))
- **csp:** correct Google domains - keep separate TLDs ([eee7bf8](https://github.com/svenjens/tv-show-dashboard/commit/eee7bf8b46f1134f15516cec3b1c1f9add5b6194))
- increase rate limit for AdSense crawler compatibility ([ead9d77](https://github.com/svenjens/tv-show-dashboard/commit/ead9d770c0e0e3283dd7dfad5984cd36ce81f7cf))

## [3.0.1](https://github.com/svenjens/tv-show-dashboard/compare/v3.0.0...v3.0.1) (2025-11-17)

### Bug Fixes

- resolve CSP and OG image issues ([617c2a5](https://github.com/svenjens/tv-show-dashboard/commit/617c2a539a90989157b1daf6cdbeae9501d9a066))

## [3.0.0](https://github.com/svenjens/tv-show-dashboard/compare/v2.0.0...v3.0.0) (2025-11-17)

### ⚠ BREAKING CHANGES

- Replaced custom regex-based HTML sanitizer with proven sanitize-html library
- Replaced custom regex-based HTML sanitizer with proven sanitize-html library
- Replaced custom regex-based HTML sanitizer with proven sanitize-html library
- Replaced custom regex-based HTML sanitizer with proven sanitize-html library
- Requires Nuxt 4 for import.meta.\* support

### Features

- add dynamic favicons based on color scheme ([bd5bb02](https://github.com/svenjens/tv-show-dashboard/commit/bd5bb02a3418152e6db2460434ec3aa1e88309e5))
- add nuxt eslint configuration and fix linting issues ([78d63f5](https://github.com/svenjens/tv-show-dashboard/commit/78d63f531d3e2a39cbb034ba308ae6bad75deabd))
- add pre-push git hooks for quality checks ([46340e1](https://github.com/svenjens/tv-show-dashboard/commit/46340e143250ba7d39da54f7e2541321df2b29c5))
- add pre-push git hooks for quality checks ([60da947](https://github.com/svenjens/tv-show-dashboard/commit/60da947b87f8e141a62a0afd265d7c4bb506e161))
- add pre-push git hooks for quality checks ([3ee9773](https://github.com/svenjens/tv-show-dashboard/commit/3ee9773e7041e1584c2c66c7fbc15d88058ab8ef))
- add pre-push git hooks for quality checks ([0fa258c](https://github.com/svenjens/tv-show-dashboard/commit/0fa258cd293199b7450ba44413accb50ba1dbb91))
- add server-side genre grouping and rating sort ([7ca2623](https://github.com/svenjens/tv-show-dashboard/commit/7ca26234b974a63a13d59965eb2d18201f4c590e))
- add spanish language option to footer ([25c06a1](https://github.com/svenjens/tv-show-dashboard/commit/25c06a12051abcf4e0f5d9f4b1a5cdb2ae9a54b3))
- add vercel analytics and speed insights ([b8f8d1d](https://github.com/svenjens/tv-show-dashboard/commit/b8f8d1d169e8e6aa79017873862e5fce2994f144))
- implement browser language detection with prefix strategy ([#57](https://github.com/svenjens/tv-show-dashboard/issues/57)) ([1c92ed6](https://github.com/svenjens/tv-show-dashboard/commit/1c92ed6312ea61d4737c6a03a7c978ed7e47ccea))
- preserve search query when navigating to search page ([cd004c6](https://github.com/svenjens/tv-show-dashboard/commit/cd004c6e3f08040631c129d0a68a5035766b4f20))

### Bug Fixes

- improve search mode info visibility when switching with existing query ([#56](https://github.com/svenjens/tv-show-dashboard/issues/56)) ([97de1b1](https://github.com/svenjens/tv-show-dashboard/commit/97de1b1f46275a3357556169f9c13a10729ffb92))
- prevent 500 errors in API cache keys ([#53](https://github.com/svenjens/tv-show-dashboard/issues/53)) ([3ee9773](https://github.com/svenjens/tv-show-dashboard/commit/3ee9773e7041e1584c2c66c7fbc15d88058ab8ef))
- resolve all eslint warnings and unused variables ([d3f0b5a](https://github.com/svenjens/tv-show-dashboard/commit/d3f0b5a407365c81322865471b9388c9ea4628c4))
- resolve all remaining TypeScript errors ([81f4ee8](https://github.com/svenjens/tv-show-dashboard/commit/81f4ee85f3e4e24a37576c5bf0671627b68a275f))
- resolve coverage artifact upload error with invalid filenames ([3db6abe](https://github.com/svenjens/tv-show-dashboard/commit/3db6abee67e0cde267f14b815a71602bff77721f))
- resolve remaining typescript config errors ([f6a2f32](https://github.com/svenjens/tv-show-dashboard/commit/f6a2f326ef367a9e3f0362c343cf70e626425120))
- resolve typescript and linting errors ([aaf7a2b](https://github.com/svenjens/tv-show-dashboard/commit/aaf7a2bb4f5e4104ab9c712c63f073a09755cd01))
- resolve useLocation test failures with resetLocation helper ([6b98e84](https://github.com/svenjens/tv-show-dashboard/commit/6b98e84a497309009b79eddada0cf7a911b84b09))
- Resolve Vercel serverless environment errors ([#52](https://github.com/svenjens/tv-show-dashboard/issues/52)) ([0fa258c](https://github.com/svenjens/tv-show-dashboard/commit/0fa258cd293199b7450ba44413accb50ba1dbb91))
- simplify cache warming to prevent TVMaze rate limiting ([#54](https://github.com/svenjens/tv-show-dashboard/issues/54)) ([60da947](https://github.com/svenjens/tv-show-dashboard/commit/60da947b87f8e141a62a0afd265d7c4bb506e161))
- transform TMDB provider data to correct StreamingAvailability interface ([88ec8b2](https://github.com/svenjens/tv-show-dashboard/commit/88ec8b25ae1db49f4431318061b8f6a342a20bfc))
- update cache warming to handle new API response structure ([264902b](https://github.com/svenjens/tv-show-dashboard/commit/264902bbc7c0acde5a2df3df834a92474837f15b))
- update deprecated release-please action ([000ab4d](https://github.com/svenjens/tv-show-dashboard/commit/000ab4d9f4fd0b133255f8e639dc632cb126aff2))
- update tests for new API response structure and add color mode mock ([1c5a0de](https://github.com/svenjens/tv-show-dashboard/commit/1c5a0deae0e8b165531f8f99f64b02f3ba1c63c1))
- use innerHTML instead of children for script structured data ([9148eae](https://github.com/svenjens/tv-show-dashboard/commit/9148eaeb9a603f84a1b9d28a34314378172838cb))

### Code Refactoring

- upgrade to nuxt 4 patterns ([048c602](https://github.com/svenjens/tv-show-dashboard/commit/048c602b70bc3b9aff5e0672b2f22019d6e6a2f0))

## [2.0.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.17.0...v2.0.0) (2025-11-17)

### ⚠ BREAKING CHANGES

- Remove client-side API layer (api/\*)

### Features

- **i18n:** add Spanish language support and enable browser language detection ([a5bf71c](https://github.com/svenjens/tv-show-dashboard/commit/a5bf71c55c1f89d3883e9b617b046fd65b68eb60))
- implement AI semantic search with GPT-3.5 ([04832c8](https://github.com/svenjens/tv-show-dashboard/commit/04832c8d595c962781b5bc8b6d5e7b8e60d5ff72))
- improve caching with Nitro cachedEventHandler and smart cache warming ([b931944](https://github.com/svenjens/tv-show-dashboard/commit/b931944eaa24d25dc0836f58b148e2161c1329c9))
- migrate to Nuxt 3 with SSR and enhanced SEO ([a6cf3fd](https://github.com/svenjens/tv-show-dashboard/commit/a6cf3fd2f3dd4f53ba215dd59725ad505dd3d632))
- migrate to server-side API architecture with SSR/SWR caching ([84f3972](https://github.com/svenjens/tv-show-dashboard/commit/84f397272d417d7cd7e7abeee5d5cfc64d6b7f67))
- **modules:** add official Nuxt modules for improved functionality ([2f6286a](https://github.com/svenjens/tv-show-dashboard/commit/2f6286a18d51cd4653b8cd418b20ff4d14f6b88f))
- **nuxt:** complete Nuxt 3 migration with SSR and location detection ([695b27a](https://github.com/svenjens/tv-show-dashboard/commit/695b27a1c721420ae005a7a546c6bd79a087fa20))
- **streaming:** add deep linking to show search on platforms ([6da5e00](https://github.com/svenjens/tv-show-dashboard/commit/6da5e0025e81f652c09a795b4188422c2e9e9eac))
- **streaming:** use detected country and branded cards for streaming platforms ([51542e6](https://github.com/svenjens/tv-show-dashboard/commit/51542e62b234f14ed7fff79044ef29381682423e))

### Bug Fixes

- add type annotations and update tests for server API migration ([c75fefb](https://github.com/svenjens/tv-show-dashboard/commit/c75fefbd3569a1a5ba7f704b615cec8141a1daca))
- **nuxt:** resolve PostCSS configuration warning ([b658525](https://github.com/svenjens/tv-show-dashboard/commit/b65852548be1b1cf01cd1e9e32ea6aec1e104dfc))
- **nuxt:** resolve SSR and routing issues ([65d70e4](https://github.com/svenjens/tv-show-dashboard/commit/65d70e4acd89948909d7969933c2a0e8211a052a))
- replace dompurify with isomorphic-dompurify for SSR compatibility ([66d00d5](https://github.com/svenjens/tv-show-dashboard/commit/66d00d5d419da1881a5d31ae0b35b8d9791dcfab))

### Performance Improvements

- move HTML sanitization to server-side for better performance ([0063907](https://github.com/svenjens/tv-show-dashboard/commit/00639072488e85897e43443b28fddb11e85bef34))

### Code Refactoring

- remove duplicate API layer, use server routes exclusively ([b9edf3a](https://github.com/svenjens/tv-show-dashboard/commit/b9edf3a92d71f387ad9d924d9f532d73af968b63))

## [1.17.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.16.0...v1.17.0) (2025-11-16)

### Features

- **streaming:** add horizontal layout with empty state ([#47](https://github.com/svenjens/tv-show-dashboard/issues/47)) ([78115a0](https://github.com/svenjens/tv-show-dashboard/commit/78115a09a60916ea2ac3b000eae4f69714bd5740))
- **streaming:** add UTM tracking and make utilities public ([c4bf7ab](https://github.com/svenjens/tv-show-dashboard/commit/c4bf7aba6bfa456e54845ae66cbf4003a796436a))

## [1.16.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.15.0...v1.16.0) (2025-11-16)

### Features

- add adaptive favicon for light and dark mode ([2bb15d9](https://github.com/svenjens/tv-show-dashboard/commit/2bb15d9fc7cc728876f887f703924b07fa94c238))
- generate adaptive favicons with AI ([0539a72](https://github.com/svenjens/tv-show-dashboard/commit/0539a72c178c9d6ffda3dc4639abad675ab24e2d))
- update branding script to generate adaptive favicons ([e57d344](https://github.com/svenjens/tv-show-dashboard/commit/e57d34409c3cc8477eae3b3053a27316325bd0e9))

### Bug Fixes

- remove absolute filesystem paths from branding metadata ([b67ec33](https://github.com/svenjens/tv-show-dashboard/commit/b67ec3360802b7b8d1de4b005fd3997ac6751dcb))
- remove duplicate 'disclaimer' and 'accessibility' keys in legal translations ([f8fcd63](https://github.com/svenjens/tv-show-dashboard/commit/f8fcd630fcf5fc92a17cfa560fdc2b7e38582c0d))
- resolve translation key conflicts for legal footer ([9c0ebbd](https://github.com/svenjens/tv-show-dashboard/commit/9c0ebbda76543a8888d1cb1f90c250d6ab96b77d))

## [1.15.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.14.0...v1.15.0) (2025-11-16)

### Features

- Add filters to home page ([#43](https://github.com/svenjens/tv-show-dashboard/issues/43)) ([1b0fcff](https://github.com/svenjens/tv-show-dashboard/commit/1b0fcff0d61453fd125ebb1f75ebdedfb3da6685))
- Add Google Tag Manager / Google Ads tracking ([#42](https://github.com/svenjens/tv-show-dashboard/issues/42)) ([f00c937](https://github.com/svenjens/tv-show-dashboard/commit/f00c9376e523a6eb95e91ca8e32c611f33d2a05e))

## [1.14.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.13.0...v1.14.0) (2025-11-16)

### Features

- Add streaming availability with affiliate links ([#40](https://github.com/svenjens/tv-show-dashboard/issues/40)) ([aa80e26](https://github.com/svenjens/tv-show-dashboard/commit/aa80e2658d079fa152727bd58cbed329ba3a5fde))

### Bug Fixes

- improve ShowCard layout consistency and alignment ([#38](https://github.com/svenjens/tv-show-dashboard/issues/38)) ([5eb4c2d](https://github.com/svenjens/tv-show-dashboard/commit/5eb4c2d499296e16999b8e836c2cfdbc1b4974f4))

## [1.13.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.12.0...v1.13.0) (2025-11-16)

### Features

- add legal page navigation links to footer ([#36](https://github.com/svenjens/tv-show-dashboard/issues/36)) ([586ab8f](https://github.com/svenjens/tv-show-dashboard/commit/586ab8f3685806f5f91a7587376ea43ed6bfc53d))

## [1.12.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.11.0...v1.12.0) (2025-11-15)

### Features

- implement dark mode with system preference detection ([#33](https://github.com/svenjens/tv-show-dashboard/issues/33)) ([cc333ec](https://github.com/svenjens/tv-show-dashboard/commit/cc333ecb965e37caacde3a84760f8e8329bb2d84))

## [1.11.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.10.0...v1.11.0) (2025-11-15)

### Features

- add enhanced PR comments with bundle size comparison ([#31](https://github.com/svenjens/tv-show-dashboard/issues/31)) ([03d84dd](https://github.com/svenjens/tv-show-dashboard/commit/03d84dddc4b199454a7094b56f700c1d7c7db48a))

## [1.10.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.9.0...v1.10.0) (2025-11-15)

### Features

- add enhanced PR comments with bundle size comparison ([95aa8ea](https://github.com/svenjens/tv-show-dashboard/commit/95aa8eaceeaa5ae03f2673d6a4f1c944e8427bd8))

## [1.9.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.8.0...v1.9.0) (2025-11-15)

### Features

- implement SEO-friendly URLs with show name slugs ([#28](https://github.com/svenjens/tv-show-dashboard/issues/28)) ([45c0e46](https://github.com/svenjens/tv-show-dashboard/commit/45c0e46860e2e418e85063a5901d595c96b7527b))

### Bug Fixes

- resolve build errors and remove redundant AI link from header ([d25bf83](https://github.com/svenjens/tv-show-dashboard/commit/d25bf834cd22e834ad52fb956982eb4ce9afc545))

## [1.8.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.7.1...v1.8.0) (2025-11-15)

### Features

- add AI Vision & Roadmap page ([#26](https://github.com/svenjens/tv-show-dashboard/issues/26)) ([0b34170](https://github.com/svenjens/tv-show-dashboard/commit/0b34170af9eebc45c944df4e35a16459dc72d73d))

## [1.7.1](https://github.com/svenjens/tv-show-dashboard/compare/v1.7.0...v1.7.1) (2025-11-15)

### Bug Fixes

- exclude .txt files from service worker for ads.txt verification ([#23](https://github.com/svenjens/tv-show-dashboard/issues/23)) ([83d36b5](https://github.com/svenjens/tv-show-dashboard/commit/83d36b5b5716f89b5dda0e2654f8c36ef8a2c236))

## [1.7.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.6.0...v1.7.0) (2025-11-15)

### Features

- episode tracking, seasons, and cast information ([#20](https://github.com/svenjens/tv-show-dashboard/issues/20)) ([607d28b](https://github.com/svenjens/tv-show-dashboard/commit/607d28b0f7449a255940aa38f42a72d24fcecaa7))

## [1.6.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.5.0...v1.6.0) (2025-11-15)

### Features

- navigate to search view on search bar focus ([#18](https://github.com/svenjens/tv-show-dashboard/issues/18)) ([dd88746](https://github.com/svenjens/tv-show-dashboard/commit/dd887465784c00bceaf27696bf8171b99bcb1853))

## [1.5.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.4.0...v1.5.0) (2025-11-15)

### Features

- add Google AdSense integration ([#16](https://github.com/svenjens/tv-show-dashboard/issues/16)) ([5bc0bd2](https://github.com/svenjens/tv-show-dashboard/commit/5bc0bd2ae236aa0c03f3b3f9fa5a6dbfac1727ae))

## [1.4.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.3.0...v1.4.0) (2025-11-15)

### Features

- complete rebrand to BingeList with new brand assets ([#13](https://github.com/svenjens/tv-show-dashboard/issues/13)) ([bc7222a](https://github.com/svenjens/tv-show-dashboard/commit/bc7222a198d0fa9c19a795740ff764933696422f))

## [1.3.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.2.0...v1.3.0) (2025-11-15)

### Features

- watchlist functionality + PWA support ([#11](https://github.com/svenjens/tv-show-dashboard/issues/11)) ([e2d62fb](https://github.com/svenjens/tv-show-dashboard/commit/e2d62fb78b5f9f4ac74052123a500a2be6421e43))

## [1.2.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.1.1...v1.2.0) (2025-11-15)

### Features

- add watchlist functionality ([#9](https://github.com/svenjens/tv-show-dashboard/issues/9)) ([07e9b53](https://github.com/svenjens/tv-show-dashboard/commit/07e9b53731926301a6d6ad99c13fefd822df109d))

## [1.1.1](https://github.com/svenjens/tv-show-dashboard/compare/v1.1.0...v1.1.1) (2025-11-15)

### Performance Improvements

- complete performance optimization suite ([#7](https://github.com/svenjens/tv-show-dashboard/issues/7)) ([0f1b0db](https://github.com/svenjens/tv-show-dashboard/commit/0f1b0db0fd9f79005836d9ee2e19a83e3d16fec1))

## [1.1.0](https://github.com/svenjens/tv-show-dashboard/compare/v1.0.0...v1.1.0) (2025-11-14)

### Features

- add advanced deployment pipeline with Vercel ([84ab559](https://github.com/svenjens/tv-show-dashboard/commit/84ab559b069e403d0496922547642017ffd8781e))
- add advanced query caching system ([a63899c](https://github.com/svenjens/tv-show-dashboard/commit/a63899c8444ac71346107e95765b97e0bca88399))
- add AI-powered branding asset generator ([8c86516](https://github.com/svenjens/tv-show-dashboard/commit/8c8651648681fc6b67d62e4d9395bf74df210bb7))
- add automatic changelog and release management ([c267bdd](https://github.com/svenjens/tv-show-dashboard/commit/c267bdddd3a78292712638ff2c0e810dd90472ef))
- add genre overview page with clickable titles and view all button ([241a831](https://github.com/svenjens/tv-show-dashboard/commit/241a8315d540904cf7d6348eb791332e8f303417))
- add GitHub token to Lighthouse CI for PR status checks ([634c09b](https://github.com/svenjens/tv-show-dashboard/commit/634c09b64d16e0acdfd98c18fa7540d05339402d))
- add i18n, accessibility, SEO and pagination features ([fa9b33a](https://github.com/svenjens/tv-show-dashboard/commit/fa9b33a8b38b31d7571c328fd8ea832455b7a924))
- add image optimization script with WebP support ([8b57dec](https://github.com/svenjens/tv-show-dashboard/commit/8b57deceeeff733ac9349a985caf772ca2b4c5e4))
- add micro animations and fix locale navigation ([8644d76](https://github.com/svenjens/tv-show-dashboard/commit/8644d76bee6dd2ea87a21d2621e7b2f850aa25c8))
- add PR workflow with templates and branch protection guide ([b94a69c](https://github.com/svenjens/tv-show-dashboard/commit/b94a69c08d9fa03c74ba9002e82b62db2416e63e))
- add SEO and AI crawler support with Lighthouse fixes ([0942faf](https://github.com/svenjens/tv-show-dashboard/commit/0942faf923d9784eacc693c03798a1e8eb8f46a3))
- generate professional brand assets with gpt-image-1 ([bd32ef2](https://github.com/svenjens/tv-show-dashboard/commit/bd32ef2d24bdd7ecd14a39b54ad56fad266d0ec1))
- implement enterprise-level TV show dashboard with Vue 3, TypeScript, and Tailwind CSS ([6d624e9](https://github.com/svenjens/tv-show-dashboard/commit/6d624e918b68bf337139a6248246804928056838))
- improve UI layout and navigation ([c2d013a](https://github.com/svenjens/tv-show-dashboard/commit/c2d013a5acb4c234a95bb0825cee9bf50f8794a0))
- improve UI navigation consistency ([07546a5](https://github.com/svenjens/tv-show-dashboard/commit/07546a57f34be64ee523b07db4849b3e8b95ac8c))
- integrate AI-generated brand assets into application ([fbb9afe](https://github.com/svenjens/tv-show-dashboard/commit/fbb9afeb534d6f87eab248cedd89c85b3ee57d44))

### Bug Fixes

- add GitHub Actions permissions for PR comments ([a0125ea](https://github.com/svenjens/tv-show-dashboard/commit/a0125eaec3758c1320f62c860a7dfc72639432b2))
- add route watcher to reload show details on navigation ([87807cf](https://github.com/svenjens/tv-show-dashboard/commit/87807cf6ed1c8ffd3f9470330a76e3a452cf463f))
- align card titles with consistent height ([b2c7aed](https://github.com/svenjens/tv-show-dashboard/commit/b2c7aede986eb549f0bc182955b5ff355fd4b7d5))
- completely remove vertical scroll from genre rows ([1095a3d](https://github.com/svenjens/tv-show-dashboard/commit/1095a3d3be6505cc88193fbd18eb25f9630fb2ae))
- improve accessibility with keyboard navigation ([c884c5d](https://github.com/svenjens/tv-show-dashboard/commit/c884c5dcc6fb856728122f9be926541ebcff1716))
- remove remaining /optimized/ image references in Home.vue ([525126c](https://github.com/svenjens/tv-show-dashboard/commit/525126c9b2cbde14b367c0343c2db782bb7e26fb))
- remove vertical scroll and align genre pills ([07316f2](https://github.com/svenjens/tv-show-dashboard/commit/07316f264027482e84f17d07e44c48f656e4c681))
- resolve accessibility issues and add security improvements ([2c1b47e](https://github.com/svenjens/tv-show-dashboard/commit/2c1b47ea795a62256b8985f7d73c176f6a4358aa))
- resolve all TypeScript warnings and console errors ([2fa6d76](https://github.com/svenjens/tv-show-dashboard/commit/2fa6d76832db625ebe40c3610a52eed5b009890a))
- resolve CI pipeline issues and add security improvements ([b142a25](https://github.com/svenjens/tv-show-dashboard/commit/b142a25763b9666bba90f8ae35c11c9b7ec57d90))
- resolve useSEO fullPath error by removing route watcher ([e989b90](https://github.com/svenjens/tv-show-dashboard/commit/e989b907bb46d918599dac2bc001c7ba0ba8c282))
- resolve Vite build errors by using direct public paths ([4794821](https://github.com/svenjens/tv-show-dashboard/commit/4794821268dc2ce9690f93cc56df3f886e5c42e6))
- resolve Vite build errors with optimized images ([05a4938](https://github.com/svenjens/tv-show-dashboard/commit/05a4938715538c46fa0d9c17ffc8ae4aed91b8dd))
- update branding generator to use gpt-image-1 ([8f35eba](https://github.com/svenjens/tv-show-dashboard/commit/8f35eba53f0e1be189dd3a4aad3e1f29a38bb9c5))
- update image imports to use Vite ESM imports and sync brand colors ([9e5be19](https://github.com/svenjens/tv-show-dashboard/commit/9e5be19dfcd73dad060844d487decced54587528))
- use correct Vercel output for preview URL ([0e23f64](https://github.com/svenjens/tv-show-dashboard/commit/0e23f64d0cd1cd700ccac0bc7bdd01dba56ec5a0))

## 1.0.0 (2025-11-14)

### Features

- add advanced deployment pipeline with Vercel ([84ab559](https://github.com/svenjens/tv-show-dashboard/commit/84ab559b069e403d0496922547642017ffd8781e))
- add advanced query caching system ([a63899c](https://github.com/svenjens/tv-show-dashboard/commit/a63899c8444ac71346107e95765b97e0bca88399))
- add AI-powered branding asset generator ([8c86516](https://github.com/svenjens/tv-show-dashboard/commit/8c8651648681fc6b67d62e4d9395bf74df210bb7))
- add automatic changelog and release management ([c267bdd](https://github.com/svenjens/tv-show-dashboard/commit/c267bdddd3a78292712638ff2c0e810dd90472ef))
- add genre overview page with clickable titles and view all button ([241a831](https://github.com/svenjens/tv-show-dashboard/commit/241a8315d540904cf7d6348eb791332e8f303417))
- add GitHub token to Lighthouse CI for PR status checks ([634c09b](https://github.com/svenjens/tv-show-dashboard/commit/634c09b64d16e0acdfd98c18fa7540d05339402d))
- add i18n, accessibility, SEO and pagination features ([fa9b33a](https://github.com/svenjens/tv-show-dashboard/commit/fa9b33a8b38b31d7571c328fd8ea832455b7a924))
- add image optimization script with WebP support ([8b57dec](https://github.com/svenjens/tv-show-dashboard/commit/8b57deceeeff733ac9349a985caf772ca2b4c5e4))
- add micro animations and fix locale navigation ([8644d76](https://github.com/svenjens/tv-show-dashboard/commit/8644d76bee6dd2ea87a21d2621e7b2f850aa25c8))
- add PR workflow with templates and branch protection guide ([b94a69c](https://github.com/svenjens/tv-show-dashboard/commit/b94a69c08d9fa03c74ba9002e82b62db2416e63e))
- add SEO and AI crawler support with Lighthouse fixes ([0942faf](https://github.com/svenjens/tv-show-dashboard/commit/0942faf923d9784eacc693c03798a1e8eb8f46a3))
- generate professional brand assets with gpt-image-1 ([bd32ef2](https://github.com/svenjens/tv-show-dashboard/commit/bd32ef2d24bdd7ecd14a39b54ad56fad266d0ec1))
- implement enterprise-level TV show dashboard with Vue 3, TypeScript, and Tailwind CSS ([6d624e9](https://github.com/svenjens/tv-show-dashboard/commit/6d624e918b68bf337139a6248246804928056838))
- improve UI layout and navigation ([c2d013a](https://github.com/svenjens/tv-show-dashboard/commit/c2d013a5acb4c234a95bb0825cee9bf50f8794a0))
- improve UI navigation consistency ([07546a5](https://github.com/svenjens/tv-show-dashboard/commit/07546a57f34be64ee523b07db4849b3e8b95ac8c))
- integrate AI-generated brand assets into application ([fbb9afe](https://github.com/svenjens/tv-show-dashboard/commit/fbb9afeb534d6f87eab248cedd89c85b3ee57d44))

### Bug Fixes

- add GitHub Actions permissions for PR comments ([a0125ea](https://github.com/svenjens/tv-show-dashboard/commit/a0125eaec3758c1320f62c860a7dfc72639432b2))
- add route watcher to reload show details on navigation ([87807cf](https://github.com/svenjens/tv-show-dashboard/commit/87807cf6ed1c8ffd3f9470330a76e3a452cf463f))
- align card titles with consistent height ([b2c7aed](https://github.com/svenjens/tv-show-dashboard/commit/b2c7aede986eb549f0bc182955b5ff355fd4b7d5))
- completely remove vertical scroll from genre rows ([1095a3d](https://github.com/svenjens/tv-show-dashboard/commit/1095a3d3be6505cc88193fbd18eb25f9630fb2ae))
- improve accessibility with keyboard navigation ([c884c5d](https://github.com/svenjens/tv-show-dashboard/commit/c884c5dcc6fb856728122f9be926541ebcff1716))
- remove remaining /optimized/ image references in Home.vue ([525126c](https://github.com/svenjens/tv-show-dashboard/commit/525126c9b2cbde14b367c0343c2db782bb7e26fb))
- remove vertical scroll and align genre pills ([07316f2](https://github.com/svenjens/tv-show-dashboard/commit/07316f264027482e84f17d07e44c48f656e4c681))
- resolve accessibility issues and add security improvements ([2c1b47e](https://github.com/svenjens/tv-show-dashboard/commit/2c1b47ea795a62256b8985f7d73c176f6a4358aa))
- resolve all TypeScript warnings and console errors ([2fa6d76](https://github.com/svenjens/tv-show-dashboard/commit/2fa6d76832db625ebe40c3610a52eed5b009890a))
- resolve CI pipeline issues and add security improvements ([b142a25](https://github.com/svenjens/tv-show-dashboard/commit/b142a25763b9666bba90f8ae35c11c9b7ec57d90))
- resolve useSEO fullPath error by removing route watcher ([e989b90](https://github.com/svenjens/tv-show-dashboard/commit/e989b907bb46d918599dac2bc001c7ba0ba8c282))
- resolve Vite build errors by using direct public paths ([4794821](https://github.com/svenjens/tv-show-dashboard/commit/4794821268dc2ce9690f93cc56df3f886e5c42e6))
- resolve Vite build errors with optimized images ([05a4938](https://github.com/svenjens/tv-show-dashboard/commit/05a4938715538c46fa0d9c17ffc8ae4aed91b8dd))
- update branding generator to use gpt-image-1 ([8f35eba](https://github.com/svenjens/tv-show-dashboard/commit/8f35eba53f0e1be189dd3a4aad3e1f29a38bb9c5))
- update image imports to use Vite ESM imports and sync brand colors ([9e5be19](https://github.com/svenjens/tv-show-dashboard/commit/9e5be19dfcd73dad060844d487decced54587528))
- use correct Vercel output for preview URL ([0e23f64](https://github.com/svenjens/tv-show-dashboard/commit/0e23f64d0cd1cd700ccac0bc7bdd01dba56ec5a0))
