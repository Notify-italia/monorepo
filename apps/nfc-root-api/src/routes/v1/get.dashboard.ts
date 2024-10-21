import {
  EnumNotifyUserType,
  INotifyCompany,
  UserDocument,
} from '@notify/interfaces';
import {
  Agent,
  AgentModel,
  Company,
  CompanyModel,
  StatModel,
  asyncForEach,
  genericUserQuery,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();
const excludedCompany = [
  '65c23f35c92682d98233e50f',
  '655805c8f5638dc5ef4b358f',
  '667ee391955ff30f63ebffec',
];

router.get(
  '/',
  requestHandler(
    async (req, res) => {
      const companies: INotifyCompany<true>[] = await CompanyModel.find({
        license: { $ne: null },
        _id: { $nin: excludedCompany },
      })
        .populate('license')
        .lean();

      const activeCompanies = companies.filter(
        (company) =>
          company.license.enabled &&
          (company.license.expirationDate === null ||
            company.license.expirationDate > new Date())
      );

      const boughtCards = companies
        .map((company) => company.license.boughtCards)
        .reduce((a, b) => a + (b || 0), 0);

      const _agents = await AgentModel.find({
        owner: { $in: companies.map((company) => company._id) },
      });

      const _allUsers = [...companies, ..._agents];

      const agents = _agents.filter((agent) =>
        activeCompanies
          .map((company) => String(company._id))
          .includes(String(agent.owner))
      );

      const profileVisit = _allUsers
        .map((agent) => agent.statsTotals?.['profile:visit'])
        .filter((i) => i)
        .reduce((a, b) => a + (b || 0), 0);

      const provileSave = _allUsers
        .map((agent) => agent.statsTotals?.['profile:save'])
        .filter((i) => i)
        .reduce((a, b) => a + (b || 0), 0);

      const _latestVisits = await StatModel.find({
        owner: { $in: _allUsers.map((u) => u._id) },
      })
        .limit(10)
        .sort({ updatedAt: -1 });

      const latestVisits: {
        date: Date;
        user: UserDocument;
        count: number;
      }[] = new Array(_latestVisits.length);

      await asyncForEach(_latestVisits, async (v, index) => {
        const latestVisitUser = [
          await genericUserQuery<true, Agent>(
            EnumNotifyUserType.Agent,
            { _id: v.owner },
            true,
            'profile'
          ),
          await genericUserQuery<true, Company>(
            EnumNotifyUserType.Company,
            { _id: v.owner },
            true,
            'profile'
          ),
        ].filter((i) => i)?.[0];

        latestVisits[index] = {
          date: v.updatedAt,
          count: v.value,
          user: latestVisitUser,
        };
      });

      res.send({
        companies: companies.length,
        activeCompanies: activeCompanies.length,
        boughtCards,
        agents: agents.length,
        totalAgents: _agents.length,
        profileVisit,
        provileSave,
        latestVisits,
      });
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getDashboardRouter };
