import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';
import { ModalBaseComponent } from '../../constructors/modal.base.component';
import { EnumDicebearAvatarStyles, UtilsService } from '../../services';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService],
  templateUrl: './browse-feedbacks.component.html',
  styleUrl: './browse-feedbacks.component.scss',
})
export class BrowseFeedbacksComponent extends ModalBaseComponent {
  @Input() feedbacks: INotifyFeedback[] = [];

  constructor(private _utils: UtilsService) {
    super();
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
