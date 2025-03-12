import { describe, expect, test } from 'bun:test';

import {
  buildHeaderRecord,
  calculateTarballByteLength,
  stringToPaddedUint8Array,
  stringToUint8Array,
  stringToZeroFilledUint8Array,
} from '@/src/utils';

import type { TarballInputFile } from '@/src/types';

const EXAMPLE_FILE = {
  name: 'hello-world.txt',
  contents: new Uint8Array(Buffer.from('Hello, world!', 'utf-8')),
} satisfies TarballInputFile;

describe('utils', () => {
  describe('build header record', () => {
    test('with a basic file', () => {
      const record = buildHeaderRecord(EXAMPLE_FILE);

      expect(record).toMatchSnapshot();
    });

    test('with an empty file', () => {
      const record = buildHeaderRecord({
        name: 'empty.txt',
        contents: new Uint8Array(),
      });

      expect(record).toMatchSnapshot();
    });
  });

  describe('calculate tarball byte length', () => {
    test('for a basic file', () => {
      const length = calculateTarballByteLength([EXAMPLE_FILE]);
      expect(length).toStrictEqual(2048);
    });

    test('for an empty array', () => {
      const length = calculateTarballByteLength([]);
      expect(length).toStrictEqual(1024);
    });
  });

  describe('`string` to `Uint8Array`', () => {
    test('for a basic string', () => {
      const data = stringToUint8Array('Hello World');
      expect(data).toMatchSnapshot();
    });

    test('for an empty string', () => {
      const data = stringToUint8Array('');
      expect(data).toMatchSnapshot();
    });
  });

  describe('`string` to zero filled `Uint8Array`', () => {
    test('for a basic string', () => {
      const data = stringToZeroFilledUint8Array('Hello World');
      expect(data).toMatchSnapshot();
    });

    test('for an empty string', () => {
      const data = stringToZeroFilledUint8Array('');
      expect(data).toMatchSnapshot();
    });
  });

  describe('`string` to padded `Uint8Array`', () => {
    test('for a basic string', () => {
      const data = stringToPaddedUint8Array('Hello World', 100);
      expect(data).toMatchSnapshot();
    });

    test('for an empty string', () => {
      const data = stringToPaddedUint8Array('', 100);
      expect(data).toMatchSnapshot();
    });
  });
});
