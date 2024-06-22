import { createGPT, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('url').isURL().withMessage('URL non valido'),
  requestHandler(
    async (req, res) => {
      const { url } = req.body;

      const response = await createGPT({
        model: 'gpt-4o',
        max_tokens: 1250,
        messages: [
          {
            role: 'system',
            content: `Analizza l'immagine fornita per estrarre i dati di un biglietto da visita. Se l'immagine non contiene un biglietto da visita valido, restituisci {\"invalid\": true}. Se l'immagine contiene un biglietto da visita valido, estrai i seguenti campi e restituiscili in formato JSON, inserendo una stringa vuota per i campi mancanti: {\"name\": \"<name>\", \"surname\": \"<surname>\", \"company\": \"<company>\", \"address\": \"<address>\", \"phoneNumbers\": [\"<phone1>\", \"<phone2>\"], \"emails\": [\"<email1>\", \"<email2>\"], \"socials\": [{\"type\": \"<type>\", \"url\": \"<url>\"}]}`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url,
                  detail: 'high',
                },
              },
            ],
          },
        ],
      });

      res.send(
        response.choices[0].message.content as {
          invalid?: boolean;
          name?: string;
          surname?: string;
          company?: string;
          address?: string;
          phoneNumbers?: string[];
          emails?: string[];
          socials?: { type: string; url: string }[];
        }
      );
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postBusinesscardDataRouter };
