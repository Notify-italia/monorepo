import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  @Input({ required: true }) cf!: ComponentRef<FeedbackComponent>;
  @Input({ required: true }) profile!: INotifyProfile;

  constructor() {}

  public rating = 0;

  public availableRatings = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];

  public setRating(rating: number) {
    this.rating = rating;
  }

  public close() {
    this.cf.destroy();
  }
}
