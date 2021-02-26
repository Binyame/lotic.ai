import { Application } from 'express';
import { pick } from 'lodash';
import { basename, extname } from 'path';
import config from '../../config/config';
import context from '../../graphql/context';
import db from '../../models';
import FileStoreFactory from '../../services/fileStore';
import { AdapterType } from '../../services/fileStore/types';

export const attachStreamVideoRoutes = (app: Application) => {
  let adapter = AdapterType.FS;
  let options = {};

  if (true) {
    adapter = AdapterType.S3;
    options = {
      bucket: config.aws.momentsBucket,
    };
  }

  const fileStore = FileStoreFactory();

  app.head('/assets/patient/:pid/:momentId', async (req, res) => {
    res.setHeader('accept-ranges', 'bytes');
    //MOVE TO HEAD FROM S3;
    res.setHeader('content-length', '');

    res.end();
  });

  app.get('/assets/patient/:pid/:momentId', async (req, res) => {
    const { pid, momentId } = req.params;
    // Need ACL controls here
    // const ctx = context({ req });
    // const patientId = parseInt(pid, 10);

    // if (ctx?.user?.patient?.id !== patientId) {
    //   return res.status(403).json({ error: 'Forbidden' });
    // }
    const uuid = basename(momentId, extname(momentId));

    const _moment = await db.Moment.findOne({
      where: {
        uuid,
      },
    });

    if (_moment) {
      return fileStore
        .send(_moment.uri, req, {
          httpHeaders: (code, headers) => {
            if (code < 300) {
              res.set(
                pick(
                  headers,
                  'accept-ranges',
                  'content-encoding',
                  'content-disposition',
                  'content-range',
                  'content-type',
                  'content-length',
                  'last-modified'
                )
              );
              res.status(code);
            }
          },
          error: (err, request) => {
            request && request.abort();

            // TODO: Figure out the correct way to do this
            // Currently, if you remove this conditional, it
            // crashes the server on every moment upload
            if (err.code !== 'TimeoutError') {
              res.status(404).json({ error: 'Not Found' });
            }
          },
        })
        .pipe(res);
    } else {
      return res.status(404).json({ error: 'Not Found' });
    }
  });
};
