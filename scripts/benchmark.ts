/**
 * Performance Benchmark Script
 * Run manually to measure API performance
 *
 * Usage: npx tsx scripts/benchmark.ts
 */

import { $fetch } from 'ofetch'

const BASE_URL = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'

interface BenchmarkResult {
  endpoint: string
  method: string
  calls: number
  totalTime: number
  avgTime: number
  minTime: number
  maxTime: number
  p50: number
  p95: number
  p99: number
}

/**
 * Run benchmark for a specific endpoint
 */
async function benchmark(name: string, url: string, calls: number = 10): Promise<BenchmarkResult> {
  const times: number[] = []

  console.log(`\n🔄 Benchmarking: ${name}`)
  console.log(`   Endpoint: ${url}`)
  console.log(`   Calls: ${calls}`)

  for (let i = 0; i < calls; i++) {
    const startTime = performance.now()

    try {
      await $fetch(url)
      const endTime = performance.now()
      const duration = endTime - startTime
      times.push(duration)

      process.stdout.write('.')
    } catch (error) {
      console.error(`\n❌ Error on call ${i + 1}:`, error)
      throw error
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  process.stdout.write('\n')

  // Calculate statistics
  times.sort((a, b) => a - b)

  const totalTime = times.reduce((sum, time) => sum + time, 0)
  const avgTime = totalTime / times.length
  const minTime = times[0]!
  const maxTime = times[times.length - 1]!
  const p50 = times[Math.floor(times.length * 0.5)]!
  const p95 = times[Math.floor(times.length * 0.95)]!
  const p99 = times[Math.floor(times.length * 0.99)]!

  return {
    endpoint: name,
    method: 'GET',
    calls,
    totalTime,
    avgTime,
    minTime,
    maxTime,
    p50,
    p95,
    p99,
  }
}

/**
 * Print benchmark results
 */
function printResults(results: BenchmarkResult[]) {
  console.log('\n' + '='.repeat(80))
  console.log('📊 PERFORMANCE BENCHMARK RESULTS')
  console.log('='.repeat(80))

  for (const result of results) {
    console.log(`\n${result.endpoint}:`)
    console.log(`  Calls:      ${result.calls}`)
    console.log(`  Total Time: ${result.totalTime.toFixed(2)}ms`)
    console.log(`  Average:    ${result.avgTime.toFixed(2)}ms`)
    console.log(`  Min:        ${result.minTime.toFixed(2)}ms`)
    console.log(`  Max:        ${result.maxTime.toFixed(2)}ms`)
    console.log(`  P50:        ${result.p50.toFixed(2)}ms`)
    console.log(`  P95:        ${result.p95.toFixed(2)}ms`)
    console.log(`  P99:        ${result.p99.toFixed(2)}ms`)
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n💡 Analysis:')
  console.log('  - First call is typically slower (cold cache)')
  console.log('  - Subsequent calls should be much faster (cache hit)')
  console.log('  - P95/P99 show worst-case performance')
  console.log('  - Min time represents optimal cached performance')
  console.log('\n' + '='.repeat(80) + '\n')
}

/**
 * Main benchmark execution
 */
async function main() {
  console.log('🚀 Starting API Performance Benchmark')
  console.log(`   Base URL: ${BASE_URL}`)
  console.log('\n⚠️  Make sure your dev server is running: npm run dev\n')

  const results: BenchmarkResult[] = []

  try {
    // Benchmark: Shows List
    results.push(await benchmark('Shows List', `${BASE_URL}/api/shows`, 10))

    // Benchmark: Show Details (with TMDB)
    results.push(
      await benchmark('Show Details (with TMDB)', `${BASE_URL}/api/shows/1?country=US`, 10)
    )

    // Benchmark: Episodes
    results.push(await benchmark('Episodes', `${BASE_URL}/api/shows/1/episodes`, 10))

    // Benchmark: Cast
    results.push(await benchmark('Cast', `${BASE_URL}/api/shows/1/cast`, 10))

    // Benchmark: Search
    results.push(await benchmark('Search', `${BASE_URL}/api/search?q=breaking+bad`, 10))

    // Benchmark: Person Details
    results.push(await benchmark('Person Details', `${BASE_URL}/api/people/1`, 10))

    // Print all results
    printResults(results)

    // Summary
    const avgOfAvgs = results.reduce((sum, r) => sum + r.avgTime, 0) / results.length
    console.log('📈 Overall Average Response Time:', avgOfAvgs.toFixed(2), 'ms')

    const cachedAvg = results.reduce((sum, r) => sum + r.minTime, 0) / results.length
    console.log('⚡ Average Cached Response Time:', cachedAvg.toFixed(2), 'ms')

    const cacheEffectiveness = ((avgOfAvgs - cachedAvg) / avgOfAvgs) * 100
    console.log('🎯 Cache Effectiveness:', cacheEffectiveness.toFixed(1), '%\n')
  } catch (error) {
    console.error('\n❌ Benchmark failed:', error)
    console.error('\n💡 Make sure your dev server is running!')
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { benchmark, BenchmarkResult }
