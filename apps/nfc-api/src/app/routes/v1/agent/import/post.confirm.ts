import { EnumNotifyUserType } from '@notify/interfaces';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { ImportManager } from 'apps/nfc-api/src/app/services/users/service.import';
import { Request, Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('instanceId')
    .isString()
    .withMessage(`Errore nell'importazione degli agenti`),
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const importInstance = ImportManager.load(req.body.instanceId);

      await importInstance.confirm(req.currentUser);

      res.status(201).json({
        status: 'ok',
        length: importInstance.documents.length,
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
