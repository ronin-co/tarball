import { buildHeaderRecord, calculateTarballByteLength } from '@/src/utils';
import { zip as gzip } from 'gzip-js';

import type {
  CreateTarballOptions,
  CreateTarballResult,
  Prettify,
  TarballInputFile,
} from '@/src/types';

/**
 * Create a tarball from a list of files
 *
 * @param name - The name of the tarball
 * @param files - The list of files to include in the tarball
 * @param [options] - The options for creating the tarball
 *
 * @returns An object containing the tarball data and file name.
 */
export const createTarball = <
  TName extends string,
  TFiles extends Array<TarballInputFile>,
>(
  name: TName,
  files: TFiles,
  options?: CreateTarballOptions,
): Prettify<CreateTarballResult<TName>> => {
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

    return {
      name,
      data: new Uint8Array(gzipTarball),
    };
  }

  return {
    name,
    data: tarballByteArr,
  };
};
