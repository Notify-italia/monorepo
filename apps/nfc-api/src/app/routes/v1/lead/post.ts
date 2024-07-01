import { INotifyUser } from '@notify/interfaces';
import {
  Lead,
  LeadModel,
  getContactName,
  queryUsers,
  requestHandler,
  sendEmail,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { Schema } from 'mongoose';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  requestHandler(async (req, res) => {
    const data: Lead = req.body;

    const user = await queryUsers({ _id: data.createdBy }, true, 'profile');

    const lead = LeadModel.build({
      ...data,
      sharedBy: [
        data.createdBy,
        user.owner as unknown as Schema.Types.ObjectId,
      ],
    });

    await lead.save();

    await sendConfirmationEmail(lead, user);

    res.send(lead);
  })
);

export { router as postLeadRouter };

const sendConfirmationEmail = async (lead: Lead, user: INotifyUser) => {
  if (lead.accepted || !lead.emails.length || !user.profile) {
    return;
  }

  await sendEmail({
    to: lead.emails,
    title: 'In attesa di conferma | Notify',
    body: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              color: #666666;
              font-size: 16px;
              margin-bottom: 10px;
            }
            ul {
              list-style-type: none;
              padding-left: 0;
            }
            li {
              margin-bottom: 5px;
            }
            footer {
              margin-top: 20px;
              color: #999999;
              font-size: 12px;
            }
            a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <h1>Contatto inviato!</h1>
          <p>Ciao ${lead.name || ''},</p>
          <p>
            ${getContactName(
              user.profile
            )} ha ricevuto le tue informazioni ed al momento sei in attesa di conferma.
          </p>
          <p>
            Qui di seguito puoi trovare un recap delle informazioni che hai inviato:
          </p>
          <ul>
            <li>Nome: ${lead.name || ''}</li>
            <li>Cognome: ${lead.surname || ''}</li>
            <li>Email: ${lead.emails.join(', ') || ''}</li>
            <li>N.Telefono: ${lead.emails.join(', ') || ''}</li>
            <li>Messaggio: ${lead.acceptanceMessage || ''}</li>
          </ul>
          <footer>
            <p>
              <a href="https://notifyapp.it" target="_blank">Ti interessa Notify? fai click qui per saperne di più di più!</a>
            </p>
          </footer>
        </body>
      </html>
    `,
  });
};
