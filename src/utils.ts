import type { Episode, EpisodeEntry } from './types.ts'

const WEBP_BASE =
  'https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4koma/ja/webp/'
const COOKIE_NAME = 'michixa_page'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function resolveImageUrl(rel: string): string {
  const name = rel.replace(/^\.\//, '').replace(/\.\w+$/, '')
  return `${WEBP_BASE}${name}.webp`
}

export function buildShareUrl(index: number | string, href: string): string {
  const url = new URL(href)
  url.search = `i=${index}`
  return url.toString()
}

export function buildXIntentUrl(episode: Episode, locationHref: string): string {
  const prefix = typeof episode.index === 'number' ? `第${episode.index}話` : ''
  const text = prefix ? `${prefix}「${episode.title}」` : episode.title
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(buildShareUrl(episode.index, locationHref))}`
}

export function loadIndexFromCookie(cookieString: string): number {
  const match = cookieString.match(/(?:^|;\s*)michixa_page=(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function saveIndexToCookie(index: number): void {
  document.cookie = `${COOKIE_NAME}=${index}; max-age=${COOKIE_MAX_AGE}; path=/`
}

export function sortEpisodeEntries(data: EpisodeEntry[]): EpisodeEntry[] {
  return [...data].sort((a, b) => {
    const ai = typeof a.Index === 'number' ? a.Index : Number.NEGATIVE_INFINITY
    const bi = typeof b.Index === 'number' ? b.Index : Number.NEGATIVE_INFINITY
    return ai - bi
  })
}
