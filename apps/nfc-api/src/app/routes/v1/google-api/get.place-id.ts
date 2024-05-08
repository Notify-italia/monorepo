import {
  BadRequestError,
  declareEnvs,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

const { GOOGLE_API_KEY } = declareEnvs(['GOOGLE_API_KEY']);

interface IGooglePlaceResponse {
  places: PlacesItem[];
}
interface PlacesItem {
  id: string;
  formattedAddress: string;
  displayName: DisplayName;
}
interface DisplayName {
  text: string;
  languageCode: string;
}

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('place').isString().withMessage('Lugo non valido'),
  requestHandler(
    async (req, res) => {
      const { place } = req.query;

      const response = await fetch(
        'https://places.googleapis.com/v1/places:searchText',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress',
          },
          body: JSON.stringify({
            textQuery: place,
          }),
        }
      ).catch((err) => {
        console.log('error', err);
        throw new BadRequestError(err.message);
      });

      const data: IGooglePlaceResponse = await response.json();

      if (!data?.places?.length) {
        throw new BadRequestError('Nessun risultato trovato');
      }

      res.send({ result: data.places[0].id });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getGooglePlaceIdRouter };
