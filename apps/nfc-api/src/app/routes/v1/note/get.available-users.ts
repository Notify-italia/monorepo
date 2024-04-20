/*
Creare unaa nuova route GET /api/v1/note/available-users che restituisca la lista degli utenti che possono essere associati alla nota con id passato come parametro nel query.
0. trovare la nota corrente (tramite il modello NoteModel)
1. trovare tutti gli agenti (tramite il modello AgentModel) della stessa azienda dell'utente corrente (l'oggetto che rappresenta l'utente corrente è contenuto in req.currentUser) e popolarne il campo 'profile' tramite il metodo `populate('profile')`
2. ottenere l'oggetto che rappresenta l'azienda dell'utente corrente (un currentUser, se è un agente ha un campo "owner" che è l'id dell'azienda a cui appartiene. puoi usarlo come id nel CompanyModel per trovare l'azienda corrente) e popolarne il campo 'profile' tramite il metodo `populate('profile')`
3. unire i risultati dei punti 1 e 2 in un unico array di INotifyUser
4. filtrare il risultato per ottenere un array di INotifyUser che non sono già segnati nel campo "owners" della nota
5. restituire il risultato


se non sai cosa contengono gli oggetti, premi cmd+p e cerca la rispettiva interfaccia.
es. interface.agent.ts per l'interfaccia Agent

puoi inoltre chiedere a github copilot (nella sidebar, l'icona con la chat) aggiugendo '@workspace' prima della tua domanda così da permettergli di accedere al codice sorgente del progetto per darti suggerimenti più precisi
*/

import {
  AgentModel,
  CompanyModel,
  NOTE_VALIDATION_MESSAGES,
  NoteModel,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  query('id')
    .isMongoId()
    .withMessage(NOTE_VALIDATION_MESSAGES._id as string),
  requestHandler(async (req, res) => {
    const { id } = req.query;

    const note = await NoteModel.findById(id).lean();
    const agents = await AgentModel.find({
      owner: req.currentUser.owner,
    })
      .populate('profile')
      .lean();

    const company = await CompanyModel.findById(req.currentUser.owner)
      .populate('profile')
      .lean();

    const users = [...agents, company];
  })
);
