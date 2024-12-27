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

export const DEFAULT_ICONSET = generateIconSet(
  [
    {
      expanded: 'Apple Pay',
      name: 'applepay',
      set: 'social',
    },

    {
      expanded: 'App Store',
      name: 'appstore',
      set: 'social',
      score: 12.5,
      prefix: 'https://apps.apple.com/it/app/',
    },

    {
      expanded: 'Deviantart',
      name: 'deviantart',
      set: 'social',
      prefix: 'https://deviantart.com/',
    },

    {
      expanded: 'Discord',
      name: 'discord',
      set: 'social',
      score: 14.285714285714286,
      prefix: 'https://discord.gg/',
      placeholder: 'discord.gg/...',
    },
    {
      expanded: 'Dribbble',
      name: 'dribbble',
      set: 'social',
    },
    {
      expanded: 'Dropbox',
      name: 'dropbox',
      set: 'social',
      score: 20,
    },
    {
      expanded: 'Ebay',
      name: 'ebay',
      set: 'social',
      prefix: 'https://ebay.it/usr/',
    },
    {
      expanded: 'Etsy',
      name: 'etsy',
      set: 'social',
      score: 25,
      prefix: 'https://etsy.com/it/shop/',
    },
    {
      expanded: 'Facebook',
      name: 'facebook',
      set: 'social',
      placeholder: 'https://facebook.com/people/...',
    },
    {
      expanded: 'Freelancer',
      name: 'freelancer',
      set: 'social',
    },
    {
      expanded: 'Github',
      name: 'github',
      set: 'social',
      prefix: 'https://github.com/',
      publicPrefix: '/',
      placeholder: 'Percorso Git ',
    },
    {
      expanded: 'Glassdoor',
      name: 'glassdoor',
      set: 'social',
      score: 11.11111111111111,
    },
    {
      expanded: 'E-Mail',
      name: 'gmail',
      set: 'social',
      prefix: 'mailto:',
      placeholder: 'Inserisci un indirizzo email',
    },
    { expanded: 'Google', name: 'google', set: 'social', score: 1 },
    {
      expanded: 'Calendario Google',
      name: 'googlecalendar',
      set: 'social',
    },
    {
      expanded: 'Google Drive',
      name: 'googledrive',
      set: 'social',
    },
    {
      expanded: 'Google Pay',
      name: 'googlepay',
      set: 'social',
    },
    {
      expanded: 'Play Store',
      name: 'googleplay',
      set: 'social',
    },
    {
      expanded: 'Sito Web',
      name: 'globe',
      prefix: 'https://',
      publicPrefix: 'https://',
      set: 'octicons',
    },
    {
      expanded: 'Instagram',
      name: 'instagram',
      set: 'social',
      score: 11.11111111111111,
      prefix: 'https://instagram.com/',
      placeholder: 'Il tuo nome utente',
      publicPrefix: '@',
    },
    {
      expanded: 'Kickstarter',
      name: 'kickstarter',
      set: 'social',
      score: 9.090909090909092,
      prefix: 'https://kickstarter.com/projects/',
    },
    { expanded: 'Line', name: 'line', set: 'social', score: 1 },
    {
      expanded: 'Linkedin',
      name: 'linkedin',
      set: 'social',
      prefix: 'https://www.linkedin.com/',
      publicPrefix: 'linkedin.com/',
      placeholder: 'https://linkedin.com/...',
    },
    {
      expanded: 'Link',
      name: 'link',
      set: 'hero-solid',
      placeholder: 'https://...',
    },
    {
      expanded: 'Mappe',
      name: 'map',
      set: 'hero-solid',
      score: 100,
    },
    { expanded: 'Meetup', name: 'meetup', set: 'social', score: 1 },
    {
      expanded: 'Messenger',
      name: 'messenger',
      set: 'social',
      score: 11.11111111111111,
    },
    {
      expanded: 'Myspace',
      name: 'myspace',
      set: 'social',
      score: 14.285714285714286,
    },
    { expanded: 'Patreon', name: 'patreon', set: 'social', score: 1 },
    { expanded: 'Paypal', name: 'paypal', set: 'social', score: 1 },
    {
      expanded: 'Product Hunt',
      name: 'producthunt',
      set: 'social',
    },
    { expanded: 'Reddit', name: 'reddit', set: 'social', score: 1 },
    {
      expanded: 'Signal',
      name: 'signal',
      set: 'social',
      score: 16.666666666666668,
    },
    { expanded: 'Skype', name: 'skype', set: 'social', score: 20 },
    {
      expanded: 'Snapchat',
      name: 'snapchat',
      set: 'social',
      score: 12.5,
    },
    {
      expanded: 'Condivisione',
      name: 'share',
      set: 'hero-solid',
    },
    {
      expanded: 'Telegram',
      name: 'telegram',
      set: 'social',
    },
    { expanded: 'Tiktok', name: 'tiktok', set: 'social', score: 1 },
    { expanded: 'Trello', name: 'trello', set: 'social', score: 1 },
    { expanded: 'Twitch', name: 'twitch', set: 'social', score: 1 },
    { expanded: 'Udacity', name: 'udacity', set: 'social', score: 1 },
    { expanded: 'Venmo', name: 'venmo', set: 'social', score: 1 },
    { expanded: 'Youtube', name: 'youtube', set: 'social', score: 1 },
    { expanded: 'Zoom', name: 'zoom', set: 'social', score: 1 },
    {
      expanded: 'TripAdvisor',
      name: 'tripadvisor',
      set: 'social',
      data: `<svg  fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.945c-3.19 0-6.167.856-8.203 2.227H0c.621.726 1.081 1.717 1.195 2.39a5.96 5.96 0 0 0-1.148 3.516 5.979 5.979 0 0 0 5.976 5.977 5.983 5.983 0 0 0 4.641-2.227c.445.522 1.187 1.57 1.336 1.875 0 0 .852-1.26 1.336-1.851a5.979 5.979 0 0 0 10.617-3.774 5.96 5.96 0 0 0-1.148-3.515c.114-.674.574-1.665 1.195-2.391h-3.984C17.98 5.8 15.188 4.945 12 4.945Zm0 1.008c2.139 0 4.078.401 5.79 1.149A5.982 5.982 0 0 0 12 13.078a5.967 5.967 0 0 0-5.953-5.976C7.755 6.357 9.864 5.953 12 5.953ZM6.023 8.25c2.658 0 4.805 2.174 4.805 4.828a4.802 4.802 0 0 1-4.805 4.805 4.8 4.8 0 0 1-4.804-4.805c0-2.654 2.147-4.828 4.804-4.828Zm11.954 0c2.654 0 4.804 2.174 4.804 4.828a4.802 4.802 0 0 1-4.804 4.805 4.8 4.8 0 0 1-4.805-4.805c0-2.654 2.147-4.828 4.805-4.828ZM5.953 10.148a2.91 2.91 0 0 0-2.906 2.907 2.91 2.91 0 0 0 2.906 2.906 2.91 2.91 0 0 0 2.906-2.906 2.91 2.91 0 0 0-2.906-2.907Zm12.024 0a2.91 2.91 0 0 0-2.907 2.907c0 1.602 1.304 2.883 2.907 2.883a2.89 2.89 0 0 0 2.906-2.883 2.91 2.91 0 0 0-2.906-2.907Zm-12.024.891a2.02 2.02 0 0 1 2.016 2.016 2.02 2.02 0 0 1-2.016 2.015 2.02 2.02 0 0 1-2.016-2.015 2.02 2.02 0 0 1 2.016-2.016Zm12.024 0a2.02 2.02 0 0 1 2.015 2.016 2 2 0 0 1-2.015 1.992 2 2 0 0 1-2.016-1.992 2.02 2.02 0 0 1 2.016-2.016ZM5.812 12.07a.99.99 0 0 0-.984.985.99.99 0 0 0 .984.984.97.97 0 0 0 .961-.984.97.97 0 0 0-.96-.985Zm12 0a.97.97 0 0 0-.96.985c0 .539.421.96.96.96a.97.97 0 0 0 .985-.96.99.99 0 0 0-.985-.985Z"></path>
  </svg>`,
    },
    {
      expanded: 'Trustpilot',
      name: 'trustpilot',
      set: 'social',
      placeholder: 'Sito web',
      prefix: 'https://it.trustpilot.com/evaluate/',
      publicPrefix: 'trustpilot.com/evaluate/',
      data: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" xmlns:v="https://vecta.io/nano"><path d="M12 17.964l5.214-1.321 2.179 6.714L12 17.964zm12-8.678h-9.179L12 .643 9.179 9.286H0l7.429 5.357-2.821 8.643 7.429-5.357 4.571-3.286L24 9.286h0 0 0z"/></svg>`,
    },
    {
      expanded: 'Yelp',
      name: 'yelp',
      set: 'social',
    },
    {
      expanded: 'Spotify',
      name: 'spotify',
      set: 'social',
    },
    {
      expanded: 'Apple Music',
      name: 'applemusic',
      set: 'social',
    },
    {
      expanded: 'Sfoglia il menù',
      name: 'menu_book',
      set: 'materialui',
    },
    {
      expanded: 'File',
      name: 'file',
      set: 'octicons',
    },
    {
      expanded: 'Zip',
      name: 'file-zip',
      set: 'octicons',
    },
    {
      expanded: 'Codice',
      name: 'file-code',
      set: 'octicons',
    },
    {
      expanded: 'Media',
      name: 'file-media',
      set: 'octicons',
    },
    {
      expanded: 'Allegato',
      name: 'attach_file',
      set: 'materialui',
    },
    {
      expanded: 'Documento di testo',
      name: 'document-text',
      set: 'hero-outline',
    },
    {
      expanded: 'Report',
      name: 'document-report',
      set: 'hero-outline',
    },
    {
      expanded: 'Ufficio',
      name: 'office-building',
      set: 'hero-solid',
    },
    {
      expanded: 'Novità',
      name: 'sparkles',
      set: 'hero-solid',
    },
    {
      expanded: 'Nessuna icona',
      name: 'no-icon',
      set: '',
      data: '',
    },
    {
      expanded: 'Apps',
      name: 'apps',
      set: 'materialui',
    },
    {
      expanded: 'Analytics',
      name: 'analytics',
      set: 'materialui',
    },
    {
      expanded: 'Ebook',
      name: 'book',
      set: 'materialui',
    },
    {
      expanded: 'Codice',
      name: 'code',
      set: 'materialui',
    },
    {
      expanded: 'Contactless',
      name: 'contactless',
      set: 'materialui',
    },
    {
      expanded: 'Scarica il gioco',
      name: 'games',
      set: 'materialui',
    },
    {
      expanded: 'Acquista ora',
      name: 'payments',
      set: 'materialui',
    },
    { expanded: 'Punti vendita', name: 'point_of_sale', set: 'materialui' },
    {
      expanded: 'Caffè',
      name: 'coffee',
      set: 'social',
      data: `<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 5h-1V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a4 4 0 0 0 4 4h6c1.858 0 3.411-1.279 3.858-3H19a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 6a1 1 0 0 1-1 1h-1V7h1a1 1 0 0 1 1 1v3Zm-2 8H3c0 1.654 1.346 3 3 3h11c1.654 0 3-1.346 3-3h-2Z"></path>
</svg>`,
    },
    {
      expanded: 'Caffè (Alt)',
      name: 'coffee-2',
      set: 'social',
      data: `<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 2h2v3H5V2Zm4 0h2v3H9V2Zm4 0h2v3h-2V2Zm6 7h-2V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3h2c1.103 0 2-.897 2-2v-5c0-1.103-.897-2-2-2Zm-2 7v-5h2l.002 5H17Z"></path>
</svg>`,
    },
    {
      expanded: 'X',
      name: 'x',
      set: 'social',
      prefix: 'https://x.com/',
      publicPrefix: 'x.com/',
      data: `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" viewBox="0 0 512 462.799" xmlns:v="https://vecta.io/nano"><path fill-rule="nonzero" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg>`,
    },
  ].sort((a, b) => a.expanded.localeCompare(b.expanded))
);
