import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  INotifyAPageSettings,
} from '@notify/interfaces';

@Component({
  selector: '[notify-ap-player-page]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="baseClass" [ngStyle]="baseStyles">
      <ng-content></ng-content>
    </div>
  `,
})
export class PagePlayerComponent {
  @Input() pageSettings!: INotifyAPageSettings;

  public backgroundTypes = EnumNotifyAPBackgroundTypes;

  public get baseStyles() {
    switch (this.pageSettings.backgroundType) {
      case this.backgroundTypes.Fill:
        return {
          'background-color': this.pageSettings.fill,
          'font-size': this.fontSize,
          color: this.textColor,
        };
      case this.backgroundTypes.Gradient:
        return {
          'font-size': this.fontSize,
          color: this.textColor,
          background: `linear-gradient(${this._gradientDirection},${this.gradientStops})`,
        };
      case this.backgroundTypes.Image:
        return {
          'font-size': this.fontSize,
          color: this.textColor,
          'background-image': `url(${this.pageSettings.imgSrc})`,
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-attachment': 'fixed',
        };
    }

    return { 'font-size': this.fontSize, color: this.textColor };
  }

  public get baseClass(): string {
    return `size-full fonts font-${this.pageSettings.font} text-[${this.pageSettings.textColor}] `;
  }

  public get fontSize() {
    return `${this.pageSettings.fontSize}px`;
  }

  public get textColor() {
    return this.pageSettings.textColor;
  }

  public get gradientStops() {
    const gradient = this.pageSettings.gradient;

    if (!gradient.colors.length) {
      return ['#000000', '#000000'];
    }

    if (gradient.colors.length === 1) {
      return [gradient.colors[0].value, gradient.colors[0].value];
    }

    return gradient.colors.map((stop) => stop.value).join(', ');
  }

  private get _gradientDirection() {
    const gradient = this.pageSettings.gradient;

    switch (gradient.direction) {
      case EnumNotifyAPDirections.Horizontal:
        return '90deg';
      case EnumNotifyAPDirections.Vertical:
        return '180deg';
      default:
        return '180deg';
    }
  }
}
