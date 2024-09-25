import {
  BadRequestError,
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
  LicenseManager,
  mLog,
  requestHandler,
  sendEmail,
  userSignInValidation,
} from '@notify/nfc-api-core';
import { addWeeks } from 'date-fns';
import { Request, Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  ...userSignInValidation(COMPANY_VALIDATION_MESSAGES),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { email, password } = req.body;

      const company = await CompanyModel.build({ email, password }).catch(
        (err) => {
          mLog(err, 'error');
          throw new BadRequestError('Email già in uso');
        }
      );

      const license = await LicenseManager.generate({
        allowedAgents: 1,
        boughtCards: 0,
        expirationDate: addWeeks(new Date(), 1),
        features: [
          {
            type: 'include',
            name: 'leads',
          },
        ],
      });

      company.license = license.value._id;

      await company?.save();

      await sendEmail({
        to: [email],
        title: 'Benvenuto in Notify!',
        body: welcomeEmailTemplate,
      });

      res.status(201).send(company);
    }
  )
);

export { router as postCompanyRouter };

const welcomeEmailTemplate = `
<p>Ciao,<br>
Benvenuto/a nel mondo di Notify!</p>

<p>Per iniziare a utilizzare il nostro servizio, ti invitiamo a effettuare il login su <a href="https://aziende.notifyapp.it">aziende.notifyapp.it</a>, inserendo le tue credenziali e attivando la licenza per accedere immediatamente ai vantaggi di Notify!</p>

<p>Se non possiedi una licenza, invece, ti invitiamo a contattare il nostro team vendite all'indirizzo <a href="mailto:commerciale@notifyapp.it">commerciale@notifyapp.it</a>. Sarà un piacere fornirti un preventivo su misura, adattato alle tue esigenze. </p>

<p>Il nostro team è sempre disponibile per assisterti, quindi non esitare a contattarci per qualsiasi domanda o necessità all'indirizzo <a href="mailto:supporto@notifyapp.it">supporto@notifyapp.it</a>.</p>

<p>Di seguito, troverai alcuni link utili per aiutarti a prendere confidenza con il software:</p>
<ul>
  <li><a href="https://scribehow.com/shared/Creazione_e_personalizzazione_dellaccount_aziendale_di_Notify__I26vXKSwTaWGcxwXpNoeoA">Creazione e personalizzazione dell'account aziendale di Notify</a></li>
  <li><a href="https://scribehow.com/shared/Accesso_personalizzazione_e_strumenti_Notify__8HEseaZbQK6si51sN0AXyQ">Accesso, personalizzazione e strumenti Notify</a></li>
</ul>

<p>Grazie per averci scelto! Siamo entusiasti di accompagnarti in questo percorso.</p>

<p>Cordiali saluti,<br>
Il Team di Notify</p>
`;
