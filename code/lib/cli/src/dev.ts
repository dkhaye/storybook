import { dedent } from 'ts-dedent';
import { findPackageSync } from 'fd-package-json';
import { logger, instance as npmLog } from '@storybook/node-logger';
import { buildDevStandalone, withTelemetry } from '@storybook/core-server';
import { cache } from '@storybook/core-common';
import type { CLIOptions } from '@storybook/types';
import invariant from 'tiny-invariant';

function printError(error: any) {
  // this is a weird bugfix, somehow 'node-pre-gyp' is polluting the npmLog header
  npmLog.heading = '';

  if (error instanceof Error) {
    if ((error as any).error) {
      logger.error((error as any).error);
    } else if ((error as any).stats && (error as any).stats.compilation.errors) {
      (error as any).stats.compilation.errors.forEach((e: any) => logger.plain(e));
    } else {
      logger.error(error as any);
    }
  } else if (error.compilation?.errors) {
    error.compilation.errors.forEach((e: any) => logger.plain(e));
  }

  logger.line();
  logger.warn(
    error.close
      ? dedent`
          FATAL broken build!, will close the process,
          Fix the error below and restart storybook.
        `
      : dedent`
          Broken build, fix the error above.
          You may need to refresh the browser.
        `
  );
  logger.line();
}

export const dev = async (cliOptions: CLIOptions) => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  const packageJson = findPackageSync(__dirname);
  invariant(packageJson, 'Failed to find the closest package.json file.');
  const options = {
    ...cliOptions,
    configDir: cliOptions.configDir || './.storybook',
    configType: 'DEVELOPMENT',
    ignorePreview: !!cliOptions.previewUrl && !cliOptions.forceBuildPreview,
    cache,
    packageJson,
  } as Parameters<typeof buildDevStandalone>[0];

  await withTelemetry(
    'dev',
    {
      cliOptions,
      presetOptions: options as Parameters<typeof withTelemetry>[1]['presetOptions'],
      printError,
    },
    () => buildDevStandalone(options)
  );
};
