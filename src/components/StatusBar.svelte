<script lang="ts">
  import type { Episode } from '../types.ts'
  import InstallButton from './InstallButton.svelte'

  interface Props {
    episode: Episode
    onShowAbout: () => void
    onShowEpisodeMenu: () => void
  }

  const { episode, onShowAbout, onShowEpisodeMenu }: Props = $props()
</script>

<header class="status-bar">
  <div class="header-left">
    <button class="icon-btn" onclick={onShowAbout} aria-label="このサイトについて"> ℹ️ </button>
    <a
      class="icon-btn"
      href="/michixa/feed.xml"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RSSフィード">📡</a>
  </div>
  <span class="header-center" aria-live="polite" aria-atomic="true">
    <span class="episode-info">
      {#if typeof episode.index === 'number'}第{episode.index}話{/if}「{episode.title}」
    </span>
  </span>
  <span class="header-right" aria-live="polite" aria-atomic="true">
    <InstallButton />
    <button class="icon-btn" onclick={onShowEpisodeMenu} aria-label="話を選択"> 📕 </button>
  </span>
</header>

<style>
  .status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: rgb(240, 145, 153);
    color: #ffffff;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    font-family: 'Hiragino Kaku Gothic Pro', 'Noto Sans JP', system-ui, sans-serif;
    z-index: 10;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .header-center {
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
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-btn {
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

  .icon-btn:hover {
    color: #fff;
  }
</style>
