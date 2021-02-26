import s3Adapter from './adapters/s3';
import localAdapter from './adapters/filesystem';
import { AdapterType, FileFactoryOptions, IFileStore } from './types';
import config from '../../config/config';

const factory = (
  options?: FileFactoryOptions,
  adapter?: AdapterType
): IFileStore => {
  if (!adapter) {
    const useLocal = !!(
      !config.aws.momentsBucket || process.env['FORCE_LOCAL']
    );
    adapter = useLocal ? AdapterType.FS : AdapterType.S3;
  }

  if (!options) {
    options = {
      bucket: String(config.aws.momentsBucket),
    };
  }

  switch (adapter) {
    case AdapterType.S3:
      return new s3Adapter(options);
    case AdapterType.FS:
      return new localAdapter(options);
    default:
      throw new Error('Unknown Adapter Type');
  }
};

export default factory;
