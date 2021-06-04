module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './webapp/tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/triple-slash-reference': 'off'
  }
}
