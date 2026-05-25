<script lang="ts">
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }

  let installPromptEvent = $state<BeforeInstallPromptEvent | null>(null);

  $effect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      installPromptEvent = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  });

  async function installPwa(): Promise<void> {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    installPromptEvent = null;
  }
</script>

{#if installPromptEvent}
  <button class="install-btn" onclick={installPwa} aria-label="インストール">
    📥
  </button>
{/if}

<style>
  .install-btn {
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
  }

  .install-btn:hover {
    color: #fff;
  }
</style>
