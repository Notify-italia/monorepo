import { CommonModule } from '@angular/common';
import { Component, ComponentRef, HostListener, Input } from '@angular/core';
import { INotifyFeedback } from '@notify/interfaces';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-feedbacks.component.html',
  styleUrl: './browse-feedbacks.component.scss',
})
export class BrowseFeedbacksComponent {
  @Input() cf!: ComponentRef<BrowseFeedbacksComponent>;
  @Input() feedbacks: INotifyFeedback[] = [];

  constructor() {}

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
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${id}`;
  }
}
