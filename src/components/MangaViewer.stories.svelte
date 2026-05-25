<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn } from 'storybook/test';
  import MangaViewer from './MangaViewer.svelte';

  const IMG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  const { Story } = defineMeta({
    component: MangaViewer,
    title: 'Components/MangaViewer',
    tags: ['autodocs'],
    args: {
      currentEpisode: { index: 0, title: 'デフォルト', imageUrls: [] },
      prevEpisode: null,
      nextEpisode: null,
      xIntentUrl: '',
      onprev: fn(),
      onnext: fn(),
    },
  });
</script>

<Story
  name="With Images"
  args={{
    currentEpisode: {
      index: 1,
      title: 'はじまり',
      imageUrls: [IMG, IMG],
    },
    prevEpisode: null,
    nextEpisode: { index: 2, title: 'つづき', imageUrls: [] },
    xIntentUrl: 'https://twitter.com/intent/tweet?text=test',
    onprev: fn(),
    onnext: fn(),
  }}
  play={async ({ canvas, canvasElement, args, userEvent }) => {
    const figure = canvasElement.querySelector('figure[aria-label="第1話「はじまり」"]');
    await expect(figure).not.toBeNull();
    await expect(figure?.querySelectorAll('img').length).toBe(2);

    const nextBtn = canvas.getByRole('button', { name: /次の話/ });
    await userEvent.click(nextBtn);
    await expect(args.onnext).toHaveBeenCalledOnce();

    await expect(canvas.queryByRole('button', { name: /前の話/ })).toBeNull();
  }}
>
  {#snippet children(args)}
    <MangaViewer
      currentEpisode={args.currentEpisode}
      prevEpisode={args.prevEpisode}
      nextEpisode={args.nextEpisode}
      xIntentUrl={args.xIntentUrl}
      onprev={args.onprev}
      onnext={args.onnext}
    />
  {/snippet}
</Story>

<Story
  name="First Episode (no prev)"
  args={{
    currentEpisode: {
      index: 1,
      title: 'はじまり',
      imageUrls: [IMG],
    },
    prevEpisode: null,
    nextEpisode: { index: 2, title: 'つづき', imageUrls: [] },
    xIntentUrl: 'https://twitter.com/intent/tweet?text=test',
    onprev: fn(),
    onnext: fn(),
  }}
  play={async ({ canvas, canvasElement }) => {
    const figure = canvasElement.querySelector('figure[aria-label="第1話「はじまり」"]');
    await expect(figure).not.toBeNull();
    await expect(canvas.queryByRole('button', { name: /前の話/ })).toBeNull();
    await expect(canvas.getByRole('button', { name: /次の話/ })).toBeInTheDocument();
  }}
>
  {#snippet children(args)}
    <MangaViewer
      currentEpisode={args.currentEpisode}
      prevEpisode={args.prevEpisode}
      nextEpisode={args.nextEpisode}
      xIntentUrl={args.xIntentUrl}
      onprev={args.onprev}
      onnext={args.onnext}
    />
  {/snippet}
</Story>

<Story
  name="Last Episode (no next)"
  args={{
    currentEpisode: {
      index: 5,
      title: 'さいご',
      imageUrls: [IMG],
    },
    prevEpisode: { index: 4, title: 'ひとつまえ', imageUrls: [] },
    nextEpisode: null,
    xIntentUrl: 'https://twitter.com/intent/tweet?text=test',
    onprev: fn(),
    onnext: fn(),
  }}
  play={async ({ canvas, canvasElement }) => {
    const figure = canvasElement.querySelector('figure[aria-label="第5話「さいご」"]');
    await expect(figure).not.toBeNull();
    await expect(canvas.queryByRole('button', { name: /次の話/ })).toBeNull();
    await expect(canvas.getByRole('button', { name: /前の話/ })).toBeInTheDocument();
  }}
>
  {#snippet children(args)}
    <MangaViewer
      currentEpisode={args.currentEpisode}
      prevEpisode={args.prevEpisode}
      nextEpisode={args.nextEpisode}
      xIntentUrl={args.xIntentUrl}
      onprev={args.onprev}
      onnext={args.onnext}
    />
  {/snippet}
</Story>

<Story
  name="Non-numeric Index"
  args={{
    currentEpisode: {
      index: 'ri',
      title: 'りれきしょ',
      imageUrls: [IMG],
    },
    prevEpisode: null,
    nextEpisode: { index: 1, title: 'はじまり', imageUrls: [] },
    xIntentUrl: 'https://twitter.com/intent/tweet?text=test',
    onprev: fn(),
    onnext: fn(),
  }}
  play={async ({ canvas, canvasElement }) => {
    const figure = canvasElement.querySelector('figure[aria-label="「りれきしょ」"]');
    await expect(figure).not.toBeNull();
    await expect(canvas.queryByRole('button', { name: /前の話/ })).toBeNull();
    await expect(canvas.getByRole('button', { name: /次の話/ })).toBeInTheDocument();
  }}
>
  {#snippet children(args)}
    <MangaViewer
      currentEpisode={args.currentEpisode}
      prevEpisode={args.prevEpisode}
      nextEpisode={args.nextEpisode}
      xIntentUrl={args.xIntentUrl}
      onprev={args.onprev}
      onnext={args.onnext}
    />
  {/snippet}
</Story>
