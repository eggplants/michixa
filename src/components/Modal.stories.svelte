<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';
  import Modal from './Modal.svelte';

  const { Story } = defineMeta({
    component: Modal,
    title: 'Components/Modal',
    tags: ['autodocs'],
    args: {
      title: 'タイトル',
      titleId: 'modal-title',
      onclose: fn(),
    },
  });
</script>

<Story name="Default">
  {#snippet children(args)}
    <div style="position:relative;width:500px;height:400px">
      <Modal title={args.title} titleId={args.titleId} onclose={args.onclose}>
        {#snippet children()}
          <p>サンプルテキストです。</p>
          <p>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">リンク例</a>
          </p>
        {/snippet}
      </Modal>
    </div>
  {/snippet}
</Story>

<Story name="With List" args={{ title: '話を選択', titleId: 'modal-episode' }}>
  {#snippet children(args)}
    <div style="position:relative;width:500px;height:400px">
      <Modal title={args.title} titleId={args.titleId} onclose={args.onclose}>
        {#snippet children()}
          <ul>
            <li>りれきしょ</li>
            <li>第1話「はじまり」</li>
            <li>第2話「つづき」</li>
          </ul>
        {/snippet}
      </Modal>
    </div>
  {/snippet}
</Story>
