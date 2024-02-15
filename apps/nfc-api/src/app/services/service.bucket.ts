import * as AWS from 'aws-sdk';
import { wLog } from '../../main';
import { declareEnvs } from './service.envs';

const { DO_ACCESS_KEY, DO_SECRET, DO_SPACE, DO_ENDPOINT } = declareEnvs([
  'DO_ACCESS_KEY',
  'DO_SECRET',
  'DO_SPACE',
  'DO_ENDPOINT',
]);

//assegno le variabili d'ambiente
const accessKeyId = DO_ACCESS_KEY;
const secretAccessKey = DO_SECRET;
const spaceName = DO_SPACE || '';
const endpoint = DO_ENDPOINT;

//assegno l's3 per savare l'immagine
const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  endpoint,
});

const _uploadToBucket = async (src: string, name: string) => {
  //converto il base64 in buffer, rimuovendo il prefisso
  const Body = Buffer.from(src, 'base64');

  try {
    //provo fare l'upload nello sapce del file
    s3.putObject(
      {
        Bucket: spaceName,
        Key: name,
        Body,
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) {
          wLog(`Error uploading file: ${JSON.stringify(err)} `, 'error');
        }

        return data;
      }
    );
  } catch (err) {
    wLog(`Error uploading file: ${JSON.stringify(err)} `, 'error');
  }
};
