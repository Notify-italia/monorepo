import { Injectable } from '@angular/core';

export interface SvgBoxIcon {
  expanded?: string;
  name: string;
  tags?: string[];
  set: string;
  score?: number;
  prefix?: string;
  placeholder?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SvgboxService {
  public availableIcons: SvgBoxIcon[] = AVAILABLE_ICONS;

  constructor() {
    this._loadScript();
  }

  public iconUrl(icon: SvgBoxIcon) {
    return `https://s2.svgbox.net/${icon.set}.svg?ic=${icon.name}`;
  }

  private _loadScript() {
    console.log('preparing to load...');
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
    expanded: 'Applepay',
    name: 'applepay',
    tags: [],
    set: 'social',
    score: 1,
  },

  {
    expanded: 'Appstore',
    name: 'appstore',
    tags: [],
    set: 'social',
    score: 12.5,
    prefix: 'https://apps.apple.com/it/app/',
  },

  {
    expanded: 'Deviantart',
    name: 'deviantart',
    tags: [],
    set: 'social',
    score: 1,
    prefix: 'https://deviantart.com/',
  },

  {
    expanded: 'Discord',
    name: 'discord',
    tags: [],
    set: 'social',
    score: 14.285714285714286,
    prefix: 'discord.gg/',
  },
  {
    expanded: 'Dribbble',
    name: 'dribbble',
    tags: [],
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Dropbox',
    name: 'dropbox',
    tags: [],
    set: 'social',
    score: 20,
  },
  {
    expanded: 'Ebay',
    name: 'ebay',
    tags: [],
    set: 'social',
    score: 1,
    prefix: 'https://ebay.it/usr/',
  },
  {
    expanded: 'Etsy',
    name: 'etsy',
    tags: [],
    set: 'social',
    score: 25,
    prefix: 'https://etsy.com/it/shop/',
  },
  {
    expanded: 'Facebook',
    name: 'facebook',
    tags: [],
    set: 'social',
    score: 1,
    placeholder: 'https://facebook.com/people/...',
  },
  {
    expanded: 'Freelancer',
    name: 'freelancer',
    tags: [],
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Github',
    name: 'github',
    tags: [],
    set: 'social',
    score: 1,
    prefix: 'https://github.com/',
    placeholder: 'Il tuo nome utente Github',
  },
  {
    expanded: 'Glassdoor',
    name: 'glassdoor',
    tags: [],
    set: 'social',
    score: 11.11111111111111,
  },
  {
    expanded: 'Gmail',
    name: 'gmail',
    tags: [],
    set: 'social',
    score: 1,
    prefix: 'mailto:',
    placeholder: 'Inserisci un indirizzo email',
  },
  { expanded: 'Google', name: 'google', tags: [], set: 'social', score: 1 },
  {
    expanded: 'Googlecalendar',
    name: 'googlecalendar',
    tags: [],
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Googledrive',
    name: 'googledrive',
    tags: [],
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Googlepay',
    name: 'googlepay',
    tags: [],
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Googleplay',
    name: 'googleplay',
    tags: [],
    set: 'social',
    score: 1,
  },
  {
    expanded: 'Instagram',
    name: 'instagram',
    tags: [],
    set: 'social',
    score: 11.11111111111111,
    prefix: 'https://instagram.com/',
    placeholder: 'Il tuo nome utente, senza "@"',
  },
  {
    expanded: 'Kickstarter',
    name: 'kickstarter',
    tags: [],
    set: 'social',
    score: 9.090909090909092,
    prefix: 'https://kickstarter.com/projects/',
  },
  { expanded: 'Line', name: 'line', tags: [], set: 'social', score: 1 },
  {
    expanded: 'Linkedin',
    name: 'linkedin',
    tags: [],
    set: 'social',
    score: 1,

    placeholder: 'https://linkedin.com/in/...',
  },
  {
    expanded: 'Map',
    name: 'map',
    tags: [],
    set: 'hero-solid',
    score: 100,
  },
  { expanded: 'Meetup', name: 'meetup', tags: [], set: 'social', score: 1 },
  {
    expanded: 'Messenger',
    name: 'messenger',
    tags: [],
    set: 'social',
    score: 11.11111111111111,
  },
  {
    expanded: 'Myspace',
    name: 'myspace',
    tags: [],
    set: 'social',
    score: 14.285714285714286,
  },
  { expanded: 'Patreon', name: 'patreon', tags: [], set: 'social', score: 1 },
  { expanded: 'Paypal', name: 'paypal', tags: [], set: 'social', score: 1 },
  {
    expanded: 'Producthunt',
    name: 'producthunt',
    tags: [],
    set: 'social',
    score: 1,
  },
  { expanded: 'Reddit', name: 'reddit', tags: [], set: 'social', score: 1 },
  {
    expanded: 'Signal',
    name: 'signal',
    tags: [],
    set: 'social',
    score: 16.666666666666668,
  },
  { expanded: 'Skype', name: 'skype', tags: [], set: 'social', score: 20 },
  {
    expanded: 'Snapchat',
    name: 'snapchat',
    tags: [],
    set: 'social',
    score: 12.5,
  },
  {
    expanded: 'Telegram',
    name: 'telegram',
    tags: [],
    set: 'social',
    score: 1,
  },
  { expanded: 'Tiktok', name: 'tiktok', tags: [], set: 'social', score: 1 },
  { expanded: 'Trello', name: 'trello', tags: [], set: 'social', score: 1 },
  { expanded: 'Twitch', name: 'twitch', tags: [], set: 'social', score: 1 },
  { expanded: 'Twitter', name: 'twitter', tags: [], set: 'social', score: 1 },
  { expanded: 'Udacity', name: 'udacity', tags: [], set: 'social', score: 1 },
  { expanded: 'Venmo', name: 'venmo', tags: [], set: 'social', score: 1 },
  { expanded: 'Youtube', name: 'youtube', tags: [], set: 'social', score: 1 },
  { expanded: 'Zoom', name: 'zoom', tags: [], set: 'social', score: 1 },
];
