import type { TarballInputFile } from '@/src/types';

/**
 * Build the header record for the provided file.
 *
 * @param file - The file to build the header record for.
 *
 * @returns The header record for the provided file.
 */
export const buildHeaderRecord = <T extends TarballInputFile>(file: T): Uint8Array => {
  const lastModifiedAt = file.lastModifiedAt ?? new Date(0);

  const header = new Uint8Array(512);

  const entries = [
    // File name (100 bytes)
    stringToPaddedUint8Array(file.name, 100),
    // File mode (8 bytes)
    stringToZeroFilledUint8Array('644', 8),
    // Owner's numeric user ID (8 bytes)
    stringToZeroFilledUint8Array('0', 8),
    // Group's numeric user ID (8 bytes)
    stringToZeroFilledUint8Array('0', 8),
    // File size in bytes (octal base) (12 bytes)
    stringToZeroFilledUint8Array(file.contents.byteLength.toString(8), 12),
    // Last modification time in numeric Unix time format (octal) (12 bytes)
    stringToZeroFilledUint8Array(
      Math.floor(lastModifiedAt.valueOf() / 1000).toString(8),
      12,
    ),
    // Check sum for header record (8 bytes)
    stringToZeroFilledUint8Array('        ', 8),
    // Link indicator (file type) (1 byte)
    stringToZeroFilledUint8Array('0', 1),
    // Name of linked file (100 bytes)
    stringToPaddedUint8Array('', 100),
    // USTAR indicator "ustar" then NUL (6 bytes)
    stringToPaddedUint8Array('ustar', 6),
    // USTAR version "00" (2 bytes)
    stringToUint8Array('00'),
    // Owner user name (32 bytes)
    stringToPaddedUint8Array('parsable', 32),
    // Owner group name (32 bytes)
    stringToPaddedUint8Array('parsable', 32),
    // Device major number (8 bytes)
    stringToPaddedUint8Array('0', 8),
    // Device minor number (8 bytes)
    stringToPaddedUint8Array('0', 8),
    // Filename prefix (155 bytes)
    stringToPaddedUint8Array('', 155),
  ] satisfies Array<Uint8Array<ArrayBufferLike>>;

  let currentOffset = 0;
  for (const entry of entries) {
    header.set(entry, currentOffset);
    currentOffset += entry.byteLength;
  }

  const checksum = Uint8Array.of(
    ...stringToZeroFilledUint8Array(
      entries
        .reduce((sum, entry) => entry.reduce((subSum, value) => subSum + value, sum), 0)
        .toString(8),
      6,
    ),
    0,
    32,
  );

  header.set(checksum, 148);

  return header;
};

/**
 * Calculate the byte length of the tarball based on the provided files.
 *
 * @param files - The files to include in the tarball.
 *
 * @returns The byte length of the tarball.
 */
export const calculateTarballByteLength = <T extends TarballInputFile>(
  files: Array<T>,
): number => {
  // Data (rounded up to a multiple of 512 bytes) & 512-byte header
  const length = files.reduce(
    (acc, file) => acc + Math.ceil(file.contents.byteLength / 512) * 512 + 512,
    0,
  );

  return (
    length + 1024 // 1024-byte blank records in the tail
  );
};

/**
 * Convert a string to an array of 8-bit unsigned integers.
 *
 * @param value - The string to convert.
 *
 * @returns An array of 8-bit unsigned integers with the provided string.
 */
export const stringToUint8Array = (value: string): Uint8Array => {
  return Uint8Array.from(value.split('').map((x) => x.charCodeAt(0)));
};

/**
 * Convert a string to an array of 8-bit unsigned integers with a fixed length and zero-filled.
 *
 * @param value - The string to convert.
 * @param byteLength - The length of the resulting byte array.
 *
 * @returns An array of 8-bit unsigned integers with the provided string and zero-filled.
 */
export const stringToZeroFilledUint8Array = (
  value: string,
  byteLength: number = value.length,
): Uint8Array => {
  const view = new Uint8Array(byteLength).fill(48, 0, byteLength);
  view.set(stringToUint8Array(value), byteLength - value.length);
  return view;
};

/**
 * Convert a string to an array of 8-bit unsigned integers with a fixed length & padded.
 *
 * @param string - The string to convert.
 * @param byteLength - The length of the resulting byte array.
 *
 * @returns An array of 8-bit unsigned integers with the provided string & padded.
 */
export const stringToPaddedUint8Array = (
  string: string,
  byteLength: number,
): Uint8Array => {
  const view = new Uint8Array(byteLength);
  view.set(stringToUint8Array(string));
  return view;
};
