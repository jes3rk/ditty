// import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
const typescriptEslintEslintPlugin = require("@typescript-eslint/eslint-plugin");
// import globals from "globals";
const globals = require("globals");
// import tsParser from "@typescript-esl/int/parser";
const tsParser = require("@typescript-eslint/parser");
// import path from "node:path";
const path = require("node:path");
// import { fileURLToPath } from "node:url";
const {fileURLToPath} = require("node:url");
// import js from "@eslint/js";
const js = require("@eslint/js")
// import { FlatCompat } from "@eslint/eslintrc";
const {FlatCompat} = require("@eslint/eslintrc");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [{
    ignores: ["**/.eslintrc.js", "*/**/*.json"],
}, ...compat.extends("plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"), {
    plugins: {
        "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}];
