<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn } from 'storybook/test';
  import NavButton from './NavButton.svelte';

  const { Story } = defineMeta({
    component: NavButton,
    title: 'Components/NavButton',
    tags: ['autodocs'],
    argTypes: {
      direction: { control: 'radio', options: ['prev', 'next'] },
    },
    args: {
      direction: 'next',
      episode: null,
      onclick: fn(),
    },
  });
</script>

<Story
  name="Prev - With Episode"
  args={{ direction: 'prev', episode: { index: 2, title: 'テスト話', imageUrls: [] }, onclick: fn() }}
  play={async ({ canvas, args, userEvent }) => {
    args.onclick.mockClear();
    const btn = canvas.getByRole('button');
    await expect(btn).toBeInTheDocument();
    await expect(btn).toHaveAttribute('aria-label', '前の話：第2話「テスト話」');
    await userEvent.click(btn);
    await expect(args.onclick).toHaveBeenCalledOnce();
  }}
>
  {#snippet children(args)}
    <div style="position:relative;width:300px;height:120px;background:#222;border-radius:8px">
      <NavButton direction={args.direction} episode={args.episode} onclick={args.onclick} />
    </div>
  {/snippet}
</Story>

<Story
  name="Next - With Episode"
  args={{ direction: 'next', episode: { index: 2, title: 'テスト話', imageUrls: [] }, onclick: fn() }}
  play={async ({ canvas, args, userEvent }) => {
    args.onclick.mockClear();
    const btn = canvas.getByRole('button');
    await expect(btn).toBeInTheDocument();
    await expect(btn).toHaveAttribute('aria-label', '次の話：第2話「テスト話」');
    await userEvent.click(btn);
    await expect(args.onclick).toHaveBeenCalledOnce();
  }}
>
  {#snippet children(args)}
    <div style="position:relative;width:300px;height:120px;background:#222;border-radius:8px">
      <NavButton direction={args.direction} episode={args.episode} onclick={args.onclick} />
    </div>
  {/snippet}
</Story>

<Story
  name="No Episode (disabled)"
  args={{ direction: 'next', episode: null, onclick: fn() }}
  play={async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
  }}
>
  {#snippet children(args)}
    <div style="position:relative;width:300px;height:120px;background:#222;border-radius:8px">
      <NavButton direction={args.direction} episode={args.episode} onclick={args.onclick} />
    </div>
  {/snippet}
</Story>

<Story
  name="Non-numeric Index"
  args={{ direction: 'prev', episode: { index: 'ri', title: 'りれきしょ', imageUrls: [] }, onclick: fn() }}
  play={async ({ canvas, args, userEvent }) => {
    args.onclick.mockClear();
    const btn = canvas.getByRole('button');
    await expect(btn).toBeInTheDocument();
    await expect(btn).toHaveAttribute('aria-label', '前の話：「りれきしょ」');
    await userEvent.click(btn);
    await expect(args.onclick).toHaveBeenCalledOnce();
  }}
>
  {#snippet children(args)}
    <div style="position:relative;width:300px;height:120px;background:#222;border-radius:8px">
      <NavButton direction={args.direction} episode={args.episode} onclick={args.onclick} />
    </div>
  {/snippet}
</Story>
