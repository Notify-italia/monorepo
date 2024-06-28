import {
  EnumNotifyAdvancedProfileItems,
  EnumNotifyUserType,
  INotifyPopulatedProfile,
} from '@notify/interfaces';
import { requestHandler, translateObject } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body, query } from 'express-validator';

//boilderplate for a post request to create an agent
const router = Router();

router.post(
  '/',
  body('data').isObject().withMessage('Data is required'),
  query('l').isString().withMessage('Language is required'),
  requestHandler(async (req, res) => {
    const profile: INotifyPopulatedProfile = req.body.data;
    const language = req.query.l as string;

    const toBeTranslated = JSON.parse(
      JSON.stringify({
        company:
          profile.type === EnumNotifyUserType.Agent
            ? {
                advancedProfile: {
                  items: profile.company?.advancedProfile?.items,
                },
              }
            : null,
        advancedProfile: {
          items: profile.advancedProfile.items,
        },
      })
    ) as INotifyPopulatedProfile;

    if (profile.type === EnumNotifyUserType.Agent) {
      (toBeTranslated.company as any).advancedProfile.items =
        toBeTranslated.company?.advancedProfile?.items
          .filter((v) => v.visible)
          .filter((v) => v.type !== EnumNotifyAdvancedProfileItems.Divider)
          .filter(
            (v) =>
              !(
                v.type === EnumNotifyAdvancedProfileItems.Photo &&
                !v.title.length
              )
          )
          .map((v: any) => {
            delete v.textConfig;
            delete v.type;
            delete v.visible;
            delete v.showTitle;
            delete v._id;
            return v;
          });
    }

    toBeTranslated.advancedProfile.items = toBeTranslated.advancedProfile.items
      .filter((v) => v.visible)
      .filter((v) => v.type !== EnumNotifyAdvancedProfileItems.Divider)
      .filter(
        (v) =>
          !(v.type === EnumNotifyAdvancedProfileItems.Photo && !v.title.length)
      )
      .map((v: any) => {
        delete v.textConfig;
        delete v.type;
        delete v.visible;
        delete v.showTitle;
        delete v._id;
        return v;
      });

    res.json(await translateObject(toBeTranslated, language));
  })
);

export { router as postTranslateProfileRouter };
