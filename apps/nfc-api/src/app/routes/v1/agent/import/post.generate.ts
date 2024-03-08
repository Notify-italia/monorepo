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
      if (req.body.CSV?.data?.length) {
        //base64 to arraybuffer
        req.body.CSV.path = await writeToTempFile(
          req.body.CSV.data,
          req.currentUser._id
        );
      }

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

const writeToTempFile = async (base64: string, currentUser: string) => {
  const path = `./temp/${currentUser}.csv`;
  const parsed = Buffer.from(base64, 'base64').toString('utf-8');
  await Bun.write(path, parsed, {
    createPath: true,
  });

  return path;
};
