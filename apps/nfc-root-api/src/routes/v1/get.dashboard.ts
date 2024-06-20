import { EnumNotifyUserType, INotifyCompany } from '@notify/interfaces';
import {
  Agent,
  AgentModel,
  Company,
  CompanyModel,
  StatModel,
  genericUserQuery,
  requestHandler,
} from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();
const excludedCompany = [
  '65c23f35c92682d98233e50f',
  '655805c8f5638dc5ef4b358f',
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

      const _usableUsers = [
        ...companies.map((company) => company._id),
        ..._agents.map((agent) => agent._id),
      ];

      const agents = _agents.filter((agent) =>
        activeCompanies
          .map((company) => String(company._id))
          .includes(String(agent.owner))
      );

      const profileVisit = _agents
        .map((agent) => agent.statsTotals['profile:visit'])
        .reduce((a, b) => a + (b || 0), 0);

      const provileSave = _agents
        .map((agent) => agent.statsTotals['profile:save'])
        .reduce((a, b) => a + (b || 0), 0);

      const _latestVisit = await StatModel.find({
        owner: { $in: _usableUsers },
      })
        .limit(1)
        .sort({ updatedAt: -1 });

      const latestVisitUser = [
        await genericUserQuery<true, Agent>(
          EnumNotifyUserType.Agent,
          { _id: _latestVisit?.[0].owner },
          true,
          'profile'
        ),
        await genericUserQuery<true, Company>(
          EnumNotifyUserType.Company,
          { _id: _latestVisit?.[0].owner },
          true,
          'profile'
        ),
      ];

      res.send({
        companies: companies.length,
        activeCompanies: activeCompanies.length,
        boughtCards,
        agents: agents.length,
        totalAgents: _agents.length,
        profileVisit,
        provileSave,
        latestVisit: {
          date: _latestVisit?.[0].updatedAt,
          user: latestVisitUser.find((user) => user)?.toObject(),
        },
      });
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getDashboardRouter };
