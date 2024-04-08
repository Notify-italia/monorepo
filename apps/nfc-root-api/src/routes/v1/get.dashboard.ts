import { INotifyCompany } from '@notify/interfaces';
import { AgentModel, CompanyModel, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';

//boilderplate for a post request to create an agent
const router = Router();

router.get(
  '/',
  requestHandler(
    async (req, res) => {
      const companies: INotifyCompany<true>[] = await CompanyModel.find({
        license: { $ne: null },
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

      const agents = await AgentModel.find({
        owner: { $in: activeCompanies.map((company) => company._id) },
      });

      const profileVisit = agents
        .map((agent) => agent.statsTotals['profile:visit'])
        .reduce((a, b) => a + (b || 0), 0);

      const provileSave = agents
        .map((agent) => agent.statsTotals['profile:save'])
        .reduce((a, b) => a + (b || 0), 0);

      res.send({
        companies: companies.length,
        activeCompanies: activeCompanies.length,
        boughtCards,
        agents: agents.length,
        profileVisit,
        provileSave,
      });
    },
    {
      errorMessage: 'ERRORE!',
      requireApiKey: true,
    }
  )
);

export { router as getDashboardRouter };
