import { UnknownType } from '@notify/interfaces';
import { declareEnvs } from './service.envs';
import { asyncForEach, asyncReduce } from './service.utils';

//TODO fix
export const extractAssetFiles = async (
  assets: {
    path: string;
    id: string;
    extraction: 'string' | 'buffer';
  }[]
) => {
  const { ASSETS_PATH } = declareEnvs(['ASSETS_PATH']);
  await asyncForEach(assets, async (asset) => {
    const file = Bun.file(`${ASSETS_PATH}/${asset.path}`);

    if (!(await file.exists())) {
      throw new Error(`file not found "${ASSETS_PATH}/${asset.path}"`);
    }
  });

  const files = assets.map((asset) => {
    return {
      file: Bun.file(`${ASSETS_PATH}/${asset.path}`),
      ...asset,
    };
  });

  console.log(`Pulling assets: ${files.map(({ id }) => id).join(', ')}`);

  return (await asyncReduce(
    files,
    async (acc, { id, file, extraction }) => {
      switch (extraction) {
        case 'string':
          acc[id] = await file.text();
          break;
        case 'buffer':
          const buffer = await file.arrayBuffer();
          acc[id] = buffer;
          break;
      }

      return acc;
    },
    {} as UnknownType
  )) as {
    [key: string]: Buffer | string;
  };
};
