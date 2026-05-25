import type { StorybookConfig } from '@storybook/svelte-vite'

const pwaPluginNames: readonly string[] = [
  'vite-plugin-pwa',
  'vite-plugin-pwa:build',
  'vite-plugin-pwa:dev-sw',
  'vite-plugin-pwa:info',
] as const

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/svelte-vite',
  viteFinal: async config => {
    const plugins = config.plugins?.filter(plugin => {
      if (plugin && 'name' in plugin && plugin.name) {
        return !pwaPluginNames.includes(plugin.name)
      }
      return true
    })
    return {
      ...config,
      plugins,
    }
  },
}
export default config
