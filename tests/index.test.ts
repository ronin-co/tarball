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

describe('create', () => {
  test('a basic tarball', async () => {
    const tarball = createTarball(
      'basic.tar.gz',
      [
        {
          name: 'hello-world.txt',
          contents: new Uint8Array(Buffer.from('Hello, world!', 'utf-8')),
        },
      ],
      {
        timestamp: CREATED_AT_TIMESTAMP,
      },
    );
    const tarballHash = await getIntegrityHash(tarball);

    expect(tarballHash).toMatchSnapshot();
  });

  test('an empty tarball', async () => {
    const tarball = createTarball('empty.tar.gz', [], {
      timestamp: CREATED_AT_TIMESTAMP,
    });
    const tarballHash = await getIntegrityHash(tarball);

    expect(tarballHash).toMatchSnapshot();
  });

  test('an uncompressed tarball', async () => {
    const tarball = createTarball('basic.tar.gz', [], {
      compress: false,
      timestamp: CREATED_AT_TIMESTAMP,
    });
    const tarballHash = await getIntegrityHash(tarball);

    expect(tarballHash).toMatchSnapshot();
  });
});
