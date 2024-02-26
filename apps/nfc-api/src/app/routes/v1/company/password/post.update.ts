import { BadRequestError } from 'apps/nfc-api/src/app/services/errors/errors';
import { sendEmail } from 'apps/nfc-api/src/app/services/service.email';
import { Password } from 'apps/nfc-api/src/app/services/users/service.password';
import { format } from 'date-fns';
import { Router } from 'express';
import { body } from 'express-validator';
import {
  CompanyDocument,
  CompanyModel,
} from '../../../../models/model.company';
import { LICENSE_VALIDATION_MESSAGES } from '../../../../models/model.license';
import { errorHandledRequest } from '../../../../services/errors/middlewares/bun.error-handler';
import {
  INVALID_JWT_TOKEN,
  verifyToken,
} from '../../../../services/service.jwt';
import { userSignInValidation } from '../../../../services/service.validation';

let usedTokens: string[] = [];

const router = Router();

router.post(
  '/',
  userSignInValidation(LICENSE_VALIDATION_MESSAGES, true, false),
  body('token').isJWT().withMessage(INVALID_JWT_TOKEN),
  errorHandledRequest(async (req, res) => {
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
