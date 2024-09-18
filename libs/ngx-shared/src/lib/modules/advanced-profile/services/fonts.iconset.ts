import {
  generateIcon,
  generateIconSet,
} from '../../../constructors/iconset.base';
import { SvgBoxIcon } from '../../../services';

const _generateFormThumbnail = (name: string) => {
  const [f, s] = name.split('');
  const publicName = `${f.toUpperCase()}${s}`;

  return `
    <svg class="w-full h-full" viewBox="0 0 25 25" fill="currentColor">
      <text x="2" y="19"  class="fonts font-${name} text-lg">
      ${publicName}
      </text>
    </svg>
  `;
};

export const FONTS_ICON_SET: SvgBoxIcon[] = generateIconSet([
  generateIcon('montserrat', 'Montserrat', 'fonts', _generateFormThumbnail),
  generateIcon('poppins', 'Poppins', 'fonts', _generateFormThumbnail),
  generateIcon('avenir', 'Avenir', 'fonts', _generateFormThumbnail),
  generateIcon('kodeMono', 'Kode Mono', 'fonts', _generateFormThumbnail),
  generateIcon('roboto', 'Roboto', 'fonts', _generateFormThumbnail),
  generateIcon('work', 'Work Sans', 'fonts', _generateFormThumbnail),
  generateIcon('inter', 'Inter', 'fonts', _generateFormThumbnail),
  generateIcon(
    'mplusRounded',
    'M PLUS Rounded 1c',
    'fonts',
    _generateFormThumbnail
  ),
  generateIcon('mulish', 'Mulish', 'fonts', _generateFormThumbnail),
  generateIcon('bebasNeue', 'Bebas Neue', 'fonts', _generateFormThumbnail),
  generateIcon('caveat', 'Caveat', 'fonts', _generateFormThumbnail),
  generateIcon('rocaTwoBold', 'Roca Two Bold', 'fonts', _generateFormThumbnail),
  generateIcon('tiny5', 'Tiny5', 'fonts', _generateFormThumbnail),
  generateIcon('playFair', 'Playfair Display', 'fonts', _generateFormThumbnail),
  generateIcon(
    'dancingScript',
    'Dancing Script',
    'fonts',
    _generateFormThumbnail
  ),
  generateIcon('bitter', 'Bitter', 'fonts', _generateFormThumbnail),
  generateIcon('ebGaramond', 'EB Garamond', 'fonts', _generateFormThumbnail),
  generateIcon('seymourOne', 'Seymour One', 'fonts', _generateFormThumbnail),
  generateIcon('outfit', 'Outfit', 'fonts', _generateFormThumbnail),
  generateIcon('jacquard12', 'Jacquard 12', 'fonts', _generateFormThumbnail),
  generateIcon('pacifico', 'Pacifico', 'fonts', _generateFormThumbnail),
  generateIcon('chakraPetch', 'Chakra Petch', 'fonts', _generateFormThumbnail),
  generateIcon('figtree', 'Figtree', 'fonts', _generateFormThumbnail),
  generateIcon('quicksand', 'Quicksand', 'fonts', _generateFormThumbnail),
  generateIcon('victorMono', 'Victor Mono', 'fonts', _generateFormThumbnail),
  generateIcon(
    'robotoCondensed',
    'Roboto Condensed',
    'fonts',
    _generateFormThumbnail
  ),
  generateIcon('lato', 'Lato', 'fonts', _generateFormThumbnail),
]);
