module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:@next/next/recommended'
  ],
  parserOptions: {
    project: './webapp/tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/triple-slash-reference': 'off'
  }
}
