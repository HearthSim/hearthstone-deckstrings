module.exports = {
	entry: './dist/index.js',
	target: "web",
	output: {
		library: "deckstrings",
		libraryTarget: "var",
		filename: "deckstrings.js",
	},
	externals: {
		atob: "window.atob",
		btoa: "window.btoa",
	},
};
