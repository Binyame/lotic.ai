import _ from 'lodash';
import Stream from 'readable-stream';
import util from 'util';

class S3ReadStream {
  public _offset: any;
  public _contentLength: any;
  public _headersSent: any;
  public _waiting: any;
  public _more: any;
  public options: any;
  public client: any;
  public req: any;
  public stream: any;
  public emit: any;
  public push: any;
  public read: any;
  public once: any;

  constructor(client, options, streamOptions?) {
    if (this instanceof S3ReadStream === false) {
      return new S3ReadStream(client, options, streamOptions);
    }
    if (!client || !_.isFunction(client.getObject)) {
      throw new TypeError();
    }
    if (!_.has(options, 'Bucket')) {
      throw new TypeError();
    }
    if (!_.has(options, 'Key')) {
      throw new TypeError();
    }
    Stream.Readable.call(
      this,
      _.assign({ highWaterMark: 4194304 }, streamOptions)
    );
    this._offset = 0;
    this._contentLength = 0;
    this._headersSent = false;
    this._waiting = false;
    this._more = 0;
    this.options = options;
    this.client = client;
  }
  request() {
    if (this.req) {
      return this.stream;
    }
    const self = this;
    this.req = this.client.getObject(_.assign({}, this.options));
    this.stream = this.req
      .on('httpHeaders', (statusCode, headers) => {
        // Broadcast any errors.
        if (statusCode >= 300) {
          console.log('HERE', statusCode);
          self.emit('error', { statusCode: statusCode });
          return;
        }
        // Update local info.
        self._contentLength = parseInt(headers['content-length'], 10);
        // Only send headers once.
        if (self._headersSent) {
          return;
        }
        self._headersSent = true;
        // Mimic an AWS S3 object.
        self.emit('open', {
          ContentLength: self._contentLength,
          ContentType: headers['content-type'],
          Bucket: self.options.Bucket,
          Key: self.options.Key,
          Body: self,
        });
      })
      .createReadStream()
      .on('end', () => {
        if (!self._headersSent) {
          return self.emit('error', { type: 'NO_HEADERS' });
        }
        self.push(null);
      })
      .on('error', (err) => {
        console.log('ERROR', err);
        self.emit('error', err);
      })
      .on('readable', () => {
        let chunk;
        while (null !== (chunk = this.read(self._more)) && self._more) {
          self._more -= chunk.length;
          self.push(chunk);
        }
      });
    return this.stream;
  }
  pipe(target, options) {
    options = _.assign(
      {
        smart: true,
      },
      options
    );
    if (options.smart && _.has(target, 'setHeader')) {
      this.once('open', (file) => {
        target.setHeader('Content-Type', file.ContentType);
        target.setHeader('Content-Length', file.ContentLength);
      });
    }
    return Stream.Readable.prototype.pipe.apply(this, arguments);
  }
  _read(size) {
    this._more += size;
    this.request();
  }
}
util.inherits(S3ReadStream, Stream.Readable);

export default S3ReadStream;
