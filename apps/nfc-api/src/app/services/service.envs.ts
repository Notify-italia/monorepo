import { RequiredEnvVariableError } from './errors/errors';

export const declareEnvs = (envs: string[]) => {
  envs.forEach((name) => {
    if (!Bun.env[name]) {
      throw new RequiredEnvVariableError(name);
    }
  });

  return Bun.env as { [key: string]: string };
};

export const isProduction = () => Bun.env.BUN_ENV === 'production';
