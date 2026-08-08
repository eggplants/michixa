<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SwipeHint from './SwipeHint.svelte'

  const { Story } = defineMeta({
    component: SwipeHint,
    title: 'Components/SwipeHint',
    tags: ['autodocs'],
    argTypes: {
      direction: { control: 'radio', options: ['prev', 'next'] },
      progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    },
    args: {
      direction: 'next',
      progress: 0.5,
    },
  })
</script>

<Story name="Prev - Half" args={{ direction: 'prev', progress: 0.5 }}>
  {#snippet children(args)}
    <div
      style="position:relative;width:300px;height:200px;background:#222;border-radius:8px;overflow:hidden">
      <SwipeHint {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Next - Full" args={{ direction: 'next', progress: 1 }}>
  {#snippet children(args)}
    <div
      style="position:relative;width:300px;height:200px;background:#222;border-radius:8px;overflow:hidden">
      <SwipeHint {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Faint" args={{ direction: 'prev', progress: 0.2 }}>
  {#snippet children(args)}
    <div
      style="position:relative;width:300px;height:200px;background:#222;border-radius:8px;overflow:hidden">
      <SwipeHint {...args} />
    </div>
  {/snippet}
</Story>
