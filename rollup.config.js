import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import pkg from "./package.json";

export default {
	input: "src/index.ts",
	output: [
		{
			name: "deckstrings",
			file: `${pkg.main}.js`,
			format: "umd",
		},
		{
			name: "deckstrings",
			file: `${pkg.main}.mjs`,
			format: "es",
		},
	],
	plugins: [
		typescript({
			typescript: require("typescript"),
		}),
		resolve(),
		commonjs(),
	],
};
