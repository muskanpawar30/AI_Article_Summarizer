import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { 
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    } 
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/display-name": "off", // Example of disabling a rule
    },
  },
];
