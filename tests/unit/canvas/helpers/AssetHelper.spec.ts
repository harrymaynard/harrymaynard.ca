import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadSVG } from '@/canvas/helpers/AssetHelper'

describe('AssetHelper', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Should load SVG text from fetch', async () => {
    const svg = '<svg width="10" height="10"></svg>'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(svg),
    } as Response)

    const result = await loadSVG('/images/test.svg')
    expect(result).toBe(svg)
  })

  it('Should throw when loading SVG fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    await expect(loadSVG('/images/missing.svg')).rejects.toThrow('Request failed with status 404')
  })
})
