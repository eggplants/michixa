import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  base: '/michixa',
  test: {
    environment: 'happy-dom',
    includeSource: ['src/**/*.ts'],
  },
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192.png', 'pwa-512.png'],
      workbox: {
        navigateFallbackDenylist: [/\/feed\.xml$/],
      },
      manifest: {
        name: '非公式道草屋ばっくやーど漫画ビューア',
        short_name: 'michixa',
        description: '道草屋ばっくやーど漫画の非公式ビューワー',
        theme_color: '#f09199',
        background_color: '#f09199',
        display: 'standalone',
        scope: '/michixa/',
        start_url: '/michixa/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  fmt: {
    arrowParens: 'avoid',
    bracketSameLine: true,
    bracketSpacing: true,
    endOfLine: 'lf',
    ignorePatterns: ['pnpm-lock.yaml', 'pnpm-workspace.yaml', 'apps/*-api/docs/openapi.yaml'],
    insertFinalNewline: true,
    jsxSingleQuote: false,
    objectWrap: 'preserve',
    printWidth: 100,
    semi: false,
    singleQuote: true,
    sortImports: {
      newlinesBetween: false,
    },
    sortPackageJson: true,
    svelte: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
    vueIndentScriptAndStyle: false,
  },
  run: {
    tasks: {
      'generate-feed': {
        command: 'node scripts/generate-feed.mjs',
        cache: false,
      },
    },
  },
  lint: {
    jsPlugins: [
      { name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
      'eslint-plugin-svelte',
    ],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ['*.svelte', '**/*.svelte'],
        rules: {
          'no-inner-declarations': 'off',
          'no-self-assign': 'off',
        },
        jsPlugins: ['eslint-plugin-svelte'],
      },
    ],
  },
})
