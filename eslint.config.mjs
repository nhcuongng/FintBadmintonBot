import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // Ignore patterns (replaces .eslintignore)
    ignores: [
      "node_modules/**",
      "db/*.json",
      "*.log",
      "coverage/**",
      "dist/**",
      "build/**"
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      // General code quality rules
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": "off", // Allow console.log for logging in Node.js
      "prefer-const": "error",
      "no-var": "error",
      
      // Async/Promise rules
      "no-async-promise-executor": "error",
      "require-await": "warn",
      
      // Style rules
      "indent": ["error", 4],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      
      // Node.js specific
      "no-process-exit": "error",
      "handle-callback-err": "error"
    }
  }
];
