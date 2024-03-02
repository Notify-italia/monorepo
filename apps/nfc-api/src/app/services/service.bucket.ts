import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as Sentry from '@sentry/bun';
import { wLog } from '../../main';
import { declareEnvs } from './service.envs';

const { S3_ACCESS_KEY, S3_SECRET, S3_BUCKET, S3_ENDPOINT } = declareEnvs([
  'S3_ACCESS_KEY',
  'S3_SECRET',
  'S3_BUCKET',
  'S3_ENDPOINT',
]);

//assegno le variabili d'ambiente
const accessKeyId = S3_ACCESS_KEY;
const secretAccessKey = S3_SECRET;
const bucket = S3_BUCKET || '';
const endpoint = S3_ENDPOINT;

//assegno l's3 per savare l'immagine
const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },

  // The transformation for endpoint is not implemented.
  // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
  // Please create/upvote feature request on aws-sdk-js-codemod for endpoint.
  endpoint,
});

export const uploadToBucket = async (config: {
  src: string;
  name: string;
  path: string;
}) => {
  //converto il base64 in buffer, rimuovendo il prefisso
  const Body = Buffer.from(config.src, 'base64');

  //provo fare l'upload nello sapce del file
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `${config.path}/${config.name}`,
    Body,
    ACL: 'public-read',
  });

  const result = await s3.send(command).catch((err) => {
    const message = `Error uploading file: ${JSON.stringify(err)} `;
    wLog(message, 'error');
    Sentry.captureException(message);
  });

  console.log(result);

  return `https://${bucket}.${endpoint}/${config.path}/${config.name}`;
};
