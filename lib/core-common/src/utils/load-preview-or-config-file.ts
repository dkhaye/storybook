import path from 'path';
import { dedent } from 'ts-dedent';
import type { Options } from '../types';

import { getInterpretedFile } from './interpret-files';

export function loadPreviewOrConfigFile({ configDir }: Options) {
  const storybookPreviewPath = getInterpretedFile(path.resolve(configDir, 'preview'));

  if (storybookPreviewPath) {
    throw new Error(dedent`
      You have both a "config.js" and a "preview.js", remove the "config.js" file from your configDir (${path.resolve(
        configDir,
        'config'
      )})`);
  }

  return storybookPreviewPath;
}
