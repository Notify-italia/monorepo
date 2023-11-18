import { Router } from 'express';
import { body } from 'express-validator';
import {
  FEEDBACK_VALIDATION_MESSAGES,
  FeedbackModel,
} from '../../../models/model.feedback';
import { errorHandledRequest } from '../../../services/errors/middlewares/bun.error-handler';

const router = Router();

router.patch(
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

    res.status(201).send(feedback.toObject());
  })
);

export { router as postFeedbackRouter };
