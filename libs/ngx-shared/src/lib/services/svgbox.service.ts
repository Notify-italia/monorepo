import { Injectable, afterNextRender } from '@angular/core';

export interface SvgBoxIcon {
  expanded?: string;
  name: string;
  tags?: string[];
  set: string;
  score?: number;
  prefix?: string;
  placeholder?: string;
  publicPrefix?: string;
  data?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SvgboxService {
  public availableIcons: SvgBoxIcon[] = AVAILABLE_ICONS;

  constructor() {
    afterNextRender(() => {
      this._loadScript();
    });
  }

  public iconUrl(icon: SvgBoxIcon) {
    return `https://s2.svgbox.net/${icon.set}.svg?ic=${icon.name}`;
  }

  public getIcon(name: string, iconSet?: SvgBoxIcon[]): SvgBoxIcon | undefined {
    return (iconSet || this.availableIcons).find((i) => i.name === name);
  }

  public setIconSet(icons: SvgBoxIcon[]) {
    this.availableIcons = icons;
  }

  private _loadScript() {
    const node = document.createElement('script');
    node.src = 'https://unpkg.com/external-svg-loader@latest/svg-loader.min.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}

const AVAILABLE_ICONS: SvgBoxIcon[] = [
  {
    expanded: 'Apple Pay',
    name: 'applepay',
    set: 'social',
    score: 1,
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
    score: 1,
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
    score: 1,
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
    score: 1,
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
    score: 1,
    placeholder: 'https://facebook.com/people/...',
  },
  {
    expanded: 'Freelancer',
    name: 'freelancer',
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Github',
    name: 'github',
    set: 'social',
    score: 1,
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
    score: 1,
    prefix: 'mailto:',
    placeholder: 'Inserisci un indirizzo email',
  },
  { expanded: 'Google', name: 'google', set: 'social', score: 1 },
  {
    expanded: 'Calendario Google',
    name: 'googlecalendar',
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Google Drive',
    name: 'googledrive',
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Google Pay',
    name: 'googlepay',
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Play Store',
    name: 'googleplay',
    set: 'social',
    score: 1,
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
    score: 1,
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
    score: 1,
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
    score: 1,
  },
  { expanded: 'Tiktok', name: 'tiktok', set: 'social', score: 1 },
  { expanded: 'Trello', name: 'trello', set: 'social', score: 1 },
  { expanded: 'Twitch', name: 'twitch', set: 'social', score: 1 },
  { expanded: 'Twitter', name: 'twitter', set: 'social', score: 1 },
  { expanded: 'Udacity', name: 'udacity', set: 'social', score: 1 },
  { expanded: 'Venmo', name: 'venmo', set: 'social', score: 1 },
  { expanded: 'Youtube', name: 'youtube', set: 'social', score: 1 },
  { expanded: 'Zoom', name: 'zoom', set: 'social', score: 1 },
  {
    expanded: 'Sfoglia il menù',
    name: 'menu_book',
    set: 'materialui',
    score: 1,
  },
  {
    expanded: 'TripAdvisor',
    name: 'tripadvisor',
    set: 'social',
    score: 1,
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
    score: 1,
    data: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" xmlns:v="https://vecta.io/nano"><path d="M12 17.964l5.214-1.321 2.179 6.714L12 17.964zm12-8.678h-9.179L12 .643 9.179 9.286H0l7.429 5.357-2.821 8.643 7.429-5.357 4.571-3.286L24 9.286h0 0 0z"/></svg>`,
  },
  {
    expanded: 'Yelp',
    name: 'yelp',
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Spotify',
    name: 'spotify',
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Apple Music',
    name: 'applemusic',
    set: 'social',
    score: 1,
  },
];
