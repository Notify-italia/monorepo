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

  public getIcon(name: string): SvgBoxIcon | undefined {
    return this.availableIcons.find((i) => i.name === name);
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
    prefix: 'discord.gg/',
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
    placeholder: 'Percorso Git (es. user/repo)',
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

    set: 'octicons',
  },
  {
    expanded: 'Instagram',
    name: 'instagram',

    set: 'social',
    score: 11.11111111111111,
    prefix: 'https://instagram.com/',
    placeholder: 'Il tuo nome utente, senza "@"',
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

    placeholder: 'https://linkedin.com/in/...',
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
];
