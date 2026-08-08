<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, fn } from 'storybook/test'
  import StatusBar from './StatusBar.svelte'

  const { Story } = defineMeta({
    component: StatusBar,
    title: 'Components/StatusBar',
    tags: ['autodocs'],
    args: {
      episode: { index: 1, title: 'デフォルト', imageUrls: [] },
      onShowAbout: fn(),
      onShowEpisodeMenu: fn(),
    },
  })
</script>

<Story
  name="Numbered Episode"
  args={{
    episode: { index: 3, title: '道草屋の日常', imageUrls: [] },
    onShowAbout: fn(),
    onShowEpisodeMenu: fn(),
  }}
  play={async ({ canvas, args, userEvent }) => {
    const aboutBtn = canvas.getByRole('button', { name: 'このサイトについて' })
    await expect(aboutBtn).toBeInTheDocument()

    const menuBtn = canvas.getByRole('button', { name: '話を選択' })
    await expect(menuBtn).toBeInTheDocument()

    await expect(canvas.getByText('第3話「道草屋の日常」')).toBeInTheDocument()

    await userEvent.click(aboutBtn)
    await expect(args.onShowAbout).toHaveBeenCalledOnce()

    await userEvent.click(menuBtn)
    await expect(args.onShowEpisodeMenu).toHaveBeenCalledOnce()
  }}>
  {#snippet children(args)}
    <StatusBar
      episode={args.episode}
      onShowAbout={args.onShowAbout}
      onShowEpisodeMenu={args.onShowEpisodeMenu} />
  {/snippet}
</Story>

<Story
  name="Non-numeric Index"
  args={{
    episode: { index: 'ri', title: 'りれきしょ', imageUrls: [] },
    onShowAbout: fn(),
    onShowEpisodeMenu: fn(),
  }}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('「りれきしょ」')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'このサイトについて' })).toBeInTheDocument()
  }}>
  {#snippet children(args)}
    <StatusBar
      episode={args.episode}
      onShowAbout={args.onShowAbout}
      onShowEpisodeMenu={args.onShowEpisodeMenu} />
  {/snippet}
</Story>

<Story
  name="Long Title"
  args={{
    episode: {
      index: 99,
      title: 'とても長いタイトルのエピソードのサンプルテキスト',
      imageUrls: [],
    },
    onShowAbout: fn(),
    onShowEpisodeMenu: fn(),
  }}
  play={async ({ canvas }) => {
    await expect(
      canvas.getByText('第99話「とても長いタイトルのエピソードのサンプルテキスト」'),
    ).toBeInTheDocument()
  }}>
  {#snippet children(args)}
    <StatusBar
      episode={args.episode}
      onShowAbout={args.onShowAbout}
      onShowEpisodeMenu={args.onShowEpisodeMenu} />
  {/snippet}
</Story>
