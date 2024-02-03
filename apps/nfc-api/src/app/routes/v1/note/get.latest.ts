import { errorHandledRequest } from 'apps/nfc-api/src/app/services/errors/middlewares/bun.error-handler';
import { Router } from 'express';
import { NoteModel } from '../../../models/model.note';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  errorHandledRequest(
    async (req, res) => {
      const note = await NoteModel.findOne({
        owners: { $in: req.currentUser._id },
      }).sort({ updatedAt: -1 });

      res.send(note || null);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as getLatestNoteRouter };
