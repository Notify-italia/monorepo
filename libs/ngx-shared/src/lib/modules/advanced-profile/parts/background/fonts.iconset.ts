import { SvgBoxIcon } from '../../../../services';

const _generateFormThumbnail = (name: string) => {
  return `
    <svg class="w-full h-full" viewBox="0 0 25 25" fill="currentColor">
      <text x="2" y="19"  class="fonts font-${name} text-lg">
      ${_cleanFontName(name)}
      </text>
    </svg>
  `;
};

const _cleanFontName = (name: string) => {
  const [f, s] = name.split('');
  return `${f.toUpperCase()}${s}`;
};

export const FONTS_ICON_SET: SvgBoxIcon[] = [
  {
    expanded: 'Poppins',
    name: 'poppins',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('poppins'),
  },
  {
    expanded: 'Anek',
    name: 'anek',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('anek'),
  },
  {
    expanded: 'Avenir',
    name: 'avenir',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('avenir'),
  },
  {
    expanded: 'Kode Mono',
    name: 'kodeMono',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('kodeMono'),
  },
  {
    expanded: 'Roboto',
    name: 'roboto',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('roboto'),
  },
  {
    expanded: 'Work Sans',
    name: 'work',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('work'),
  },
  {
    expanded: 'Inter',
    name: 'inter',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('inter'),
  },
  {
    expanded: 'M PLUS Rounded 1c',
    name: 'mplusRounded',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('mplusRounded'),
  },
  {
    expanded: 'Mulish',
    name: 'mulish',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('mulish'),
  },
  {
    expanded: 'Bebas Neue',
    name: 'bebasNeue',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('bebasNeue'),
  },
  {
    expanded: 'Caveat',
    name: 'caveat',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('caveat'),
  },
  {
    expanded: 'Roca Two Bold',
    name: 'rocaTwoBold',
    set: 'social',
    score: 1,
    data: _generateFormThumbnail('rocaTwoBold'),
  },
];
