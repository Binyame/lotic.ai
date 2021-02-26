import {
  FileDescriptor,
  FileFactoryOptions,
  FileURI,
  IFileStore,
} from '../types';
import AWS from 'aws-sdk';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import { extname, basename } from 'path';
import { lookup, extension } from 'mime-types';
import { Request } from 'express';
import { GetObjectRequest } from 'aws-sdk/clients/s3';

class S3FileStore implements IFileStore {
  private s3: AWS.S3;
  private bucket: string;

  constructor(options: FileFactoryOptions) {
    this.bucket = String(options.bucket);
    this.s3 = new AWS.S3();
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
    options: { [key: string]: any } = {}
  ): Promise<FileDescriptor> {
    const targetFileName = this.createFilename(fileName, options);
    const mimetype = this.getMimeType(fileName, options);

    var params = {
      Body: fileHandle,
      Bucket: this.bucket,
      Key: targetFileName,
      ContentType: mimetype,
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve({
          filename: targetFileName,
          mimetype,
          encoding: options?.encoding || 'utf8',
          uri: `s3://${targetFileName}`,
        });
      });
    });
  }

  fetch(uri: FileURI, req: Request, events: any): any {
    // return this.fetch(uri);
    uri = uri.replace('s3://', '');
    const options = {
      start: 0,
      end: 0,
    };

    let start;
    let end;

    const range = req?.headers?.range;
    if (range) {
      const bytesPrefix = 'bytes=';
      if (range.startsWith(bytesPrefix)) {
        const bytesRange = range.substring(bytesPrefix.length);
        const parts = bytesRange.split('-');
        if (parts.length === 2) {
          const rangeStart = parts[0] && parts[0].trim();
          if (rangeStart && rangeStart.length > 0) {
            options.start = start = parseInt(rangeStart);
          }
          const rangeEnd = parts[1] && parts[1].trim();
          if (rangeEnd && rangeEnd.length > 0) {
            options.end = end = parseInt(rangeEnd);
          }
        }
      }
    }

    const params: GetObjectRequest = {
      Bucket: this.bucket,
      Key: uri,
      Range: range,
    };

    const request = this.s3.getObject(params);

    return request
      .on('httpHeaders', events.httpHeaders || (() => {}))
      .createReadStream()
      .on('error', (err) => {
        events.error && events.error(err, request);
      });
  }

  send(uri: FileURI, req: Request, events: any): any {
    return this.fetch(uri, req, events);
  }

  async destroy(uri: FileURI): Promise<Boolean> {
    throw new Error('Destroy not currently supported in S3 Adapter');
  }
}

export default S3FileStore;
