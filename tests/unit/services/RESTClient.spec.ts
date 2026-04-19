import { afterEach, describe, expect, it, vi } from 'vitest'
import { RESTClient } from '@/services/RESTClient'

describe('RESTClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Should return JSON response data from GET requests', async () => {
    const expectedData = { foo: 'bar' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expectedData),
    } as Response)

    const response = await RESTClient.get<typeof expectedData>('/v1/test')
    expect(response.data).toStrictEqual(expectedData)
  })

  it('Should throw when GET request is not successful', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    await expect(RESTClient.get('/v1/test')).rejects.toThrow('Request failed with status 500')
  })
})
