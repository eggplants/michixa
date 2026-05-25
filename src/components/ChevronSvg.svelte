<script lang="ts">
  interface Props {
    direction: "prev" | "next";
    size?: string;
  }

  const { direction, size = "1.5rem" }: Props = $props();
</script>

<svg
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  aria-hidden="true"
>
  {#if direction === "prev"}
    <polyline points="15 18 9 12 15 6" />
  {:else}
    <polyline points="9 18 15 12 9 6" />
  {/if}
</svg>

<style>
  svg {
    stroke: #fff;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    display: block;
  }
</style>
