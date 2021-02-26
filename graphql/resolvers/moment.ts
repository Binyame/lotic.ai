import { merge } from 'lodash';
import { generateResolvers } from '../resolver';
import { extname, basename } from 'path';
import { lookup, extension } from 'mime-types';
import { v4 } from 'uuid';
import AWS from 'aws-sdk';
import config from '../../config/config';

const s3 = new AWS.S3();
async function getSignedUrl({ uri, mimeType }) {
  return s3.getSignedUrl('putObject', {
    Bucket: config.aws.momentsBucket,
    Key: uri,
    Expires: 60 * 20, //seconds
    ContentType: mimeType,
  });
}

function getMimeType(fileName, options) {
  let mimeType = options.mimeType
    ? options.mimeType
    : lookup(fileName) || 'hex/octet-stream';

  return mimeType;
}

function createFilename(fileName, options) {
  const fileKey = v4();

  const transformedFileName = `${fileKey}-${fileName}`;
  const mimeType = getMimeType(fileName, options);

  const filename = extname(transformedFileName)
    ? transformedFileName
    : `${basename(transformedFileName)}.${extension(mimeType)}`;

  return filename;
}

const baseResolvers = generateResolvers('Moment', [
  'patient',
  'assessment',
  'momentPrompts',
]);

export default merge(baseResolvers, {
  Mutation: {
    createMoment: async (_, args, ctx) => {
      const patientId = ctx?.user?.patient?.id;
      const { moment } = args;
      const { fileName, mimeType, assessmentId } = moment;

      const uri = createFilename(fileName, {
        mimeType,
      });

      const record = await ctx.db.Moment.create({
        ...moment,
        mimeType: getMimeType(fileName, { mimeType }),
        uri,
      });

      const signedUrl = await getSignedUrl(record);

      const cleanRecord = {
        ...record.toJSON(),
        signedUrl,
      };

      const assessment = await ctx.db.Assessment.findByPk(assessmentId);

      if (!assessment || assessment.permanent) {
        return cleanRecord;
      }

      const pa = await ctx.db.PatientAssessment.findOne({
        where: {
          assessmentId,
          patientId,
          completed: false,
        },
      });

      if (pa) {
        await pa.update({ completed: true });
      }

      return cleanRecord;
    },
  },
});
