import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import pkg from "./package.json";

export default [
	{
		input: "src/index.ts",
		name: "deckstrings",
		output: {
			file: pkg.main,
			format: "umd",
		},
		plugins: [
			typescript({
				typescript: require("typescript"),
			}),
			resolve(),
			commonjs(),
		],
	},
];
