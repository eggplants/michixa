<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect } from 'storybook/test'
  import FullscreenButton from './FullscreenButton.svelte'

  const { Story } = defineMeta({
    component: FullscreenButton,
    title: 'Components/FullscreenButton',
    tags: ['autodocs'],
  })
</script>

<Story
  name="Default"
  play={async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'フルスクリーン表示' })
    await expect(btn).toBeInTheDocument()
    await expect(btn).toHaveAttribute('aria-pressed', 'false')
    await expect(btn).toHaveTextContent('⛶')
  }}>
  {#snippet children()}
    <FullscreenButton />
  {/snippet}
</Story>
