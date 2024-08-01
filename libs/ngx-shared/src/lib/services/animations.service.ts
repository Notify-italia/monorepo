import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UnknownObject } from '@notify/interfaces';
import _ from 'lodash';

export enum EnumAnimationsDrivers {
  ScrollY = 'scrollY',
  ScrollX = 'scrollX',
  PageHeight = 'pageHeight',
  PageWidth = 'pageWidth',
}

interface IAnimationsDrivers {
  [EnumAnimationsDrivers.ScrollY]?: number;
  [EnumAnimationsDrivers.ScrollX]?: number;
  [EnumAnimationsDrivers.PageHeight]?: number;
  [EnumAnimationsDrivers.PageWidth]?: number;
}

interface _absoluteAnimationsDrivers {
  [EnumAnimationsDrivers.ScrollY]: number;
  [EnumAnimationsDrivers.ScrollX]: number;
  [EnumAnimationsDrivers.PageHeight]: number;
  [EnumAnimationsDrivers.PageWidth]: number;
}

interface IAnimationCSSStyle {
  [key: string]: string | number;
}

export type AnimationTransformer = {
  [key in EnumAnimationsDrivers]?: (
    driverValue: _absoluteAnimationsDrivers[key],
    element: HTMLElement
  ) => IAnimationCSSStyle;
};

@Injectable()
export class AnimationsService {
  private _platformId = inject(PLATFORM_ID);

  public presets = {
    blurInOut:
      (options?: { ignoreScaling?: boolean }) =>
      (
        driverValue: _absoluteAnimationsDrivers[EnumAnimationsDrivers.ScrollY],
        element: HTMLElement
      ) => {
        const visible = this.getVisiblePercentage(
          element,
          EnumAnimationsDrivers.ScrollY
        );

        const maxBlur = 6;
        const minScale = 0.6;

        return {
          filter: `blur(${maxBlur - (maxBlur * visible) / 100}px)`,
          transform: options?.ignoreScaling
            ? ''
            : `scale(${minScale + (1 - minScale) * (visible / 100)})`,
          ['will-change']: 'filter, transform',
        };
      },
  };

  private _drivers: IAnimationsDrivers = {
    [EnumAnimationsDrivers.ScrollY]: 0,
    [EnumAnimationsDrivers.ScrollX]: 0,
    [EnumAnimationsDrivers.PageHeight]: 0,
    [EnumAnimationsDrivers.PageWidth]: 0,
  };

  private _activeAnimations: {
    id: string;
    element: HTMLElement;
    transformers: AnimationTransformer;
  }[] = [];

  public get isCapable() {
    return isPlatformBrowser(this._platformId);
  }

  public constructor() {
    this._updateAnimations = _.throttle(this._updateAnimations.bind(this), 100);
    this.updateDriver = _.throttle(this.updateDriver.bind(this), 100);
  }

  public getAnimation(id: string) {
    return this._activeAnimations.find((v) => v.id === id);
  }

  public updateDriver<T extends EnumAnimationsDrivers>(
    driver: T,
    currentValue: _absoluteAnimationsDrivers[T]
  ) {
    this._drivers[driver] = currentValue;

    if (!this._activeAnimations.filter((v) => v.transformers[driver]).length) {
      return;
    }

    this._updateAnimations(currentValue);
  }

  public initDriver(
    driver: EnumAnimationsDrivers,
    currentValue: _absoluteAnimationsDrivers[EnumAnimationsDrivers]
  ) {
    this.updateDriver(driver, currentValue);
  }

  public updateDrivers(
    array: {
      driver: EnumAnimationsDrivers;
      currentValue: _absoluteAnimationsDrivers[EnumAnimationsDrivers];
    }[]
  ) {
    array.forEach((v) => this.updateDriver(v.driver, v.currentValue));
  }

  public declareAnimation(
    element: HTMLElement | string | null,
    transformers: AnimationTransformer
  ) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    if (typeof element === 'string') {
      element = document.querySelector(element) as HTMLElement;
    }

    if (!element) {
      return;
    }

    this._activeAnimations.push({
      id: element.id,
      element,
      transformers,
    });
  }

  public getVisiblePercentage(
    element: HTMLElement,
    driver: EnumAnimationsDrivers.ScrollY | EnumAnimationsDrivers.ScrollX
  ) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    if (driver === EnumAnimationsDrivers.ScrollY) {
      if (rect.bottom < 0 || rect.top > windowHeight) {
        return 0;
      }

      const visibleHeight =
        Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
      return (visibleHeight / rect.height) * 100;
    }

    if (driver === EnumAnimationsDrivers.ScrollX) {
      if (rect.right < 0 || rect.left > windowWidth) {
        return 0;
      }

      const visibleWidth =
        Math.min(windowWidth, rect.right) - Math.max(0, rect.left);
      return (visibleWidth / rect.width) * 100;
    }

    return 0;
  }

  private _updateAnimations(currentValue: UnknownObject) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    this._activeAnimations.forEach((animation) => {
      // if (!this._elementIsVisible(animation.element)) {
      //   return;
      // }

      const computedStyles = Object.values(animation.transformers)
        .map((value) => value(currentValue, animation.element))
        .filter((v) => v) as IAnimationCSSStyle[];

      animation.element.style.cssText = computedStyles.reduce((acc, style) => {
        return `${acc} ${Object.keys(style).reduce((acc, key) => {
          return `${acc} ${key}: ${style[key]};`;
        }, '')}`;
      }, '');
    });
  }

  private _elementIsVisible(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const html = document.documentElement;
    const windowHeight = window.innerHeight || html.clientHeight;
    const windowWidth = window.innerWidth || html.clientWidth;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= windowHeight &&
      rect.left <= windowWidth
    );
  }
}
