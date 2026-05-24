#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Feed } from 'feed'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DATA_URL =
  'https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4komaData.json'
const WEBP_BASE =
  'https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4koma/ja/webp/'
const SITE_URL = 'https://eggplants.github.io/michixa'
const DATES_FILE = join(__dirname, 'episode-dates.json')
const FEED_FILE = join(ROOT, 'public', 'feed.xml')

const cachedDates = existsSync(DATES_FILE) ? JSON.parse(readFileSync(DATES_FILE, 'utf-8')) : {}

console.log('Fetching 4komaData.json...')
const resp = await fetch(DATA_URL)
if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
const data = await resp.json()

const sorted = [...data].sort((a, b) => {
  const ai = typeof a.Index === 'number' ? a.Index : Number.NEGATIVE_INFINITY
  const bi = typeof b.Index === 'number' ? b.Index : Number.NEGATIVE_INFINITY
  return ai - bi
})

const tmpImg = join(tmpdir(), 'michixa_feed_tmp.jpg')
let datesUpdated = false

for (const entry of sorted) {
  const key = String(entry.Index)
  if (cachedDates[key]) continue

  const firstImg = entry.ImagesUrl[0].replace(/^\.\//, '')
  const imageUrl = entry.BaseUrl.replace(/\/[^/]+\.html$/, '/') + firstImg

  console.log(`episode ${key}: ${imageUrl}`)
  try {
    execSync(`curl -sf -R -o "${tmpImg}" "${imageUrl}"`, { stdio: 'pipe' })
    const date = execSync(
      `exiftool -time:filemodifydate -d '%Y-%m-%dT%H:%M:%S%z' "${tmpImg}" | awk '$0=$NF'`,
      { shell: true, stdio: ['pipe', 'pipe', 'pipe'] },
    )
      .toString()
      .trim()
    if (date) {
      cachedDates[key] = date
      datesUpdated = true
      console.log(`  → ${date}`)
    } else {
      console.warn(`  → exiftool returned no date`)
    }
  } catch (e) {
    console.warn(`  → skipped: ${e.message}`)
  }
}

if (datesUpdated) {
  writeFileSync(DATES_FILE, JSON.stringify(cachedDates, null, 2) + '\n')
  console.log('Updated scripts/episode-dates.json')
}

const feed = new Feed({
  title: '非公式道草屋ばっくやーど漫画ビューア',
  description: '道草屋ばっくやーど漫画の非公式ビューワー',
  id: `${SITE_URL}/`,
  link: `${SITE_URL}/`,
  language: 'ja',
  copyright: '全ての画像の権利は桃色CODE様に帰属します。',
  feedLinks: { rss2: `${SITE_URL}/feed.xml` },
})

for (const entry of sorted) {
  const key = String(entry.Index)
  const rawDate = cachedDates[key]
  // exiftool %z gives +0900 (no colon); normalize to +09:00 for Date()
  const date = rawDate ? new Date(rawDate.replace(/([+-]\d{2})(\d{2})$/, '$1:$2')) : new Date(0)

  const prefix = typeof entry.Index === 'number' ? `第${entry.Index}話` : ''
  const title = prefix ? `${prefix}「${entry.Title}」` : entry.Title
  const link = `${SITE_URL}/?i=${entry.Index}`

  const content = entry.ImagesUrl.map(img => {
    const name = img.replace(/^\.\//, '').replace(/\.\w+$/, '')
    return `<img src="${WEBP_BASE}${name}.webp" alt="${title}" style="width:100%;display:block">`
  }).join('\n')

  const firstWebp = `${WEBP_BASE}${entry.ImagesUrl[0].replace(/^\.\//, '').replace(/\.\w+$/, '')}.webp`

  feed.addItem({
    title,
    id: link,
    link,
    date,
    content,
    enclosure: { url: firstWebp, type: 'image/webp' },
  })
}

writeFileSync(FEED_FILE, feed.rss2())
console.log('Written public/feed.xml')
