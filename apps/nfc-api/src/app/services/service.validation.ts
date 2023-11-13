import { body } from 'express-validator';
import { AGENT_VALIDATION_MESSAGES } from '../models/model.agent';
import { COMPANY_VALIDATION_MESSAGES } from '../models/model.company';

export const userSignInValidation = (
  messagesProvider:
    | typeof COMPANY_VALIDATION_MESSAGES
    | typeof AGENT_VALIDATION_MESSAGES
) => {
  return [
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage(messagesProvider['email'] as string),
    body('password')
      .isLength({ min: 6 })
      .withMessage(messagesProvider['password'] as string),
  ];
};
