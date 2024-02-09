module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'plugin:vuetify/base',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser"
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
