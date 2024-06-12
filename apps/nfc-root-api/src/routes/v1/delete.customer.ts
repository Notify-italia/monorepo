import {
  EnumNotifyAdvancedProfileItems,
  EnumNotifyNoteItemType,
  INotifyAPPhotoItem,
  INotifyNoteItemFiles,
  INotifyNoteItemPhoto,
  INotifyProfile,
} from '@notify/interfaces';
import {
  AgentModel,
  COMPANY_VALIDATION_MESSAGES,
  CompanyModel,
  FeedbackModel,
  NoteDocument,
  NoteModel,
  ProfileModel,
  S3Delete,
  StatModel,
  asyncForEach,
  declareEnvs,
  getFilenameFromUrl,
  requestHandler,
} from '@notify/nfc-api-core';
import { Request, Router } from 'express';
import { query } from 'express-validator';

const { S3_ENDPOINT, S3_BUCKET } = declareEnvs(['S3_ENDPOINT', 'S3_BUCKET']);

//boilderplate for a post request to create an agent
const router = Router();

router.delete(
  '/',
  query('id')
    .isMongoId()
    .withMessage(COMPANY_VALIDATION_MESSAGES._id as string),
  requestHandler(
    async (req: Request<{ email: string; password: string }>, res) => {
      const { id } = req.query;

      const company = await CompanyModel.findById(id).populate('profile');

      const agents = await AgentModel.find({ owner: id }).populate('profile');

      const notes = await NoteModel.find({
        owner: { $in: [id, ...agents.map((agent) => agent._id)] },
      });

      const profiles = [
        company?.profile,
        ...agents.map((a) => a.profile),
      ].filter((v) => v) as INotifyProfile[];

      console.log('deleting company', company?.email);
      console.log(
        'deleting agents',
        agents.map((a) => a.email)
      );
      console.log(
        'deleting notes',
        notes.map((n) => n.title)
      );
      console.log(
        `deleting feedbacks`,
        (
          await FeedbackModel.find({
            owner: {
              $in: [company?._id, ...agents.map((i) => i._id).filter((v) => v)],
            },
          })
            .select('_id')
            .lean()
        ).length
      );
      console.log(
        `deleting stats`,
        (
          await StatModel.find({
            owner: {
              $in: [company?._id, ...agents.map((i) => i._id).filter((v) => v)],
            },
          })
            .select('_id')
            .lean()
        ).length
      );

      await _deleteNoteFiles(notes);

      await asyncForEach(notes, async (n) => {
        await n.deleteOne();
      });

      await _deleteProfileFiles(profiles);

      await asyncForEach(profiles, async (p) => {
        await ProfileModel.findByIdAndDelete(p._id);
      });

      await asyncForEach(agents, async (a) => {
        await a.deleteOne();
      });

      await asyncForEach(
        [company?._id, ...profiles.map((v) => v._id)],
        async (n) => {
          await FeedbackModel.deleteMany({ owner: n });
          await StatModel.deleteMany({ owner: n });
        }
      );

      await company?.deleteOne();

      res.status(201).send(company);
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as deleteCustomerRouter };

const _deleteProfileFiles = async (profiles: INotifyProfile[]) => {
  const basePhotos = profiles
    .map((v) => v.avatar)
    .filter((v) => v?.includes(S3_ENDPOINT));

  const withUploadedData = profiles
    .map((v) => v.advancedProfile)
    .map((v) => v?.items)
    .flat()
    .filter((v) =>
      [
        EnumNotifyAdvancedProfileItems.Avatar,
        EnumNotifyAdvancedProfileItems.Photo,
      ].includes(v?.type as EnumNotifyAdvancedProfileItems)
    );

  const photos = (
    withUploadedData.filter(
      (v) => v?.type === EnumNotifyAdvancedProfileItems.Photo
    ) as INotifyAPPhotoItem[]
  ).map((v) => v.imgSrc);
  const avatars = (
    withUploadedData.filter(
      (v) => v?.type === EnumNotifyAdvancedProfileItems.Avatar
    ) as INotifyAPPhotoItem[]
  ).map((v) => v.imgSrc);
  const customBackgrounds = profiles.map(
    (v) => v.advancedProfile?.pageSettings?.imgSrc
  );
  const filesToDelete = [
    ...basePhotos,
    ...photos,
    ...avatars,
    ...customBackgrounds,
  ].filter((v) => v?.length) as string[];

  await Promise.all(
    filesToDelete.map(async (file) => {
      const path = file.split('?')[0].split(`${S3_ENDPOINT}/${S3_BUCKET}`)[1];

      const name = getFilenameFromUrl(file);

      await S3Delete({
        path,
        name,
      });
    })
  );
};

const _deleteNoteFiles = async (notes: NoteDocument[]) => {
  const notesWithUploadedData = notes
    .map((note) => note.items)
    .flat()
    .filter((v) =>
      [EnumNotifyNoteItemType.Photo, EnumNotifyNoteItemType.Files].includes(
        v.type
      )
    );

  const files = (
    notesWithUploadedData
      .filter((v) => v.type === EnumNotifyNoteItemType.Files)
      .map((v) => v.value) as INotifyNoteItemFiles[]
  )
    .map((v) => v.files)
    .map((v) => v.map((v) => v.url))
    .flat();
  const photos = (
    notesWithUploadedData
      .filter((v) => v.type === EnumNotifyNoteItemType.Photo)
      .map((v) => v.value) as INotifyNoteItemPhoto[]
  )
    .map((v) => v.url)
    .flat();

  const filesToDelete = [...files, ...photos];

  await Promise.all(
    filesToDelete.map(async (file) => {
      const path = file.split('?')[0].split(`${S3_ENDPOINT}/${S3_BUCKET}`)[1];

      const name = getFilenameFromUrl(file);

      await S3Delete({
        path,
        name,
      });
    })
  );
};
