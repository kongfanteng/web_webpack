module.exports = {
  "parser": "babel-eslint",
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    paerser: 'babel-eslint',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "import/no-unresolved": [1, {ignore: ['^@/']}],
    'no-console': 0,
    'semi': 0,
  },
};
