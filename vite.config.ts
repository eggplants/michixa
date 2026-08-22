import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

export default defineConfig({
  base: '/michixa',
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['cobertura', 'text', 'json-summary', 'json'] : ['html'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'happy-dom',
          includeSource: ['src/**/*.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: fileURLToPath(new URL('./.storybook', import.meta.url)),
            storybookScript: 'pnpm run sb:ci',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            screenshotFailures: false,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
  plugins: [
    svelte(),
    VitePWA({
      disable: process.env.SB === '1',
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
        orientation: 'landscape',
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
        files: ['*.svelte', '**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
        rules: {
          'no-inner-declarations': 'off',
          'no-self-assign': 'off',
          'svelte/derived-has-same-inputs-outputs': 'error',
          'svelte/no-add-event-listener': 'error',
          'svelte/no-ignored-unsubscribe': 'error',
          'svelte/no-inspect': 'error',
          'svelte/no-store-async': 'error',
          'svelte/no-svelte-internal': 'error',
          'svelte/no-unnecessary-state-wrap': 'error',
          'svelte/prefer-derived-over-derived-by': 'error',
          'svelte/prefer-svelte-reactivity': 'error',
          'svelte/prefer-writable-derived': 'error',
          'svelte/require-store-callbacks-use-set-param': 'error',
          'svelte/require-stores-init': 'error',
          'svelte/indent': 'off',
          'svelte/prefer-const': 'off',
          'svelte/prefer-destructured-store-props': 'off',
        },
        jsPlugins: ['eslint-plugin-svelte'],
      },
    ],
  },
})
