import { describe, expect, test } from 'bun:test';

import { createTarball } from '@/src/index';

/**
 * Get the integrity hash of a given data
 *
 * @param data - A Uint8Array containing the data to hash
 * @param algorithm - The algorithm to use for hashing (Default: `'SHA-512'`)
 *
 * @returns A promise that resolves to the integrity hash string of the provided data
 */
const getIntegrityHash = async (
  data: Uint8Array,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-512',
): Promise<string> => {
  const digest = await crypto.subtle.digest(algorithm, data);
  const digestByteArr = new Uint8Array(digest);
  const hash = btoa(String.fromCharCode(...digestByteArr));
  return `${algorithm.toLowerCase().replace('-', '')}-${hash}`;
};

// Note: All tarballs created for these tests require a fixed timestamp to ensure
// the integrity hash remains consistent across test runs.
const CREATED_AT_TIMESTAMP = new Date('2025-01-01T00:00:00.000Z').getTime();

const encoder = new TextEncoder();

describe('create', () => {
  test('a basic tarball', async () => {
    const tarball = createTarball(
      [
        {
          name: 'hello-world.txt',
          contents: encoder.encode('Hello, world!'),
        },
      ],
      {
        name: 'basic.tar.gz',
        timestamp: CREATED_AT_TIMESTAMP,
      },
    );
    expect(tarball.name).toStrictEqual('basic.tar.gz');

    const tarballHash = await getIntegrityHash(tarball.data);
    expect(tarballHash).toMatchSnapshot();
  });

  test('a basic npm package', async () => {
    const tarball = createTarball(
      [
        {
          name: 'package/package.json',
          contents: encoder.encode(
            JSON.stringify({
              private: true,
              name: '@ronin/example',
              version: '0.0.0',
              main: 'index.js',
              types: 'index.d.ts',
            }),
          ),
        },
        {
          name: 'package/index.js',
          contents: encoder.encode('export const add = (a, b) => a + b;'),
        },
        {
          name: 'package/index.d.ts',
          contents: encoder.encode(
            `declare const add: (a: number, b: number) => number;
            export { add };`,
          ),
        },
      ],
      {
        name: 'package.tar.gz',
        timestamp: CREATED_AT_TIMESTAMP,
      },
    );
    expect(tarball.name).toStrictEqual('package.tar.gz');

    const tarballHash = await getIntegrityHash(tarball.data);
    expect(tarballHash).toMatchSnapshot();
  });

  test('an empty tarball', async () => {
    const tarball = createTarball([], {
      name: 'empty.tar.gz',
      timestamp: CREATED_AT_TIMESTAMP,
    });
    expect(tarball.name).toStrictEqual('empty.tar.gz');

    const tarballHash = await getIntegrityHash(tarball.data);
    expect(tarballHash).toMatchSnapshot();
  });

  test('an uncompressed tarball', async () => {
    const tarball = createTarball([], {
      compress: false,
      name: 'uncompressed.tar',
      timestamp: CREATED_AT_TIMESTAMP,
    });
    expect(tarball.name).toStrictEqual('uncompressed.tar');

    const tarballHash = await getIntegrityHash(tarball.data);
    expect(tarballHash).toMatchSnapshot();
  });
});
