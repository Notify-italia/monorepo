import { EnumNotifyUserType } from '@notify/interfaces';
import {
  AgentDocument,
  BadRequestError,
  ProfileModel,
  UserDocTypes,
  genericUserQuery,
  requestHandler,
  upgradeProfileToV2,
} from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('agent').optional().isMongoId(),
  requestHandler(
    async (req, res) => {
      const id = req.body.agent || req.currentUser._id;
      const isProvidedAgent = !!req.body.agent;

      if (
        isProvidedAgent &&
        req.currentUser.userType === EnumNotifyUserType.Agent
      ) {
        throw new BadRequestError(
          'Non hai i permessi per aggiornare il profilo di un altro agente'
        );
      }

      const profile = await ProfileModel.findOne({
        owner: id,
      });

      const user = await genericUserQuery<true, UserDocTypes>(
        isProvidedAgent ? EnumNotifyUserType.Agent : req.currentUser.userType,
        {
          _id: id,
        },
        true
      );

      if (
        isProvidedAgent &&
        String((user as unknown as AgentDocument).owner) !== req.currentUser._id
      ) {
        throw new BadRequestError(
          'Non hai i permessi per aggiornare il profilo di un agente non appartenente alla tua azienda'
        );
      }

      await upgradeProfileToV2(profile, user);

      res.status(201).send(profile);
    },
    {
      requireAuth: {
        requireLicense: true,
      },
    }
  )
);

export { router as postProfileV2UpdateRouter };
