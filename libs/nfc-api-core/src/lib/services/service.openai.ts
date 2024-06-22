import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import { declareEnvs } from './service.envs';

const { OPENAI_API_KEY } = declareEnvs(['OPENAI_API_KEY']);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const createGPT = async (
  config: ChatCompletionCreateParamsNonStreaming
) => {
  return await openai.chat.completions.create(config);
};
