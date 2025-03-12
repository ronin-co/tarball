export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export interface TarballInputFile {
  /**
   * The contents of the file.
   */
  contents: Uint8Array;

  /**
   * The name of the file to be included in the tarball.
   */
  name: string;

  /**
   * The date at which the file was last modified.
   *
   * @default new Date(0)
   */
  lastModifiedAt?: Date;
}

export interface CreateTarballOptions {
  /**
   * Whether to compress the tarball using gzip or not
   *
   * @default true
   */
  compress?: boolean;

  /**
   * The timestamp at which the tarball was created.
   *
   * This is required when using gzip compression as without it the integrity
   * hash will change every time.
   *
   * The default value is the package version timestamp.
   */
  timestamp: number;
}

export interface CreateTarballResult<TName extends string> {
  /**
   * The tarball data as a Uint8Array.
   */
  data: Uint8Array<ArrayBuffer>;

  /**
   * The name of the tarball.
   */
  name: TName;
}
