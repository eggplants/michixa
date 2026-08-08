<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect } from 'storybook/test'
  import ChevronSvg from './ChevronSvg.svelte'

  const { Story } = defineMeta({
    component: ChevronSvg,
    title: 'Components/ChevronSvg',
    tags: ['autodocs'],
    argTypes: {
      direction: { control: 'radio', options: ['prev', 'next'] },
      size: { control: 'text' },
    },
    args: {
      direction: 'next',
      size: '1.5rem',
    },
  })
</script>

<Story
  name="Prev"
  args={{ direction: 'prev', size: '1.5rem' }}
  play={async ({ canvasElement }) => {
    const polyline = canvasElement.querySelector('polyline')
    await expect(polyline).not.toBeNull()
    await expect(polyline?.getAttribute('points')).toBe('15 18 9 12 15 6')
  }}>
  {#snippet children(args)}
    <div style="display:inline-flex;padding:1rem;border-radius:8px;">
      <ChevronSvg direction={args.direction} size={args.size} />
    </div>
  {/snippet}
</Story>

<Story
  name="Next"
  args={{ direction: 'next', size: '1.5rem' }}
  play={async ({ canvasElement }) => {
    const polyline = canvasElement.querySelector('polyline')
    await expect(polyline).not.toBeNull()
    await expect(polyline?.getAttribute('points')).toBe('9 18 15 12 9 6')
  }}>
  {#snippet children(args)}
    <div style="display:inline-flex;padding:1rem;border-radius:8px">
      <ChevronSvg direction={args.direction} size={args.size} />
    </div>
  {/snippet}
</Story>

<Story
  name="Large"
  args={{ direction: 'next', size: '3rem' }}
  play={async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    await expect(svg).not.toBeNull()
    await expect(svg?.getAttribute('width')).toBe('3rem')
    await expect(svg?.getAttribute('height')).toBe('3rem')
  }}>
  {#snippet children(args)}
    <div style="display:inline-flex;padding:1rem;border-radius:8px">
      <ChevronSvg direction={args.direction} size={args.size} />
    </div>
  {/snippet}
</Story>
