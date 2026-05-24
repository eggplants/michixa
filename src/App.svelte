<script lang="ts">
  import type { EpisodeEntry, Episode } from "./types.ts";

  const DATA_URL =
    "https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4komaData.json";
  const WEBP_BASE =
    "https://raw.githubusercontent.com/iranika/mo-code-4koma/refs/heads/main/4koma/ja/webp/";
  const COOKIE_NAME = "michixa_page";
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

  function loadIndexFromCookie(): number {
    const match = document.cookie.match(/(?:^|;\s*)michixa_page=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function saveIndexToCookie(index: number): void {
    document.cookie = `${COOKIE_NAME}=${index}; max-age=${COOKIE_MAX_AGE}; path=/`;
  }

  function resolveImageUrl(rel: string): string {
    const name = rel.replace(/^\.\//, "").replace(/\.\w+$/, "");
    return `${WEBP_BASE}${name}.webp`;
  }

  function buildShareUrl(index: number | string): string {
    const url = new URL(window.location.href);
    url.search = `i=${index}`;
    return url.toString();
  }

  function buildXIntentUrl(episode: Episode): string {
    const prefix =
      typeof episode.index === "number" ? `第${episode.index}話` : "";
    const text = prefix ? `${prefix}「${episode.title}」` : episode.title;
    return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(buildShareUrl(episode.index))}`;
  }

  let loadState = $state<"loading" | "error" | "ready">("loading");
  let episodes = $state<Episode[]>([]);
  let currentEpisodeIdx = $state(0);
  let errorMessage = $state("");

  $effect(() => {
    void currentEpisodeIdx;
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  async function loadData(): Promise<void> {
    try {
      const resp = await fetch(DATA_URL);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data: EpisodeEntry[] = (await resp.json()) as EpisodeEntry[];

      const sorted = [...data].sort((a, b) => {
        const ai =
          typeof a.Index === "number" ? a.Index : Number.NEGATIVE_INFINITY;
        const bi =
          typeof b.Index === "number" ? b.Index : Number.NEGATIVE_INFINITY;
        return ai - bi;
      });

      const grouped: Episode[] = sorted.map((entry) => ({
        index: entry.Index,
        title: entry.Title,
        imageUrls: entry.ImagesUrl.map(resolveImageUrl),
      }));

      episodes = grouped;
      const urlIndex = new URLSearchParams(window.location.search).get("i");
      if (urlIndex !== null) {
        const found = grouped.findIndex((ep) => String(ep.index) === urlIndex);
        currentEpisodeIdx = found >= 0 ? found : 0;
      } else {
        currentEpisodeIdx = Math.min(loadIndexFromCookie(), grouped.length - 1);
      }
      loadState = "ready";
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : String(e);
      loadState = "error";
    }
  }

  void loadData();

  const currentEpisode = $derived(episodes[currentEpisodeIdx]);
  const xIntentUrl = $derived(
    currentEpisode ? buildXIntentUrl(currentEpisode) : "",
  );
  const prevEpisode = $derived(
    currentEpisodeIdx > 0 ? episodes[currentEpisodeIdx - 1] : null,
  );
  const nextEpisode = $derived(
    currentEpisodeIdx < episodes.length - 1
      ? episodes[currentEpisodeIdx + 1]
      : null,
  );

  function prev(): void {
    if (currentEpisodeIdx > 0) {
      currentEpisodeIdx--;
      saveIndexToCookie(currentEpisodeIdx);
    }
  }

  function next(): void {
    if (currentEpisodeIdx < episodes.length - 1) {
      currentEpisodeIdx++;
      saveIndexToCookie(currentEpisodeIdx);
    }
  }

  $effect(() => {
    if (loadState !== "ready" || !currentEpisode) return;
    history.replaceState(null, "", buildShareUrl(currentEpisode.index));
  });

  let showAbout = $state(false);
  let showEpisodeMenu = $state(false);

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      showAbout = false;
      showEpisodeMenu = false;
      return;
    }
    if (showAbout || showEpisodeMenu) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  const SWIPE_THRESHOLD = 50;
  let dragStartX = $state<number | null>(null);

  function onDragStart(x: number): void {
    dragStartX = x;
  }

  function onDragEnd(x: number): void {
    if (dragStartX === null) return;
    const dx = x - dragStartX;
    dragStartX = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) next();
    else prev();
  }

  function handleTouchStart(e: TouchEvent): void {
    onDragStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: TouchEvent): void {
    onDragEnd(e.changedTouches[0].clientX);
  }

  function handleMouseDown(e: MouseEvent): void {
    e.preventDefault();
    onDragStart(e.clientX);
  }

  function handleMouseUp(e: MouseEvent): void {
    onDragEnd(e.clientX);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if loadState === "loading"}
  <div class="overlay" role="status" aria-live="polite">読み込み中...</div>
{:else if loadState === "error"}
  <div class="overlay error" role="alert">
    データの読み込みに失敗しました: {errorMessage}
  </div>
{:else}
  <div class="viewer">
    <header class="status-bar">
      <div class="header-left">
        <button
          class="info-btn"
          onclick={() => (showAbout = true)}
          aria-label="このサイトについて"
        >
          ℹ️
        </button>
        <a
          class="rss-btn"
          href="/michixa/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RSSフィード">📡</a
        >
      </div>
      <span class="status-center" aria-live="polite" aria-atomic="true">
        <span class="episode-info">
          {#if typeof currentEpisode.index === "number"}第{currentEpisode.index}話{/if}「{currentEpisode.title}」
        </span>
        <a
          class="share-btn"
          href={xIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Xで共有"
        >
          <img
            src="/michixa/x-icon.svg"
            alt="Xで共有"
            aria-hidden="true"
            class="share-icon"
          />
        </a>
      </span>
      <button
        class="menu-btn"
        onclick={() => (showEpisodeMenu = true)}
        aria-label="話を選択"
      >
        📕
      </button>
    </header>

    <main aria-label="漫画ビューワー">
      <div
        class="image-area"
        role="presentation"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
        onmousedown={handleMouseDown}
        onmouseup={handleMouseUp}
      >
        <nav class="nav-side nav-side-prev" aria-label="前の話へ">
          {#if prevEpisode}
            <button
              class="nav-btn"
              onclick={prev}
              aria-label="前の話：{typeof prevEpisode.index === 'number'
                ? `第${prevEpisode.index}話`
                : ''}「{prevEpisode.title}」"
            >
              <span class="nav-arrow" aria-hidden="true">←</span>
              <span class="nav-info" aria-hidden="true">
                {#if typeof prevEpisode.index === "number"}第{prevEpisode.index}話<br />{/if}{prevEpisode.title}
              </span>
            </button>
          {/if}
        </nav>

        <figure
          class="image-container"
          aria-label="{typeof currentEpisode.index === 'number'
            ? `第${currentEpisode.index}話`
            : ''}「{currentEpisode.title}」"
        >
          {#each currentEpisode.imageUrls as url, i}
            <img
              src={url}
              alt="{typeof currentEpisode.index === 'number'
                ? `第${currentEpisode.index}話`
                : ''}{currentEpisode.title} ({i + 1}/{currentEpisode.imageUrls
                .length}ページ)"
              class="manga-image"
              loading="lazy"
              draggable="false"
            />
          {/each}
        </figure>

        <nav class="nav-side nav-side-next" aria-label="次の話へ">
          {#if nextEpisode}
            <button
              class="nav-btn"
              onclick={next}
              aria-label="次の話：{typeof nextEpisode.index === 'number'
                ? `第${nextEpisode.index}話`
                : ''}「{nextEpisode.title}」"
            >
              <span class="nav-arrow" aria-hidden="true">→</span>
              <span class="nav-info" aria-hidden="true">
                {#if typeof nextEpisode.index === "number"}第{nextEpisode.index}話<br />{/if}{nextEpisode.title}
              </span>
            </button>
          {/if}
        </nav>
      </div>
    </main>
  </div>
{/if}

{#if showEpisodeMenu}
  <div
    class="modal-backdrop"
    aria-hidden="true"
    onclick={() => (showEpisodeMenu = false)}
    onkeydown={() => {}}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
      tabindex="-1"
      aria-hidden="false"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <h2 id="menu-title">話を選択</h2>
      <select
        class="episode-select"
        aria-label="話を選択"
        onchange={(e) => {
          currentEpisodeIdx = Number(e.currentTarget.value);
          saveIndexToCookie(currentEpisodeIdx);
          showEpisodeMenu = false;
        }}
      >
        {#each episodes as ep, i}
          <option value={i} selected={i === currentEpisodeIdx}>
            {typeof ep.index === "number"
              ? `第${ep.index}話`
              : ""}「{ep.title}」
          </option>
        {/each}
      </select>
      <button class="modal-close" onclick={() => (showEpisodeMenu = false)}
        >閉じる
      </button>
    </div>
  </div>
{/if}

{#if showAbout}
  <div
    class="modal-backdrop"
    aria-hidden="true"
    onclick={() => (showAbout = false)}
    onkeydown={() => {}}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      aria-hidden="false"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <h2 id="modal-title">このサイトについて</h2>
      <p>
        道草屋ばっくやーど漫画の非公式ビューワーです。<br />全ての画像の権利は桃色CODE様に帰属します。
      </p>
      <u>桃色CODE様</u>
      <ul>
        <li>
          漫画:
          <a
            href="http://momoirocode.web.fc2.com"
            target="_blank"
            rel="noopener noreferrer">momoirocode.web.fc2.com</a
          >
        </li>
        <li>
          Booth:
          <a
            href="https://momotori.booth.pm"
            target="_blank"
            rel="noopener noreferrer">momotori.booth.pm</a
          >
        </li>
        <li>
          DLsite:
          <a
            href="https://www.dlsite.com/home/circle/profile/=/maker_id/RG24350.html"
            target="_blank"
            rel="noopener noreferrer">桃色CODE / RG24350</a
          >
        </li>
      </ul>
      <u>漫画データ</u>
      <p>
        <a
          href="https://github.com/iranika/mo-code-4koma"
          target="_blank"
          rel="noopener noreferrer">iranika/mo-code-4koma</a
        >
      </p>
      <u>リポジトリ</u>
      <p>
        <a
          href="https://github.com/eggplants/michixa"
          target="_blank"
          rel="noopener noreferrer">eggplants/michixa</a
        >
      </p>
      <button class="modal-close" onclick={() => (showAbout = false)}
        >閉じる</button
      >
    </div>
  </div>
{/if}

<style>
  .viewer {
    min-height: 100vh;
    background: #1a1a1a;
    padding: 3rem 88px 2.5rem;
  }

  .image-area {
    width: 100%;
    user-select: none;
    min-height: calc(100vh - 5.5rem);
  }

  .image-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  .manga-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .nav-side {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    z-index: 10;
  }

  .nav-side-prev {
    left: 8px;
  }

  .nav-side-next {
    right: 8px;
  }

  @media (max-width: 768px) {
    .viewer {
      padding: 3rem 0 2.5rem;
    }

    .nav-side {
      top: auto;
      bottom: 2.5rem;
      transform: none;
    }
  }

  .nav-btn {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 0.75rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .nav-arrow {
    font-size: 1rem;
    line-height: 1;
  }

  .nav-btn:hover {
    background: rgba(0, 0, 0, 0.85);
  }

  .nav-info {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.65);
    text-align: center;
    line-height: 1.4;
    word-break: break-all;
    min-height: calc(0.65rem * 1.4 * 3);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.88);
    color: #e0e0e0;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    font-size: 0.95rem;
    font-family: "Hiragino Kaku Gothic Pro", "Noto Sans JP", system-ui, sans-serif;
    z-index: 10;
  }

  .status-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-width: 0;
    overflow: hidden;
    padding: 0 0.5rem;
  }

  .episode-info {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .episode-select {
    width: 100%;
    background: #333;
    border: 1px solid #555;
    border-radius: 4px;
    color: #e0e0e0;
    font-size: 0.9rem;
    font-family: "Hiragino Kaku Gothic Pro", "Noto Sans JP", system-ui, sans-serif;
    cursor: pointer;
    padding: 0.5rem;
  }

  .episode-select option {
    background: #1a1a1a;
    color: #e0e0e0;
  }

  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    color: rgba(255, 255, 255, 0.6);
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .share-icon {
    width: 1rem;
    height: 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .info-btn,
  .rss-btn,
  .menu-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 2.25rem;
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    flex-shrink: 0;
    text-decoration: none;
  }

  .share-btn:hover,
  .info-btn:hover,
  .rss-btn:hover,
  .menu-btn:hover {
    color: #fff;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: #2a2a2a;
    color: #e0e0e0;
    border-radius: 8px;
    padding: 2rem;
    max-width: 420px;
    width: 90%;
    font-family: "Hiragino Kaku Gothic Pro", "Noto Sans JP", system-ui, sans-serif;
  }

  .modal h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    color: #fff;
    text-align: center;
  }

  .modal p,
  .modal ul {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .modal ul {
    padding-inline-start: 15px;
  }

  .modal ul li {
    list-style-type: "- ";
  }

  .modal a {
    color: #93c5fd;
    text-decoration: none;
  }

  .modal a:hover {
    text-decoration: underline;
  }

  .modal-close {
    margin-top: 1.25rem;
    display: block;
    width: 100%;
    padding: 0.5rem;
    background: #444;
    color: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .modal-close:hover {
    background: #555;
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
