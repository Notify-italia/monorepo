import { SvgBoxIcon } from '../services';

export const generateIconSet = (iconSet: SvgBoxIcon[]) => {
  return iconSet.sort((a, b) =>
    (a.expanded || '').localeCompare(b.expanded || '')
  );
};

export const generateIcon = (
  name: string,
  expanded: string,
  set?: string,
  data?: (name: string) => string
) => {
  return {
    expanded,
    name,
    set: set || '',
    score: 1,
    data: data ? data(name) : undefined,
  };
};
