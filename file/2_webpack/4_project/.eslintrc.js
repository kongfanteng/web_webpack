module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb',
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
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    semi: 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-filename-extension': 0,
  },
  settings: {
    // 'import/core-modules': [
    //   'html-webpack-plugin',
    // 'clean-webpack-plugin', 'webpack-merge', 'mini-css-extract-plugin', 'react', 'react-dom',
    // ],
  },
};
