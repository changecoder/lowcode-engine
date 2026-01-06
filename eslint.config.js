const tsPlugin = require('@typescript-eslint/eslint-plugin')

const tsRecommendedRules = (tsPlugin && tsPlugin.configs && tsPlugin.configs.recommended && tsPlugin.configs.recommended.rules) || {}

module.exports = [
  {
    ignores: ['node_modules/**', 'packages/**/dist/**', 'packages/**/lib/**', 'eslint.config.js'],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: require('eslint-plugin-prettier'),
    },
    rules: Object.assign({}, tsRecommendedRules, {
      'prettier/prettier': 'error',
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    }),
  },
  {
    files: ['**/*.vue'],
    extends: ['plugin:vue/vue3-recommended'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  }
]
