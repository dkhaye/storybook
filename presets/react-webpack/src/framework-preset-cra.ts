import type { StorybookConfig } from '@storybook/core-webpack';

export const webpackFinal: StorybookConfig['webpack'] = (config, { presetsList }) => {
  config.module?.rules?.push(
    ...[
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ]
  );
  return config;
};
