import { Agent } from '../../models/model.agent';
import { EnumTargetDb, queryDb } from '../service.db';
import { Password } from '../service.password';

export const SigninService = async (
  auth: {
    email: string;
    password: string;
  },
  targetDb: EnumTargetDb
) => {
  const user = await queryDb<Agent, true>(
    targetDb,
    { email: auth.email },
    true
  );

  if (!user) {
    return null;
  }

  const isMatch = await _comparePassword(user.password, auth.password);
};

const _comparePassword = async (source: string, provided: string) => {
  return await Password.compare(provided, source);
};
