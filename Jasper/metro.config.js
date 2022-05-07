// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

// module.exports = getDefaultConfig(__dirname);

module.exports = {
	resolver: {
		/* resolver options */
		sourceExts: ["jsx", "js", "ts", "tsx", "cjs"], // add tsx if its not yet defined
	},
};
