import * as Sentry from '@sentry/bun';
import * as fileType from 'file-type';
import fs from 'fs';
import * as Minio from 'minio';
import { mLog } from '../services';
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
  if (_filenameHasExtension(config.name) && !config.extension) {
    config.extension = config.name.split('.').pop();
  } else {
    //se non è stato fornito un'estensione, provo a prenderla dal file
    config.extension = (await getFileType(config.src))?.ext;
  }
  //rimuovo l'estensione dal nome del file
  config.name = _removeFilenameExtension(config.name);

  //assegno il nome del file, composto da nome e estensione
  const name = `${config.name}.${config.extension}`;

  //converto il base64 in buffer, rimuovendo il prefisso
  const Body = await _getBlob(config.src);

  const _localPath = `./tmp/buckets/${bucket}/${config.path}/${config.name}.${config.extension}`;

  //_s3Path è il path del file su s3
  const _s3Path = `${config.path}/${name}`;
  //s3Path è il path completo del file su s3, comprensivo del bucket
  const s3Path = `${bucket}/${_s3Path}`;

  await Bun.write(_localPath, Body);

  mLog(`Uploading file to ${s3Path} with size of ${Body.length} bytes`, 'info');

  try {
    //provo fare l'upload nello sapce del file
    await s3.fPutObject(bucket, _s3Path, _localPath).catch((err) => {
      const message = `Error uploading file: ${JSON.stringify(err)} `;
      mLog(message, 'error');
      Sentry.captureException(message);
    });
  } catch (err) {
    const message = `Error uploading file: ${JSON.stringify(err)} `;
    mLog(message, 'error');
    Sentry.captureException(message);
  }

  fs.unlinkSync(_localPath);

  return `https://${endpoint}/${s3Path}`;
};

export const S3Delete = async (config: { path: string; name: string }) => {
  try {
    mLog(`Deleting file at ${config.path}/${config.name}`, 'warning');

    await s3.removeObject(bucket, `${config.path}/${config.name}`, {
      forceDelete: true,
    });
    return `https://${endpoint}/${config.path}/${config.name}`;
  } catch (err) {
    const message = `Error deleting file: ${JSON.stringify(err)} `;
    mLog(message, 'error');
    Sentry.captureException(message);
  }
};

export const getFileType = async (file: string) => {
  const blob = await fetch(file).then((r) => r.blob());

  return await fileType.fileTypeFromBlob(blob);
};

export const getPathFromUrl = (url: string) => {
  const path = url.replace(`https://${endpoint}/${bucket}`, '');

  return path.split('/').slice(0, -1).join('/');
};

const _removeFilenameExtension = (filename: string) => {
  if (!filename.includes('.')) {
    return filename;
  }

  return filename.split('.').slice(0, -1).join('.');
};

const _getBlob = async (file: string) => {
  return await fetch(file).then((r) => r.blob());
};

const _filenameHasExtension = (filename: string) => {
  return filename.split('.').length > 1;
};
