import { Request } from 'express';
import { Readable, Stream } from 'stream';

export enum AdapterType {
  S3 = 's3',
  FS = 'filesystem',
}
export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  stream?: Readable;
};
export type FileURI = string;
export type FileDescriptor = {
  filename: string;
  mimetype: string;
  encoding: string;
  uri: FileURI;
};

export type FileFactoryOptions = { bucket?: string };

export interface IFileStore {
  store(
    fileHandle: Readable,
    fileName: string,
    options?: any
  ): Promise<FileDescriptor>;
  fetch(uri: FileURI, req?: Request, events?: any): Readable;
  destroy(uri: FileURI): Promise<Boolean>;
  send(uri: FileURI, req: Request, events?: any): Stream;
  // getStream(uri: FileURI): Readable;
}
