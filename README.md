# RONIN Tarball

[![tests](https://img.shields.io/github/actions/workflow/status/ronin-co/tarball/validate.yml?label=tests)](https://github.com/ronin-co/tarball/actions/workflows/validate.yml)
[![code coverage](https://img.shields.io/codecov/c/github/ronin-co/tarball)](https://codecov.io/github/ronin-co/tarball)
[![install size](https://packagephobia.com/badge?p=@ronin/tarball)](https://packagephobia.com/result?p=@ronin/tarball)

This package generates a tarball file in-memory, with the ability to compress it using gzip.

## Usage
```typescript
import { createTarball } from '@ronin/tarball';

const files = [
  {
    name: 'hello.txt',
    contents: new Uint8Array(new TextEncoder().encode('Hello World')),
  },
];

const tarball = createTarball('archive.tar.gz', files);
//       ^? { name: 'archive.tar.gz', contents: Uint8Array<ArrayBuffer> }
```

## Testing

Use the following command to run the test suite:

```
bun test
```
