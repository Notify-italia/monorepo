import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import { declareEnvs } from './service.envs';
import { mLog } from './service.managed-logs';

const { OPENAI_API_KEY } = declareEnvs(['OPENAI_API_KEY']);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const createGPT = async (
  config: ChatCompletionCreateParamsNonStreaming
) => {
  const result = await openai.chat.completions.create(config);

  mLog(
    `Elaborated ${config.model} response with resulting ${result.usage?.total_tokens} tokens used`,
    'success'
  );

  return result;
};
