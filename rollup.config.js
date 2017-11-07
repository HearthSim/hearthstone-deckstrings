import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import jscc from "rollup-plugin-jscc";
import pkg from "./package.json";

const plugins = [
	typescript({
		typescript: require("typescript"),
	}),
	resolve(),
	commonjs(),
];

export default [
	{
		entry: "src/index.ts",
		moduleName: "deckstrings",
		dest: pkg.main,
		format: "cjs",
		plugins: [
			jscc({
				values: {
					_PLATFORM: "node",
				},
				extensions: [".js", ".ts"],
			}),
		].concat(plugins),
	},
	{
		entry: "src/index.ts",
		moduleName: "deckstrings",
		dest: pkg.browser,
		format: "umd",
		plugins: [
			jscc({
				values: {
					_PLATFORM: "web",
				},
				extensions: [".js", ".ts"],
			}),
		].concat(plugins),
	},
];
