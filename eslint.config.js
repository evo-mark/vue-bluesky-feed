import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
	{ ignores: ["*.d.ts", "**/coverage", "**/dist","node_modules"] },
	{
		extends: [
			eslint.configs.recommended,
			...typescriptEslint.configs.recommended,
			...eslintPluginVue.configs["flat/recommended"],
		],
		files: ["**/*.{ts,vue}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.browser,
			parserOptions: {
				parser: typescriptEslint.parser,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",
			"vue/no-v-html": "off",
		},
	},
	eslintConfigPrettier,
);