<script lang="ts">
  import { MangaViewer, Modal, StatusBar } from './components'
  import type { EpisodeEntry, Episode } from './types.ts'
  import {
    buildShareUrl,
    buildXIntentUrl,
    loadIndexFromCookie,
    resolveImageUrl,
    saveIndexToCookie,
    sortEpisodeEntries,
  } from './utils.ts'

  const DATA_URL =
    'https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4komaData.json'

  let loadState = $state<'loading' | 'error' | 'ready'>('loading')
  let episodes = $state<Episode[]>([])
  let currentEpisodeIdx = $state(0)
  let errorMessage = $state('')

  $effect(() => {
    void currentEpisodeIdx
    window.scrollTo({ top: 0, behavior: 'instant' })
  })

  async function loadData(): Promise<void> {
    try {
      const resp = await fetch(DATA_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data: EpisodeEntry[] = (await resp.json()) as EpisodeEntry[]

      const grouped: Episode[] = sortEpisodeEntries(data).map(entry => ({
        index: entry.Index,
        title: entry.Title,
        imageUrls: entry.ImagesUrl.map(resolveImageUrl),
      }))

      episodes = grouped
      const urlIndex = new URLSearchParams(window.location.search).get('i')
      if (urlIndex !== null) {
        const found = grouped.findIndex(ep => String(ep.index) === urlIndex)
        currentEpisodeIdx = found >= 0 ? found : 0
      } else {
        currentEpisodeIdx = Math.min(loadIndexFromCookie(document.cookie), grouped.length - 1)
      }
      loadState = 'ready'
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : String(e)
      loadState = 'error'
    }
  }

  void loadData()

  const currentEpisode = $derived(episodes[currentEpisodeIdx])
  const xIntentUrl = $derived(
    currentEpisode ? buildXIntentUrl(currentEpisode, window.location.href) : '',
  )
  const prevEpisode = $derived(currentEpisodeIdx > 0 ? episodes[currentEpisodeIdx - 1] : null)
  const nextEpisode = $derived(
    currentEpisodeIdx < episodes.length - 1 ? episodes[currentEpisodeIdx + 1] : null,
  )

  function prev(): void {
    if (currentEpisodeIdx > 0) {
      currentEpisodeIdx--
      saveIndexToCookie(currentEpisodeIdx)
    }
  }

  function next(): void {
    if (currentEpisodeIdx < episodes.length - 1) {
      currentEpisodeIdx++
      saveIndexToCookie(currentEpisodeIdx)
    }
  }

  $effect(() => {
    if (loadState !== 'ready' || !currentEpisode) return
    history.replaceState(null, '', buildShareUrl(currentEpisode.index, window.location.href))
  })

  let showAbout = $state(false)
  let showEpisodeMenu = $state(false)

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      showAbout = false
      showEpisodeMenu = false
      return
    }
    if (showAbout || showEpisodeMenu) return
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if loadState === 'loading'}
  <div class="overlay" role="status" aria-live="polite">読み込み中...</div>
{:else if loadState === 'error'}
  <div class="overlay error" role="alert">
    データの読み込みに失敗しました: {errorMessage}
  </div>
{:else}
  <div class="viewer">
    <StatusBar
      episode={currentEpisode}
      onShowAbout={() => (showAbout = true)}
      onShowEpisodeMenu={() => (showEpisodeMenu = true)} />

    <main aria-label="漫画ビューワー">
      <MangaViewer
        {currentEpisode}
        {prevEpisode}
        {nextEpisode}
        {xIntentUrl}
        onprev={prev}
        onnext={next} />
    </main>
  </div>
{/if}

{#if showEpisodeMenu}
  <Modal title="話を選択" titleId="menu-title" onclose={() => (showEpisodeMenu = false)}>
    <select
      class="episode-select"
      aria-label="話を選択"
      onchange={e => {
        currentEpisodeIdx = Number(e.currentTarget.value)
        saveIndexToCookie(currentEpisodeIdx)
        showEpisodeMenu = false
      }}>
      {#each episodes as ep, i}
        <option value={i} selected={i === currentEpisodeIdx}>
          {typeof ep.index === 'number' ? `第${ep.index}話` : ''}「{ep.title}」
        </option>
      {/each}
    </select>
  </Modal>
{/if}

{#if showAbout}
  <Modal title="このサイトについて" titleId="modal-title" onclose={() => (showAbout = false)}>
    <p>
      道草屋ばっくやーど漫画の非公式ビューワーです。<br />全ての画像の権利は桃色CODE様に帰属します。
    </p>
    <u>桃色CODE様</u>
    <ul>
      <li>
        漫画:
        <a href="http://momoirocode.web.fc2.com" target="_blank" rel="noopener noreferrer"
          >momoirocode.web.fc2.com</a>
      </li>
      <li>
        Booth:
        <a href="https://momotori.booth.pm" target="_blank" rel="noopener noreferrer"
          >momotori.booth.pm</a>
      </li>
      <li>
        DLsite:
        <a
          href="https://www.dlsite.com/home/circle/profile/=/maker_id/RG24350.html"
          target="_blank"
          rel="noopener noreferrer">桃色CODE / RG24350</a>
      </li>
    </ul>
    <u>ソースコード</u>
    <ul>
      <li>
        漫画データ:
        <a href="https://github.com/iranika/mo-code-4koma" target="_blank" rel="noopener noreferrer"
          >iranika/mo-code-4koma</a>
      </li>
      <li>
        リポジトリ:
        <a href="https://github.com/eggplants/michixa" target="_blank" rel="noopener noreferrer"
          >eggplants/michixa</a>
      </li>
    </ul>
  </Modal>
{/if}

<style>
  .viewer {
    min-height: 100vh;
    background: #e2e3d1;
    padding-top: 8rem;
    padding-bottom: 5rem;
    padding-inline: 88px;
  }

  @media (max-width: 768px) {
    .viewer {
      padding-top: 3rem;
      padding-bottom: 7rem;
      padding-inline: 0;
    }
  }

  .episode-select {
    width: 100%;
    background: rgba(255, 235, 238, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    color: #6b1a24;
    font-size: 0.9rem;
    font-family: 'Hiragino Kaku Gothic Pro', 'Noto Sans JP', system-ui, sans-serif;
    cursor: pointer;
    padding: 0.5rem;
  }

  .episode-select option {
    background: #fde8ea;
    color: #6b1a24;
  }

  .overlay {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 1.2rem;
    font-family: system-ui, sans-serif;
    background: #1a1a1a;
  }

  .overlay.error {
    color: #f87171;
  }
</style>
