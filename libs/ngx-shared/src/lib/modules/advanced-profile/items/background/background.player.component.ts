import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  EnumNotifyAPBackgroundTypes,
  INotifyAPageSettings,
} from '@notify/interfaces';

@Component({
  selector: '[notify-ap-player-background]',
  standalone: true,
  imports: [CommonModule],
  template: `
    @switch (pageSettings.backgroundType) { @case (backgroundTypes.Fill) {
    <div
      [class]="baseClass"
      [ngStyle]="
        {
          'background-color': pageSettings.fill,
          'font-size': fontSize,
          color: textColor,
        }
        "
    >
      <ng-content></ng-content>
    </div>
    } }
  `,
})
export class BackgroundPlayerComponent {
  @Input() pageSettings!: INotifyAPageSettings;

  public backgroundTypes = EnumNotifyAPBackgroundTypes;

  public get baseClass(): string {
    return `w-full h-full fonts font-${this.pageSettings.font} text-[${this.pageSettings.textColor}]`;
  }

  public get fontSize() {
    return `${this.pageSettings.fontSize}px`;
  }

  public get textColor() {
    return this.pageSettings.textColor;
  }
}
