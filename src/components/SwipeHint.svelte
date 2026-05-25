<script lang="ts">
  import ChevronSvg from "./ChevronSvg.svelte";

  interface Props {
    direction: "prev" | "next";
    progress: number;
  }

  const { direction, progress }: Props = $props();
</script>

<div
  class="swipe-hint"
  style:opacity={progress}
  style:transform="translate(-50%, -50%) scale({0.5 + 0.5 * progress})"
  aria-hidden="true"
>
  <ChevronSvg {direction} size="2.5rem" />
</div>

<style>
  .swipe-hint {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 5rem;
    height: 5rem;
    background: rgba(240, 145, 153, 0.85);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
    z-index: 20;
  }
</style>
