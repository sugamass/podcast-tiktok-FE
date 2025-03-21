const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// config.transformer = {
//   ...config.transformer,
//   babelTransformerPath: require.resolve("react-native-dotenv"),
// };

module.exports = withNativeWind(config, {
  input: "./assets/styles/global.css",
});
