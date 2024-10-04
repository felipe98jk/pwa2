module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{jpg,png,html,json,js,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};