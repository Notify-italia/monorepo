import { INotifyLead } from '@notify/interfaces';
import {
  BadRequestError,
  createGPT,
  requestHandler,
} from '@notify/nfc-api-core';
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
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `Analizza l'immagine fornita per estrarre i dati di un biglietto da visita. Se l'immagine non contiene un biglietto da visita valido, restituisci {\"invalid\": true}. Se l'immagine contiene un biglietto da visita valido, estrai i seguenti campi e restituiscili in formato JSON, inserendo una stringa vuota per i campi mancanti: {\"name\": \"<name>\", \"surname\": \"<surname>\", \"company\": \"<company>\", \"role\": \"<role>\", \"address\": \"<address>\", \"phoneNumbers\": [\"<phone1>\", \"<phone2>\"], \"emails\": [\"<email1>\", \"<email2>\"], \"socials\": [{\"name\": \"<name>\", \"url\": \"<url>\"}]}. Inoltre, se trovi un sito web, inseriscilo in \"socials\" con tipo \"website\". Includi dati a penna se presenti. Ignora eventuali partite IVA. Restituisci solo il JSON risultante, senza altri testi.`,
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

      console.log(`response`, response);

      const content = JSON.parse(
        response.choices[0].message.content?.replaceAll('```', '') ||
          '{"invalid": true}'
      ) as {
        invalid?: boolean;
      } & INotifyLead;

      if (content.invalid) {
        throw new BadRequestError('Immagine non valida');
      }

      content.emails = (content.emails || [])?.filter((v) => v?.length);
      content.phoneNumbers = (content.phoneNumbers || [])
        .filter((v) => v?.length)
        .map((v) => v.replace(/\D/g, ''));

      content.socials = (content.socials || [])
        .filter((v) => v.url?.length)
        .map((v) => ({
          name: v.name?.toLowerCase(),
          url: _normalizeUrl(v.url),
        }));

      if ((content as any)?.website) {
        content.socials.push({
          name: 'website',
          url: _normalizeUrl((content as any).website),
        });
      }

      console.log(`scan result`, content);

      res.send(content);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postBusinesscardDataRouter };

const _normalizeUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `https://${url}`;
};
