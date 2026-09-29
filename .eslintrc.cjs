module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  overrides: [
    {
      files: ["*.config.js", "*.config.ts", "*.config.cjs"],
      env: {node: true},
    },
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      {allowConstantExport: true},
    ],
  },
};
