import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useApi } from '@/composables/useApi'

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    const apiCall = vi.fn().mockResolvedValue({ data: 'test' })
    const { data, loading, error } = useApi(apiCall, false)

    expect(data.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should execute API call immediately when immediate is true', async () => {
    const mockData = { id: 1, name: 'Test' }
    const apiCall = vi.fn().mockResolvedValue(mockData)

    const { data, loading, error } = useApi(apiCall, true)

    // Should start loading immediately
    expect(loading.value).toBe(true)

    await nextTick()
    await nextTick()

    expect(apiCall).toHaveBeenCalledTimes(1)
    expect(data.value).toEqual(mockData)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should not execute API call immediately when immediate is false', () => {
    const apiCall = vi.fn().mockResolvedValue({ data: 'test' })
    const { data, loading } = useApi(apiCall, false)

    expect(apiCall).not.toHaveBeenCalled()
    expect(loading.value).toBe(false)
    expect(data.value).toBe(null)
  })

  it('should execute API call when execute is called manually', async () => {
    const mockData = { id: 2, name: 'Manual' }
    const apiCall = vi.fn().mockResolvedValue(mockData)

    const { data, loading, error, execute } = useApi(apiCall, false)

    expect(apiCall).not.toHaveBeenCalled()

    await execute()

    expect(apiCall).toHaveBeenCalledTimes(1)
    expect(data.value).toEqual(mockData)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should set loading state during API call', async () => {
    const apiCall = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: 'test' }), 100))
      )

    const { loading, execute } = useApi(apiCall, false)

    const executePromise = execute()

    // Should be loading during the call
    expect(loading.value).toBe(true)

    await executePromise

    // Should not be loading after completion
    expect(loading.value).toBe(false)
  })

  it('should handle API errors correctly', async () => {
    const mockError = new Error('API Error')
    const apiCall = vi.fn().mockRejectedValue(mockError)

    const { data, loading, error, execute } = useApi(apiCall, false)

    await execute()

    expect(error.value).toBe(mockError)
    expect(data.value).toBe(null)
    expect(loading.value).toBe(false)
  })

  it('should clear previous error on new successful call', async () => {
    const mockError = new Error('First error')
    const apiCall = vi
      .fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce({ data: 'success' })

    const { data, error, execute } = useApi(apiCall, false)

    // First call - error
    await execute()
    expect(error.value).toBe(mockError)

    // Second call - success
    await execute()
    expect(error.value).toBe(null)
    expect(data.value).toEqual({ data: 'success' })
  })

  it('should update data on multiple successful calls', async () => {
    const apiCall = vi
      .fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 })
      .mockResolvedValueOnce({ id: 3 })

    const { data, execute } = useApi(apiCall, false)

    await execute()
    expect(data.value).toEqual({ id: 1 })

    await execute()
    expect(data.value).toEqual({ id: 2 })

    await execute()
    expect(data.value).toEqual({ id: 3 })
  })

  it('should handle different data types', async () => {
    // Test with array
    const arrayCall = vi.fn().mockResolvedValue([1, 2, 3])
    const { data: arrayData, execute: executeArray } = useApi(arrayCall, false)
    await executeArray()
    expect(arrayData.value).toEqual([1, 2, 3])

    // Test with string
    const stringCall = vi.fn().mockResolvedValue('test string')
    const { data: stringData, execute: executeString } = useApi(stringCall, false)
    await executeString()
    expect(stringData.value).toBe('test string')

    // Test with number
    const numberCall = vi.fn().mockResolvedValue(42)
    const { data: numberData, execute: executeNumber } = useApi(numberCall, false)
    await executeNumber()
    expect(numberData.value).toBe(42)

    // Test with boolean
    const boolCall = vi.fn().mockResolvedValue(true)
    const { data: boolData, execute: executeBool } = useApi(boolCall, false)
    await executeBool()
    expect(boolData.value).toBe(true)
  })

  it('should handle null response', async () => {
    const apiCall = vi.fn().mockResolvedValue(null)
    const { data, execute } = useApi(apiCall, false)

    await execute()
    expect(data.value).toBe(null)
  })

  it('should handle undefined response', async () => {
    const apiCall = vi.fn().mockResolvedValue(undefined)
    const { data, execute } = useApi(apiCall, false)

    await execute()
    expect(data.value).toBe(undefined)
  })

  it('should allow multiple sequential calls', async () => {
    const apiCall = vi
      .fn()
      .mockResolvedValueOnce({ data: 'first' })
      .mockResolvedValueOnce({ data: 'second' })

    const { data, loading, execute } = useApi(apiCall, false)

    await execute()
    expect(data.value).toEqual({ data: 'first' })
    expect(loading.value).toBe(false)

    await execute()
    expect(data.value).toEqual({ data: 'second' })
    expect(loading.value).toBe(false)
  })

  it('should handle API call that throws synchronously', async () => {
    const mockError = new Error('Sync error')
    const apiCall = vi.fn().mockImplementation(() => {
      throw mockError
    })

    const { error, execute } = useApi(apiCall, false)

    await execute()

    expect(error.value).toBe(mockError)
  })

  it('should work with async/await API calls', async () => {
    const mockData = { result: 'success' }
    const apiCall = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return mockData
    }

    const { data, execute } = useApi(apiCall, false)

    await execute()

    expect(data.value).toEqual(mockData)
  })

  it('should preserve error stack trace', async () => {
    const mockError = new Error('Test error')
    mockError.stack = 'Error: Test error\n  at test.ts:123'

    const apiCall = vi.fn().mockRejectedValue(mockError)
    const { error, execute } = useApi(apiCall, false)

    await execute()

    expect(error.value).toBe(mockError)
    expect((error.value as any)?.stack).toBe('Error: Test error\n  at test.ts:123')
  })

  it('should handle custom error objects', async () => {
    interface CustomError {
      code: string
      message: string
      details?: string
    }

    const customError: CustomError = {
      code: 'CUSTOM_ERROR',
      message: 'Something went wrong',
      details: 'Additional info',
    }

    const apiCall = vi.fn().mockRejectedValue(customError)
    const { error, execute } = useApi<any>(apiCall, false)

    await execute()

    expect(error.value).toEqual(customError)
    expect((error.value as any).code).toBe('CUSTOM_ERROR')
  })
})
