import { FileDescriptor, FileURI, IFileStore } from '../types';
import { Readable, Stream } from 'stream';
import { resolve } from 'path';
import { v4 } from 'uuid';
import { tmpdir } from 'os';
import { extname, basename } from 'path';
import { isArrayBuffer, isString } from 'lodash';
import send from 'send';
import {
  createReadStream,
  createWriteStream,
  unlink,
  ensureDirSync,
} from 'fs-extra';
import { lookup, extension } from 'mime-types';
import { Request } from 'express';
import { pathToArray } from 'graphql/jsutils/Path';

class LocalFileStore implements IFileStore {
  private localDir = resolve(tmpdir(), 'lotic-firestore');

  constructor(options) {
    ensureDirSync(this.localDir);
  }

  resolveUri(uri: FileURI): string {
    return resolve(this.localDir, uri);
  }

  getMimeType(fileName, options) {
    let mimetype = options.mimetype
      ? options.mimetype
      : lookup(fileName) || 'hex/octet-stream';
    return mimetype;
  }

  createFilename(fileName, options) {
    const fileKey = v4();

    const transformedFileName = `${fileKey}-${fileName}`;
    const mimetype = this.getMimeType(fileName, options);

    const filename = extname(transformedFileName)
      ? transformedFileName
      : `${basename(transformedFileName)}.${extension(mimetype)}`;

    return filename;
  }

  async store(
    fileHandle: Readable,
    fileName: string,
    options: any = {}
  ): Promise<FileDescriptor> {
    const filename = this.createFilename(fileName, options);

    const fileLocation = this.resolveUri(filename);
    const writeStream = fileHandle.pipe(createWriteStream(`${fileLocation}`));

    return new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    }).then(() => {
      const _r = {
        filename,
        mimetype: this.getMimeType(fileName, options),
        encoding: 'utf8',
        uri: filename,
      };
      return _r;
    });
  }

  fetch(uri: FileURI): Readable {
    const fileLocation = this.resolveUri(uri);
    return createReadStream(fileLocation, {
      autoClose: true,
    });
  }

  send(uri: FileURI, req: Request): Stream {
    const fileLocation = this.resolveUri(`${uri}`);
    return send(req, fileLocation);
  }

  async destroy(uri: FileURI): Promise<Boolean> {
    const fileLocation = this.resolveUri(uri);
    return new Promise((resolve, reject) => {
      unlink(fileLocation, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }
}

export default LocalFileStore;
