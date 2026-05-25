<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    titleId: string;
    onclose: () => void;
    children: Snippet;
  }

  const { title = '', titleId = '', onclose = () => {}, children }: Props = $props();
</script>

<div
  class="modal-backdrop"
  aria-hidden="true"
  onclick={onclose}
  onkeydown={() => {}}
>
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
    tabindex="-1"
    aria-hidden="false"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
  >
    <button class="modal-close" onclick={onclose} aria-label="閉じる">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <line x1="4" y1="4" x2="20" y2="20" />
        <line x1="20" y1="4" x2="4" y2="20" />
      </svg>
    </button>
    <h2 id={titleId}>{title}</h2>
    {@render children()}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(240, 145, 153, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    position: relative;
    background: rgb(240, 145, 153);
    color: #ffffff;
    border-radius: 8px;
    padding: 2rem;
    max-width: 420px;
    width: 90%;
  }

  .modal h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: #fff;
    text-align: center;
  }

  .modal :global(p),
  .modal :global(u),
  .modal :global(ul) {
    margin: 0.25rem 0;
    font-size: 0.95rem;
    font-weight: bold;
    line-height: 1.7;
  }

  .modal :global(ul) {
    padding-inline-start: 15px;
  }

  .modal :global(ul li) {
    list-style-type: "- ";
  }

  .modal :global(a) {
    color: #b8e0f0;
    text-decoration: none;
  }

  .modal :global(a:hover) {
    text-decoration: underline;
  }

  .modal-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
    padding: 0.35rem;
    background: rgb(210, 100, 112);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .modal-close svg {
    width: 100%;
    height: 100%;
    stroke: #fff;
    stroke-width: 2.5;
    stroke-linecap: round;
  }

  .modal-close:hover {
    background: rgb(190, 80, 92);
  }
</style>
