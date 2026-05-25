<script lang="ts">
  import type { Episode } from "../types.ts";
  import ChevronSvg from "./ChevronSvg.svelte";

  interface Props {
    direction: "prev" | "next";
    episode: Episode | null;
    onclick: () => void;
  }

  const { direction, episode, onclick }: Props = $props();

  const episodeString = $derived(
    episode
      ? typeof episode.index === "number"
        ? `第${episode.index}話`
        : ""
      : "",
  );
</script>

<nav class="nav-side nav-side-{direction}" aria-label="{direction === 'prev' ? '前' : '次'}の話へ">
  {#if episode}
    <button
      class="nav-btn"
      onclick={(e) => { onclick(); e.currentTarget.blur(); }}
      aria-label="{direction === 'prev' ? '前' : '次'}の話：{episodeString}「{episode.title}」"
    >
      <ChevronSvg {direction} />
    </button>
  {/if}
</nav>

<style>
  .nav-side {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .nav-side-prev {
    left: 8px;
  }

  .nav-side-next {
    right: 8px;
  }

  @media (max-width: 768px) {
    .nav-side {
      top: auto;
      bottom: 1rem;
      transform: none;
    }
  }

  .nav-btn {
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

  .nav-btn:hover {
    background: rgba(240, 145, 153, 0.9);
  }

</style>
