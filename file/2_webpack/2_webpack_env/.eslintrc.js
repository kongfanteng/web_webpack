module.exports = {
  parser: 'babel-eslint',
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
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    'import/no-unresolved': [1, { ignore: ['^@/'] }],
    'no-console': 0,
    semi: 0,
  },
  settings: {
    'import/core-modules': ['html-webpack-plugin', 'clean-webpack-plugin', 'webpack-merge', 'mini-css-extract-plugin'],
  },
};
