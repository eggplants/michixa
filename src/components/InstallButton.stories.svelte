<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect } from 'storybook/test'
  import InstallButton from './InstallButton.svelte'

  const { Story } = defineMeta({
    component: InstallButton,
    title: 'Components/InstallButton',
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'PWA install prompt button. Renders only when `beforeinstallprompt` fires (i.e. in a PWA-eligible browser context). Invisible in Storybook by default.',
        },
      },
    },
  })
</script>

<!-- The button is hidden until beforeinstallprompt fires, which doesn't happen in Storybook. -->
<!-- The story below shows the surrounding layout context. -->
<Story
  name="Default (hidden until PWA eligible)"
  play={async ({ canvasElement }) => {
    // beforeinstallprompt never fires in Storybook, so the button is not rendered
    const btn = canvasElement.querySelector('button')
    await expect(btn).toBeNull()
  }}>
  {#snippet children()}
    <div
      style="background:rgb(240,145,153);padding:0.5rem 1rem;display:inline-flex;align-items:center;gap:16px;border-radius:4px">
      <span style="color:#fff;font-size:0.9rem">← install button appears here in PWA context</span>
      <InstallButton />
    </div>
  {/snippet}
</Story>
