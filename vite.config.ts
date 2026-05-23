import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  base: '/michixa',
  plugins: [svelte()],
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
