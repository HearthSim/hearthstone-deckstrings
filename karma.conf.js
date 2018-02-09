module.exports = config => {
	config.set({
		frameworks: ["mocha", "chai"],
		files: ["test/**/*.js"],
		reporters: ["progress"],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ["ChromeHeadless"],
		concurrency: Infinity,
		preprocessors: {
			"test/**/*.js": ["rollup"],
		},
		rollupPreprocessor: {
			output: {
				format: "iife",
				name: "deckstrings",
				sourcemap: "inline",
			},
			plugins: [
				require("rollup-plugin-jscc")({
					values: {
						_PLATFORM: "browser",
					},
				}),
				require("rollup-plugin-node-resolve")(),
			],
		},
	});
};
