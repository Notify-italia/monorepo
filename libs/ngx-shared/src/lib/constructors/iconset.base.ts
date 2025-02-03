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
      expanded: 'Codice (Alt)',
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
    {
      expanded: 'Ristorante',
      name: 'restaurant',
      set: 'materialui',
    },
    {
      expanded: 'Menù',
      name: 'restaurant_menu',
      set: 'materialui',
    },
    {
      expanded: 'Fast Food',
      name: 'fastfood',
      set: 'materialui',
    },
    {
      expanded: 'Glass',
      name: 'glass',
      set: 'custom',
      placeholder: 'Nome utente',
      prefix: 'https://glass.photo/',
      publicPrefix: 'glass.photo/',
      data: '<svg fill="none" viewBox="0 0 260 150"  xmlns="http://www.w3.org/2000/svg"><path d="m160.407 74.8958c.017-.0356.041-.0881.058-.1203 0 .1322-.024.1474-.058.1203zm-10.495 6.8143c-6.356 12.6289-11.45 20.4559-17.192 20.4559-3.482 0-6.011-3.1408-6.011-8.7741 0-4.8134 1.781-10.218 5.407-16.2224 3.657-6.0569 8.46-10.2231 13.936-10.2231 4.395 0 7.712 2.5431 9.125 3.8476-1.315 2.8786-3.038 6.489-5.265 10.9161zm-78.7205 36.7279c0 9.162-1.0407 14.953-3.376 18.776-2.5469 4.172-5.8197 6.114-10.2991 6.114-3.3405 0-6.153-1.74-7.5238-4.657-2.1813-4.636-.3909-10.72 4.7874-16.275 3.7027-3.972 9.783-9.7 16.4115-15.808zm32.9435-95.4556c0-10.2129 3.662-16.31046 10.607-16.31046 5.814 0 8.935 4.77606 8.935 12.77626 0 8.5611-2.824 24.7445-19.542 45.4634zm148.512 47.2203c-4.906-7.065-7.745-10.2756-7.864-10.4077-.714-.8048-1.765-1.2165-2.848-1.0979-1.071.1169-2.019.7438-2.547 1.6858-.079.1423-8.104 14.4604-13.875 23.1383-3.159 4.7524-6.142 9.2404-9.684 12.0478-.691.5455-1.407 1.0504-2.143 1.5214.811-2.211 1.234-4.688 1.234-7.4869 0-7.5495-3.97-13.9436-8.766-20.9273-3.713-5.4097-6.182-8.5644-6.285-8.6965-.697-.8844-1.785-1.3503-2.916-1.2605-1.122.0999-2.118.7607-2.646 1.7569-.099.1864-9.927 18.6994-18.307 33.053-3.28 5.6164-5.084 7.9649-7.766 7.9649-.797 0-1.511-.288-1.96-.786-.402-.453-.634-1.2727-.634-2.2537 0-7.2378-.102-35.8638-.102-35.8638-.005-1.6383-1.198-3.0293-2.814-3.2834-1.635-.2508-3.178.7048-3.684 2.2601-.007.022-.305.9233-1.097 2.8683-2.584-1.9416-6.679-4.1593-11.891-4.1593-5.214 0-9.856 1.8924-13.936 5.9773-3.029 3.031-5.909 7.1124-9.637 14.0859-2.71 5.0658-6.145 11.4751-9.558 16.0259-2.552 3.402-4.684 5.1287-6.339 5.1287-.67 0-2.447 0-2.447-3.7513v-22.5673c9.615-10.7026 15.687-20.5258 19.61-29.0631 5.303-11.5378 6.846-20.3632 6.846-26.293 0-14.35367-8.393-19.81930432-15.365-19.81930432-8.189 0-17.7537 6.01964432-17.7537 22.98240432v49.6075c-1.5924 1.7129-3.2796 3.4546-5.0666 5.2183-3.6891 3.641-8.8861 8.4391-14.5517 13.6285v-27.7687c0-1.518-1.0255-2.8463-2.4944-3.2275-1.4723-.3812-3.0089.2796-3.7467 1.6062-.0897.1609-8.9266 16.0309-14.4079 23.1518-8.886 11.548-16.9462 16.6965-26.1352 16.6965-14.5974 0-24.40738-14.1128-24.40738-35.118 0-15.172 3.92268-28.8208 11.34488-39.4692 8.6847-12.4594 21.7303-20.5088 33.2376-20.5088 14.1117 0 20.4272 10.6128 20.4272 21.1323 0 9.0439-4.0106 17.5897-11.4396 24.631-1.8107 1.7162-4.6859 3.8324-6.0295 4.8641-.7429.5727-1.1727 1.1674-1.364 1.9264-.225.898-.0541 1.8908.5111 2.7142.6295.9098 1.6279 1.413 2.6534 1.4418.682.0186 1.2625-.1982 1.9817-.5879 1.6415-.8929 4.6689-3.48 6.6912-5.3792 8.8657-8.329 13.6599-18.6113 13.6599-29.6104 0-16.3698-11.1402-27.804228-27.0914-27.804228-13.8274 0-28.6567 8.952388-38.7002 23.363628-8.20744 11.7733-12.5447 26.742-12.5447 43.2863 0 24.6055 12.7765 41.789 31.0698 41.789 14.8462 0 25.0387-11.0131 31.4134-19.2962 2.6382-3.4258 5.9026-8.578 8.7083-13.2304v21.4949c-8.3902 7.6867-16.5891 15.2737-21.2835 20.3107-7.1057 7.624-9.3277 16.471-5.9449 23.669 2.4623 5.233 7.6558 8.486 13.5533 8.486 6.835 0 12.213-3.131 15.9851-9.306 3.0105-4.931 4.3525-11.796 4.3525-22.256v-17.964c.4044-.37.8072-.7372 1.2099-1.1065 6.962-6.3687 13.5364-12.385 18.0192-16.8103.1303-.1288.2589-.2558.3892-.3846v15.5701c0 7.1993 4.5737 10.4213 9.1097 10.4213 3.599 0 6.566-1.625 9.19-4.632 1.637-1.874 3.211-4.1933 4.49-6.2552.528 2.4211 1.531 4.7152 2.296 5.8912 2.273 3.492 5.908 5.67 10.162 5.67 10.174 0 16.5-10.9276 23.142-24.1274.851-1.6909 2.474-5.3064 3.625-7.8274-.251 6.4804-.511 13.5878-.511 19.865 0 4.0848.942 6.7178 2.472 8.4268 1.714 1.908 4.1 2.989 6.786 2.989 6.938 0 10.433-5.986 13.516-11.2684 5.886-10.0774 12.469-22.1709 15.956-28.6497.852 1.1809 1.85 2.5939 2.958 4.2085 4.302 6.2653 7.594 11.5056 7.594 17.1491 0 4.1814-1.163 7.1277-3.656 9.2777-2.1 1.8098-4.464 2.7688-8.094 2.7688-3.019 0-5.093-1.205-6.505-2.1605-1.509-1.0234-3.488-.9878-4.672.41-1.188 1.4065-.88 3.3695.391 4.7015 2.388 2.499 6.677 3.654 12.795 3.654 8.542-.382 15.589-2.815 21.448-7.456 4.367-3.4612 7.787-8.6066 11.094-13.581 3.973-5.9739 8.84-14.2926 11.709-19.2889 1.164 1.5265 2.646 3.5426 4.41 6.0806 3.757 5.4114 6.038 9.093 6.038 14.5841 0 7.5614-5.368 12.8422-13.053 12.8422-4.103 0-6.454-1.345-8.441-2.3396-.756-.3795-1.448-.5811-2.157-.5642-1.017.0237-1.995.4812-2.622 1.3673-1.064 1.5025-.634 3.4835.789 4.6485 1.34 1.097 5.095 3.56 12.431 3.56 11.817 0 19.837-8.081 19.837-19.3888 0-7.4056-3.119-12.4189-7.353-18.5165z" fill="currentColor"></path></svg>',
    },
  ].sort((a, b) => a.expanded.localeCompare(b.expanded))
);
