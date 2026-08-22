<script lang="ts">
  let isFullscreen = $state(false)

  $effect(() => {
    const sync = (): void => {
      isFullscreen = document.fullscreenElement !== null
    }
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  })

  async function lockLandscape(): Promise<void> {
    // 横画面固定は Android Chrome などタッチ端末のフルスクリーン時のみ有効。
    // 非対応環境（iOS Safari・デスクトップ）では例外になるので握り潰す。
    if (!window.matchMedia('(pointer: coarse)').matches) return
    try {
      await screen.orientation.lock('landscape')
    } catch {
      /* 非対応環境では横画面固定をあきらめる */
    }
  }

  async function toggleFullscreen(): Promise<void> {
    if (document.fullscreenElement !== null) {
      try {
        screen.orientation.unlock()
      } catch {
        /* 非対応環境では何もしない */
      }
      await document.exitFullscreen()
      return
    }

    try {
      await document.documentElement.requestFullscreen()
    } catch {
      return
    }
    await lockLandscape()
  }
</script>

<button
  class="fullscreen-btn"
  onclick={() => void toggleFullscreen()}
  aria-pressed={isFullscreen}
  aria-label={isFullscreen ? 'フルスクリーンを解除' : 'フルスクリーン表示'}>⛶</button>

<style>
  .fullscreen-btn {
    position: fixed;
    bottom: calc(1rem + 3.5rem);
    right: 8px;
    z-index: 10;
    background: rgba(240, 145, 153, 0.5);
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
    width: 3rem;
    height: 3rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
  }

  .fullscreen-btn:hover {
    background: rgba(240, 145, 153, 0.9);
  }

  @media (max-width: 768px) {
    .fullscreen-btn {
      bottom: calc(1rem + 7rem);
    }
  }
</style>
