module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    './babel-plugins/inline-env-from-dotenv.js',
    'react-native-reanimated/plugin', // MUST stay last
  ],
};
