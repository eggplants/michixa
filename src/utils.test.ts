import { beforeEach, describe, expect, it } from 'vite-plus/test'
import type { Episode, EpisodeEntry } from './types.ts'
import {
  buildShareUrl,
  buildXIntentUrl,
  loadIndexFromCookie,
  resolveImageUrl,
  saveIndexToCookie,
  sortEpisodeEntries,
} from './utils.ts'

const WEBP_BASE =
  'https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4koma/ja/webp/'

describe('resolveImageUrl', () => {
  it('strips ./ prefix and extension, appends .webp to base URL', () => {
    expect(resolveImageUrl('./1.jpg')).toBe(`${WEBP_BASE}1.webp`)
  })

  it('handles paths without ./ prefix', () => {
    expect(resolveImageUrl('2.png')).toBe(`${WEBP_BASE}2.webp`)
  })

  it('handles paths with subdirectory', () => {
    expect(resolveImageUrl('./subdir/3.jpg')).toBe(`${WEBP_BASE}subdir/3.webp`)
  })

  it('converts any extension to .webp', () => {
    expect(resolveImageUrl('./img.gif')).toBe(`${WEBP_BASE}img.webp`)
  })
})

describe('sortEpisodeEntries', () => {
  it('sorts numeric indices ascending', () => {
    const data: EpisodeEntry[] = [
      { Index: 3, Title: 'C', BaseUrl: '', ImagesUrl: [] },
      { Index: 1, Title: 'A', BaseUrl: '', ImagesUrl: [] },
      { Index: 2, Title: 'B', BaseUrl: '', ImagesUrl: [] },
    ]
    expect(sortEpisodeEntries(data).map(e => e.Index)).toEqual([1, 2, 3])
  })

  it('places string index before numeric indices', () => {
    const data: EpisodeEntry[] = [
      { Index: 2, Title: 'B', BaseUrl: '', ImagesUrl: [] },
      { Index: 'ri', Title: 'R', BaseUrl: '', ImagesUrl: [] },
      { Index: 1, Title: 'A', BaseUrl: '', ImagesUrl: [] },
    ]
    expect(sortEpisodeEntries(data).map(e => e.Index)).toEqual(['ri', 1, 2])
  })

  it('places multiple string indices before numeric indices', () => {
    const data: EpisodeEntry[] = [
      { Index: 1, Title: 'A', BaseUrl: '', ImagesUrl: [] },
      { Index: 'ri', Title: 'R', BaseUrl: '', ImagesUrl: [] },
    ]
    const result = sortEpisodeEntries(data)
    expect(typeof result[0].Index).toBe('string')
    expect(result[1].Index).toBe(1)
  })

  it('does not mutate the original array', () => {
    const data: EpisodeEntry[] = [
      { Index: 2, Title: 'B', BaseUrl: '', ImagesUrl: [] },
      { Index: 1, Title: 'A', BaseUrl: '', ImagesUrl: [] },
    ]
    const original = [...data]
    sortEpisodeEntries(data)
    expect(data).toEqual(original)
  })

  it('returns empty array for empty input', () => {
    expect(sortEpisodeEntries([])).toEqual([])
  })
})

describe('buildShareUrl', () => {
  it('sets i= query param for numeric index', () => {
    expect(buildShareUrl(5, 'https://example.com/michixa/')).toBe(
      'https://example.com/michixa/?i=5',
    )
  })

  it('sets i= query param for string index', () => {
    expect(buildShareUrl('ri', 'https://example.com/michixa/')).toBe(
      'https://example.com/michixa/?i=ri',
    )
  })

  it('replaces existing query params', () => {
    expect(buildShareUrl(3, 'https://example.com/michixa/?i=1')).toBe(
      'https://example.com/michixa/?i=3',
    )
  })

  it('preserves path in URL', () => {
    const result = buildShareUrl(1, 'https://eggplants.github.io/michixa/')
    expect(result.startsWith('https://eggplants.github.io/michixa/')).toBe(true)
  })
})

describe('buildXIntentUrl', () => {
  const href = 'https://example.com/michixa/'

  it('includes episode number prefix for numeric index', () => {
    const ep: Episode = { index: 1, title: 'テスト', imageUrls: [] }
    expect(buildXIntentUrl(ep, href)).toContain(encodeURIComponent('第1話「テスト」'))
  })

  it('omits episode number prefix for string index', () => {
    const ep: Episode = { index: 'ri', title: 'りれきしょ', imageUrls: [] }
    const url = buildXIntentUrl(ep, href)
    expect(url).toContain(encodeURIComponent('りれきしょ'))
    expect(url).not.toContain(encodeURIComponent('第'))
  })

  it('targets x.com/intent/tweet', () => {
    const ep: Episode = { index: 2, title: 'テスト', imageUrls: [] }
    expect(buildXIntentUrl(ep, href)).toMatch(/^https:\/\/x\.com\/intent\/tweet\?/)
  })

  it('includes share URL as url param', () => {
    const ep: Episode = { index: 2, title: 'テスト', imageUrls: [] }
    const url = buildXIntentUrl(ep, href)
    expect(url).toContain('url=' + encodeURIComponent(buildShareUrl(2, href)))
  })
})

describe('loadIndexFromCookie', () => {
  it('returns 0 when cookie string is empty', () => {
    expect(loadIndexFromCookie('')).toBe(0)
  })

  it('parses michixa_page cookie value', () => {
    expect(loadIndexFromCookie('michixa_page=5')).toBe(5)
  })

  it('parses value when other cookies are present before', () => {
    expect(loadIndexFromCookie('foo=bar; michixa_page=3')).toBe(3)
  })

  it('parses value when other cookies are present after', () => {
    expect(loadIndexFromCookie('michixa_page=7; baz=qux')).toBe(7)
  })

  it('parses value surrounded by other cookies', () => {
    expect(loadIndexFromCookie('a=1; michixa_page=9; b=2')).toBe(9)
  })

  it('returns 0 when michixa_page is not present', () => {
    expect(loadIndexFromCookie('other=value')).toBe(0)
  })
})

describe('saveIndexToCookie', () => {
  beforeEach(() => {
    document.cookie = 'michixa_page=; max-age=0; path=/'
  })

  it('writes michixa_page cookie', () => {
    saveIndexToCookie(7)
    expect(document.cookie).toContain('michixa_page=7')
  })

  it('overwrites previous michixa_page cookie value', () => {
    saveIndexToCookie(3)
    saveIndexToCookie(10)
    expect(document.cookie).toContain('michixa_page=10')
  })
})
