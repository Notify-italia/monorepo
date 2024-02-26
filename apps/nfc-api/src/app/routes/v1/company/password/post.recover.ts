import { INotifyCompany } from '@notify/interfaces';
import { isProduction } from 'apps/nfc-api/src/app/services/service.envs';
import { Router } from 'express';
import { CompanyModel } from '../../../../models/model.company';
import { LICENSE_VALIDATION_MESSAGES } from '../../../../models/model.license';
import { errorHandledRequest } from '../../../../services/errors/middlewares/bun.error-handler';
import { sendEmail } from '../../../../services/service.email';
import { signToken } from '../../../../services/service.jwt';
import { userSignInValidation } from '../../../../services/service.validation';

const router = Router();

router.post(
  '/',
  userSignInValidation(LICENSE_VALIDATION_MESSAGES, false, true),
  errorHandledRequest(async (req, res) => {
    const { email } = req.body;

    const company = await CompanyModel.findOne({ email })
      .populate('profile')
      .lean();

    if (!company) {
      res.send({
        status: 'ok',
      });
      return;
    }

    //generating a token for the user
    const token = signToken(
      {
        email: company.email,
        id: company._id,
      },
      '15m'
    );

    //sending the email with the reset password link to the user
    await sendEmail({
      to: [company.email],
      title: 'Reimposta la tua password',
      body: passwordResetLinkEmailTemplate(
        company as unknown as INotifyCompany<true>,
        token
      ),
    });

    res.send({ status: 'ok' });
  })
);

export { router as postCompanyPasswordRecoverRouter };

const passwordResetLinkEmailTemplate = (
  company: INotifyCompany<true>,
  token: string
) => {
  return `
  <p>Gentile ${company.profile?.name || company.email},</p>

  <p>Hai richiesto il reset della password per il tuo account su Notify. Per procedere, clicca sul seguente link</p>
  
  <p><a href="${_updateEndpoint(token)}">${_updateEndpoint(token)}</a></p>
  
  <p>Se non hai richiesto il recupero della password o se hai ricevuto questa email per errore, ignora semplicemente questo messaggio.</p>
  
  <p>Grazie per la tua attenzione e continua a godere dei vantaggi di Notify!</p>
  
  <p>Cordiali saluti,<br>
  Il Team di Notify</p>
  `;
};

const _updateEndpoint = (token: string) => {
  return isProduction()
    ? `https://aziende.notifyapp.it/password/update?t=${token}`
    : `http://localhost:4210/password/update?t=${token}`;
};
