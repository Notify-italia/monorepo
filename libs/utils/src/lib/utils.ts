import { body } from 'express-validator';

export const generateExpressValidation = (
  obj: Record<string, unknown>,
  required?: string[]
) => {
  const profile = _flattenObject(obj);
  const keys = Object.keys(profile);

  return keys.map((key) => {
    if (required && required.includes(key)) {
      return body(key)
        .exists()
        .withMessage(profile[key] as string);
    }

    return body(key)
      .optional()
      .exists()
      .withMessage(profile[key] as string);
  });

  // return keys.map((key) => {
  //   return body(key)
  //     .optional()
  //     .exists()
  //     .withMessage(profile[key] as string);
  // });
};

const _flattenObject = (obj: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      if (typeof element === 'object') {
        result[key] = _flattenObject(element as Record<string, unknown>);
      } else {
        result[key] = element;
      }
    }
  }
  return result;
};
