import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import tsc from "typescript";
import pkg from "./package.json";

export default {
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
		typescript({
			typescript: tsc,
		}),
		resolve(),
		commonjs(),
	],
};
