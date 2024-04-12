import { EnumNotifyUserType } from '@notify/interfaces';
import { ImportManager, requestHandler } from '@notify/nfc-api-core';
import { Request, Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('instanceId')
    .isString()
    .withMessage(`Errore nell'importazione degli agenti`),
  body('sendEmails')
    .isBoolean()
    .withMessage(`Errore nell'importazione degli agenti`),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const importInstance = ImportManager.load(req.body.instanceId);

      await importInstance.processDocuments(
        req.currentUser,
        req.body.sendEmails
      );

      res.status(201).json({
        status: 'ok',
        length: importInstance.documents.length,
        passwords: importInstance.plainTextPasswords,
      });
    },
    {
      requireAuth: {
        requireLicense: true,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as postConfirmAgentsImportRouter };
