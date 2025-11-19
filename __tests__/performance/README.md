# API Performance Tests

This directory contains performance tests that measure actual API response times and caching effectiveness.

## Running Performance Tests

### Option 1: Automated Tests (with Vitest)

```bash
# Start the dev server first
npm run dev

# In another terminal, run performance tests
TEST_PERFORMANCE=true npm test __tests__/performance
```

### Option 2: Manual Benchmark

```bash
# Start the dev server first
npm run dev

# In another terminal, run the benchmark script
npm run benchmark
```

## What is Measured?

### Response Times

- **First Call (Cold Cache)**: Initial request to populate cache
- **Cached Call**: Subsequent request hitting cache
- **Cache Improvement**: Percentage speedup from caching

### Endpoints Tested

- ✅ Shows List (`/api/shows`)
- ✅ Show Details with TMDB (`/api/shows/[id]`)
- ✅ Episodes (`/api/shows/[id]/episodes`)
- ✅ Cast (`/api/shows/[id]/cast`)
- ✅ Search (`/api/search`)
- ✅ Person Details (`/api/people/[id]`)
- ✅ Concurrent Requests

## Performance Thresholds

| Endpoint     | First Call | Cached Call | Expected Improvement |
| ------------ | ---------- | ----------- | -------------------- |
| Shows List   | < 5000ms   | < 100ms     | > 50%                |
| Show Details | < 3000ms   | < 100ms     | > 90%                |
| Episodes     | < 2000ms   | < 100ms     | > 90%                |
| Cast         | < 2000ms   | < 100ms     | > 90%                |
| Search       | < 3000ms   | < 100ms     | > 80%                |

## Understanding Results

### Good Performance Indicators

- ✅ First call < threshold
- ✅ Cached call < 100ms
- ✅ Cache improvement > 50%
- ✅ Consistent response times (low variance)

### Red Flags

- ❌ First call > threshold
- ❌ Cached call > 200ms (cache might not be working)
- ❌ Cache improvement < 30%
- ❌ High variance in response times

## Benchmark Output Example

```
📊 PERFORMANCE BENCHMARK RESULTS
================================================================================

Shows List:
  Calls:      10
  Total Time: 3542.35ms
  Average:    354.24ms
  Min:        45.12ms
  Max:        2103.45ms
  P50:        52.34ms
  P95:        1834.23ms
  P99:        2103.45ms

💡 Analysis:
  - First call is typically slower (cold cache)
  - Subsequent calls should be much faster (cache hit)
  - P95/P99 show worst-case performance
  - Min time represents optimal cached performance
```

## CI/CD Integration

Performance tests are **skipped by default** in CI/CD to avoid flaky tests due to network conditions.

To enable in CI:

```yaml
- name: Run Performance Tests
  env:
    TEST_PERFORMANCE: true
  run: npm test __tests__/performance
```

## Troubleshooting

### Tests are Skipped

Make sure to set `TEST_PERFORMANCE=true`:

```bash
TEST_PERFORMANCE=true npm test __tests__/performance
```

### Connection Errors

Ensure your dev server is running:

```bash
npm run dev
```

### Slow Response Times

Check:

- Network connectivity to external APIs (TVMaze, TMDB)
- TMDB API key is configured (`NUXT_PUBLIC_TMDB_API_KEY`)
- No rate limiting from external APIs

## Adding New Performance Tests

1. Add test threshold to `THRESHOLDS` constant
2. Create new `describe` block
3. Use `measureApiCall()` for single measurement
4. Use `measureCachingEffectiveness()` for cache testing

Example:

```typescript
describe('My New API', () => {
  it.skipIf(!serverAvailable)(
    'should return data within acceptable time',
    async () => {
      const result = await measureApiCall(`${baseUrl}/api/my-endpoint`)

      console.log(`📊 My API: ${result.duration.toFixed(2)}ms`)

      expect(result.duration).toBeLessThan(THRESHOLDS.MY_API_FIRST)
    },
    { timeout: 10000 }
  )
})
```
