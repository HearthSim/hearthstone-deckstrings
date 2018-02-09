import jscc from "rollup-plugin-jscc";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import tsc from "typescript";
import pkg from "./package.json";

export default [
	{
		input: "src/index.ts",
		output: [
			{
				format: "umd",
				file: `${pkg.main}.js`,
				name: "deckstrings",
			},
			{
				format: "es",
				file: `${pkg.main}.mjs`,
			},
		],
		plugins: [
			jscc({
				values: {
					_PLATFORM: "node",
				},
				extensions: [".js", ".ts"],
			}),
			typescript({
				typescript: tsc,
			}),
			resolve(),
			commonjs(),
		],
	},
	{
		input: "src/index.ts",
		output: [
			{
				format: "umd",
				file: `${pkg.browser}.js`,
				name: "deckstrings",
			},
			{
				format: "es",
				file: `${pkg.browser}.mjs`,
			},
		],
		plugins: [
			jscc({
				values: {
					_PLATFORM: "browser",
				},
				extensions: [".js", ".ts"],
			}),
			typescript({
				typescript: tsc,
			}),
			resolve({ browser: true }),
			commonjs(),
		],
	},
];
