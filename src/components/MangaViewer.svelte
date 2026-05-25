<script lang="ts">
  import type { Episode } from "../types.ts";
  import NavButton from "./NavButton.svelte";
  import SwipeHint from "./SwipeHint.svelte";

  interface Props {
    currentEpisode: Episode;
    prevEpisode: Episode | null;
    nextEpisode: Episode | null;
    xIntentUrl: string;
    onprev: () => void;
    onnext: () => void;
  }

  const { currentEpisode, prevEpisode, nextEpisode, xIntentUrl, onprev, onnext }: Props =
    $props();

  let imagesLoaded = $state(false);
  let loadedImageCount = $state(0);

  $effect(() => {
    void currentEpisode;
    loadedImageCount = 0;
    imagesLoaded = currentEpisode.imageUrls.length === 0;
  });

  function onImageLoad(): void {
    loadedImageCount++;
    if (loadedImageCount >= currentEpisode.imageUrls.length) {
      imagesLoaded = true;
    }
  }

  const SWIPE_THRESHOLD = 200;
  let dragStartX = $state<number | null>(null);
  let dragCurrentDx = $state(0);

  const swipeProgress = $derived(
    dragStartX !== null ? Math.min(Math.abs(dragCurrentDx) / SWIPE_THRESHOLD, 1) : 0,
  );

  function onDragStart(x: number): void {
    dragStartX = x;
    dragCurrentDx = 0;
  }

  function onDragMove(x: number): void {
    if (dragStartX === null) return;
    dragCurrentDx = x - dragStartX;
  }

  function onDragEnd(x: number): void {
    if (dragStartX === null) return;
    const dx = x - dragStartX;
    dragStartX = null;
    dragCurrentDx = 0;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) onnext();
    else onprev();
  }

  function handleTouchStart(e: TouchEvent): void { onDragStart(e.touches[0].clientX); }
  function handleTouchMove(e: TouchEvent): void { onDragMove(e.touches[0].clientX); }
  function handleTouchEnd(e: TouchEvent): void { onDragEnd(e.changedTouches[0].clientX); }
  function handleMouseDown(e: MouseEvent): void { e.preventDefault(); onDragStart(e.clientX); }
  function handleMouseMove(e: MouseEvent): void { onDragMove(e.clientX); }
  function handleMouseUp(e: MouseEvent): void { onDragEnd(e.clientX); }
</script>

<div
  class="image-area"
  role="presentation"
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
>
  <NavButton direction="prev" episode={prevEpisode} onclick={onprev} />

  <SwipeHint
    direction={dragCurrentDx >= 0 ? "next" : "prev"}
    progress={swipeProgress}
  />

  <figure
    class="image-container"
    hidden={imagesLoaded}
    aria-label="{typeof currentEpisode.index === 'number'
      ? `第${currentEpisode.index}話`
      : ''}「{currentEpisode.title}」"
  >
    {#each currentEpisode.imageUrls as url, i}
      <img
        src={url}
        alt="{typeof currentEpisode.index === 'number'
          ? `第${currentEpisode.index}話`
          : ''}{currentEpisode.title} ({i + 1}/{currentEpisode.imageUrls.length}ページ)"
        class="manga-image"
        loading="eager"
        draggable="false"
        onload={onImageLoad}
      />
    {/each}
  </figure>

  <NavButton direction="next" episode={nextEpisode} onclick={onnext} />

  <nav class="share-center" aria-label="共有">
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
  </nav>
</div>

<style>
  .image-area {
    position: relative;
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

  .share-center {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .share-btn {
    background: rgba(240, 145, 153, 0.5);
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
    width: 3rem;
    height: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .share-btn:hover {
    background: rgba(240, 145, 153, 0.9);
  }

  .share-icon {
    width: 1.3rem;
    height: 1.3rem;
  }
</style>
