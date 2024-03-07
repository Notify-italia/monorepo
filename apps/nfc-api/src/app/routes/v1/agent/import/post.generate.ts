import { EnumNotifyUserType } from '@notify/interfaces';
import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { ImportManager } from 'apps/nfc-api/src/app/services/users/service.import';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  //TODO validazione
  errorHandledRequest(
    async (req: Request<{ email: string; password: string }>, res) => {
      const generatedAgents = await ImportManager.generate({
        ...req.body,
        parent: req.currentUser._id,
      });

      await generatedAgents.createDocuments();

      res.status(201).json(generatedAgents.instance);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
      permittedRoles: [EnumNotifyUserType.Company],
    }
  )
);

export { router as postGenerateAgentsRouter };
