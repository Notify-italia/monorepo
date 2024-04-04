import {
  BadRequestError,
  CompanyDocument,
  CompanyModel,
  LICENSE_VALIDATION_MESSAGES,
  requestHandler,
} from '@notify/nfc-api-core';

import { Password, sendEmail } from '@notify/nfc-api-core';
import { format } from 'date-fns';
import { Router } from 'express';
import { body } from 'express-validator';

import {
  INVALID_JWT_TOKEN,
  userSignInValidation,
  verifyToken,
} from '@notify/nfc-api-core';

let usedTokens: string[] = [];

const router = Router();

router.post(
  '/',
  userSignInValidation(LICENSE_VALIDATION_MESSAGES, true, false),
  body('token').isJWT().withMessage(INVALID_JWT_TOKEN),
  requestHandler(async (req, res) => {
    const { password, token } = req.body;

    if (usedTokens.includes(token)) {
      throw new BadRequestError('Password già recuperata');
    }

    const validatedToken = verifyToken<{
      email: string;
      id: string;
    }>(token);

    const company = await CompanyModel.findOne({
      email: validatedToken.email,
      _id: validatedToken.id,
    });

    if (!company) {
      throw new BadRequestError('Utente non trovato');
    }

    const hashedPassword = await _validateCompanyPassword(company, password);

    company.password = hashedPassword;
    await company.save();

    _updateUsedTokens(token);

    //send email
    await sendEmail({
      to: [company.email],
      title: 'La tua password è stata aggiornata',
      body: _updatedPaswordEmailTemplate(company.email),
    });

    res.send({ status: 'ok' });
  })
);

export { router as postCompanyPasswordUpdateRouter };

const _updateUsedTokens = (token: string) => {
  usedTokens = usedTokens.filter((usedToken) => {
    return verifyToken(usedToken, false);
  });

  usedTokens.push(token);
};

const _validateCompanyPassword = async (
  company: CompanyDocument,
  password: string
) => {
  //check if the password is the same as the current password
  const arePasswordEqual = await Password.compare(
    company.password as string,
    password
  );

  if (arePasswordEqual) {
    throw new BadRequestError(
      'La password non può essere uguale a quella attuale'
    );
  }

  return await Password.toHash(password);
};

const _updatedPaswordEmailTemplate = (email: string) => `
  <p> La passwrord del tuo account Notify è stata aggiornata. </p>
  
  <p>
    In data ${format(
      new Date(),
      'dd/MM/yyyy HH:mm'
    )} la password per l'account con email <b>${email}</b> è stata aggiornata. 
    <br />
    <br />
    Se non hai richiesto questa modifica, contattataci a <a href="mailto:supporto@notifyapp.it">supporto@notifyapp.it</a>.
  </p>
  
  <p>
    Grazie, <br />
    Il team di Notify
  </p>`;
