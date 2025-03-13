import { buildHeaderRecord, calculateTarballByteLength } from '@/src/utils';
import { zip as gzip } from 'gzip-js';

import type { CreateTarballOptions, TarballInputFile } from '@/src/types';

export type { TarballInputFile } from '@/src/types';

/**
 * Create a tarball from a list of files
 *
 * @param name - The name of the tarball
 * @param files - The list of files to include in the tarball
 * @param [options] - The options for creating the tarball
 *
 * @returns The tarball as a Uint8Array
 */
export const createTarball = <T extends Array<TarballInputFile>>(
  name: string,
  files: T,
  options?: CreateTarballOptions,
): Uint8Array<ArrayBuffer> => {
  const { compress = true, timestamp } = options ?? {};

  const tarballByteLength = calculateTarballByteLength(files);
  const tarballByteArr = new Uint8Array(tarballByteLength);

  let offset = 0;
  for (const file of files) {
    tarballByteArr.set(buildHeaderRecord(file), offset);
    tarballByteArr.set(new Uint8Array(file.contents), offset + 512);

    offset += Math.ceil(file.contents.byteLength / 512) * 512 + 512;
  }

  if (compress) {
    const gzipTarball = gzip(tarballByteArr, {
      name,
      timestamp,
    });
    return new Uint8Array(gzipTarball);
  }

  return tarballByteArr;
};
