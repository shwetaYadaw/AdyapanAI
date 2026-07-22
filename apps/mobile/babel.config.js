module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',
            '@components': './components',
            '@services': './services',
            '@store': './store',
            '@hooks': './hooks',
            '@adyapan/shared': '../../packages/shared/src/index.ts',
          },
        },
      ],
    ],
  };
};
