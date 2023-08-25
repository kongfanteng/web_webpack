module.exports = {
  env: {
    browser: true,
    es2021: true,
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
    'no-console': 0,
    semi: 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-dynamic-require': 0,
    'no-unused-expressions': 0,
    'class-methods-use-this': 0, // 待删除
  },
};
