module.exports = {
  root: true,
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // disable everything else
    'react-hooks/exhaustive-deps': 'off',
  },
  // or simply disable all rules by not extending anything
  extends: [],
}
