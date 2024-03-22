import { CommonModule } from '@angular/common';
import { Component, ComponentRef, HostListener, Input } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import {
  EnumDicebearAvatarStyles,
  UtilsService,
} from '@notify/nfc-app-services';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService],
  templateUrl: './browse-feedbacks.component.html',
  styleUrl: './browse-feedbacks.component.scss',
})
export class BrowseFeedbacksComponent {
  @Input() cf!: ComponentRef<BrowseFeedbacksComponent>;
  @Input() feedbacks: INotifyFeedback[] = [];

  constructor(private _utils: UtilsService) {}

  @HostListener(`document:keydown.escape`)
  public close() {
    this.cf.destroy();
  }

  public get sortedFeedbacks() {
    return this.feedbacks
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((feedback) => ({
        ...feedback,
        avatar: this._generateAvatar(feedback._id),
      }));
  }

  private _generateAvatar(id: string) {
    return this._utils.diceBearAvatar({
      style: EnumDicebearAvatarStyles.Lorelei,
      seed: id,
    });
  }
}
