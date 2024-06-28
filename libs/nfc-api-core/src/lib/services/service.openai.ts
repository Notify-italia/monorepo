import dot from 'dot-object';
import _ from 'lodash';
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
    `Elaborated ${config.model} response. ${result.usage?.total_tokens} tokens used`,
    'success'
  );

  return result;
};

export const translateObject = async (
  toBeTranslated: Record<string, unknown>,
  language: string
) => {
  console.log('translating', _toDotNotation(toBeTranslated));

  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    max_tokens: 2000,
    response_format: { type: 'json_object' },
    temperature: 0.8,
    messages: [
      {
        role: 'system',
        content: `You are a translation API. Translate the values of the fields in a given array into the following language: ${language}. Exclude from translation fields containing any of the following: URLs, kebab-case texts, camelCase texts, snake_case texts, and any numbers. Return a JSON with an array of objects, each containing a 'path' field representing the path to the value in dot notation (use [n] for arrays) and a 'value' field representing the translated value. Ensure you return a valid JSON. Ensure the JSON value doesn't contain any fields other than those in the schema, it should start with [ and end with ].`,
      },
      {
        role: 'user',
        content: JSON.stringify(_toDotNotation(toBeTranslated)),
      },
    ],
  });

  mLog(
    `Elaborated ${result.model} response. ${result.usage?.total_tokens} tokens used. Translated to ${language}`,
    'success'
  );

  console.log(result.choices[0].message);

  const value: {
    path: string;
    value: string;
  }[] = JSON.parse(result.choices[0].message.content || '{}');

  if (!value) {
    return result;
  }

  value.forEach((key) => {
    _.set(toBeTranslated, key.path, key.value);
  });

  return toBeTranslated;
};

const _toDotNotation = (obj: Record<string, unknown>) => {
  return Object.entries(dot.dot(obj))
    .map(([path, value]) => ({
      path,
      value,
    }))
    .filter(
      (e) =>
        !['boolean', 'number', 'object', 'undefined', 'null'].includes(
          typeof e.value
        ) &&
        [_isUrl, _hasOnlyNumbers, _hasKebabCase, _hasCamelCase].every(
          (fn) => !fn(e.value as string)
        )
    );
};

const _isUrl = (value: string) => {
  return value.match(/^(http|https):\/\/[^ "]+$/);
};

const _hasOnlyNumbers = (value: string) => {
  return value.match(/^\d+$/);
};

const _hasKebabCase = (value: string) => {
  return value.match(/^[a-z]+(-[a-z]+)+$/);
};

const _hasCamelCase = (value: string) => {
  return value.match(/^[a-z]+([A-Z][a-z]+)+$/);
};
