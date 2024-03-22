import * as Sentry from '@sentry/bun';
import * as fileType from 'file-type';
import fs from 'fs';
import * as Minio from 'minio';
import { wLog } from '../../main';
import { declareEnvs } from './service.envs';

const { S3_ACCESS_KEY, S3_SECRET, S3_BUCKET, S3_ENDPOINT, S3_SSL } =
  declareEnvs([
    'S3_ACCESS_KEY',
    'S3_SECRET',
    'S3_BUCKET',
    'S3_ENDPOINT',
    'S3_SSL',
  ]);

//assegno le variabili d'ambiente
const accessKey = S3_ACCESS_KEY;
const secretKey = S3_SECRET;
const bucket = S3_BUCKET || '';
const endpoint = S3_ENDPOINT;
const ssl = S3_SSL === 'true';

const _checkConnection = async () => {
  try {
    await s3.bucketExists(bucket);
    console.log('Connected to S3 at', endpoint, 'with bucket', bucket);
  } catch (err) {
    console.error('Error connecting to S3');
    Sentry.captureException(err);
  }
};

//assegno l's3 per savare l'immagine
const s3 = new Minio.Client({
  endPoint: endpoint,
  useSSL: ssl,
  accessKey: accessKey,
  secretKey: secretKey,
});

await _checkConnection();

export const S3Upload = async (config: {
  src: string;
  name: string;
  path: string;
  extension?: string;
}) => {
  if (!config.extension) {
    config.extension = (await getFileType(config.src))?.ext;
  }

  //converto il base64 in buffer, rimuovendo il prefisso
  const Body = await _getBlob(config.src);

  const _localPath = `./tmp/buckets/${bucket}/${config.path}/${config.name}.${config.extension}`;
  const _s3Path = `${bucket}/${config.path}/${config.name}.${config.extension}`;

  await Bun.write(_localPath, Body);

  wLog(
    `Uploading file to ${_s3Path} with size of ${Body.length} bytes`,
    'info'
  );

  try {
    //provo fare l'upload nello sapce del file
    await s3
      .fPutObject(
        bucket,
        `${config.path}/${config.name}.${config.extension}`,
        _localPath
      )
      .catch((err) => {
        const message = `Error uploading file: ${JSON.stringify(err)} `;
        wLog(message, 'error');
        Sentry.captureException(message);
      });
  } catch (err) {
    const message = `Error uploading file: ${JSON.stringify(err)} `;
    wLog(message, 'error');
    Sentry.captureException(message);
  }

  fs.unlinkSync(_localPath);

  return `https://${endpoint}/${_s3Path}`;
};

export const getFileType = async (file: string) => {
  const blob = await fetch(file).then((r) => r.blob());

  return await fileType.fileTypeFromBlob(blob);
};

const _getBlob = async (file: string) => {
  return await fetch(file).then((r) => r.blob());
};
