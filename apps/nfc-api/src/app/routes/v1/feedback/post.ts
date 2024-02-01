import { Router } from 'express';
import { body } from 'express-validator';
import { AgentModel } from '../../../models/model.agent';
import {
  FEEDBACK_VALIDATION_MESSAGES,
  FeedbackModel,
} from '../../../models/model.feedback';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';

const router = Router();

router.post(
  '/',
  body('owner')
    .isMongoId()
    .withMessage(FEEDBACK_VALIDATION_MESSAGES.owner as string),
  body('rating')
    .isNumeric()
    .withMessage(FEEDBACK_VALIDATION_MESSAGES.rating as string),
  body('comment')
    .optional()
    .isString()
    .withMessage(FEEDBACK_VALIDATION_MESSAGES.comment as string),
  errorHandledRequest(async (req, res) => {
    const { owner, rating, comment } = req.body;

    const feedback = FeedbackModel.build({
      owner,
      rating,
      comment,
    });

    await feedback.save();

    await AgentModel.findOne({ _id: owner }).then((agent) => {
      if (!agent) {
        return;
      }
      agent.statsTotals['profile:feedback:count'] += 1;
      agent.statsTotals['profile:feedback:average'] =
        (rating + agent.statsTotals['profile:feedback:average']) /
        agent.statsTotals['profile:feedback:count'];

      agent.markModified('statsTotals');

      agent.save();
    });

    res.status(201).send(feedback.toObject());
  })
);

export { router as postFeedbackRouter };
