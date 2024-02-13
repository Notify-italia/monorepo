import { body } from 'express-validator';
import { AGENT_VALIDATION_MESSAGES } from '../models/model.agent';
import { COMPANY_VALIDATION_MESSAGES } from '../models/model.company';

export const userSignInValidation = (
  messagesProvider:
    | typeof COMPANY_VALIDATION_MESSAGES
    | typeof AGENT_VALIDATION_MESSAGES,
  isPasswordRequired = true,
  isEmailRequired = true
) => {
  const _password = isPasswordRequired
    ? body('password')
        .isLength({ min: 6 })
        .withMessage(messagesProvider['password'] as string)
    : body('password')
        .optional({
          checkFalsy: true,
        })
        .isLength({ min: 6 })
        .withMessage(messagesProvider['password'] as string);

  const _email = isEmailRequired
    ? body('email')
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage(messagesProvider['email'] as string)
    : body('email')
        .optional({
          checkFalsy: true,
        })
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage(messagesProvider['email'] as string);

  return [_email, _password];
};
